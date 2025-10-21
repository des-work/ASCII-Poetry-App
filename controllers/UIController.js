/**
 * UIController - Remade with Clean Architecture
 * Single Responsibility: Coordinate user interactions and route to appropriate handlers
 * 
 * This controller:
 * - Manages DOM element caching
 * - Routes button clicks to handlers
 * - Listens to generation events and updates UI accordingly
 * - Shows notifications and loading states
 * 
 * It does NOT:
 * - Generate ASCII art (delegated to GenerationService)
 * - Manage output rendering (delegated to DisplayManager/OutputRenderer)
 * - Manage input validation (delegated to InputReader)
 */

class UIController {
    constructor(eventBus, config, inputReader, inputValidator, outputPanel) {
        this.eventBus = eventBus;
        this.config = config;
        this.inputReader = inputReader;
        this.validator = inputValidator;
        this.outputPanel = outputPanel;
        this.dom = {};
        this.state = {
            currentMode: 'text',
            isGenerating: false
        };
        
        this.initialize();
    }

    /**
     * Initialize - cache DOM and setup listeners
     */
    initialize() {
        console.log('🕹️ UIController: Initializing...');
        
        try {
            this.cacheDOM();
            this.attachEventListeners();
            this.subscribeToEvents();
            this.setInitialMode('text');
            
            console.log('✅ UIController: Initialized');
        } catch (error) {
            console.error('❌ UIController: Initialization error:', error);
        }
    }

    /**
     * Cache all DOM elements for performance
     */
    cacheDOM() {
        this.dom = {
            // Buttons
            generateBtn: document.getElementById('generate-main'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            clearBtn: document.getElementById('clear-btn'),
            themeBtn: document.getElementById('theme-btn'),
            autoDetectBtn: document.getElementById('auto-detect-btn'),

            // Mode tabs
            modeButtons: document.querySelectorAll('.mode-btn'),
            modeContents: document.querySelectorAll('.mode-content'),

            // Inputs
            textInput: document.getElementById('text-input'),
            imageInput: document.getElementById('image-input'),
            poemInput: document.getElementById('poem-input'),

            // Options
            fontSelect: document.getElementById('font-select'),
            colorSelect: document.getElementById('color-select'),
            animationSelect: document.getElementById('animation-select'),
            imageWidthSlider: document.getElementById('image-width'),
            imageCharsSelect: document.getElementById('image-chars'),
            poetryLayoutSelect: document.getElementById('poetry-layout'),
            poetryDecorationSelect: document.getElementById('poetry-decoration'),
            keywordsInput: document.getElementById('keywords-input'),
            keywordChipsContainer: document.getElementById('keyword-chips'),

            // Indicators
            loading: document.getElementById('loading-indicator'),
            notification: null,
            outputStats: document.getElementById('output-stats')
        };

        // Validate critical elements exist
        this.validateCriticalElements();

        console.log('📦 UIController: DOM cached');
    }

    /**
     * Validate that critical DOM elements exist
     */
    validateCriticalElements() {
        const critical = {
            generateBtn: 'generate-main',
            textInput: 'text-input',
            fontSelect: 'font-select',
            colorSelect: 'color-select'
        };

        const missing = [];
        for (const [key, id] of Object.entries(critical)) {
            if (!this.dom[key]) {
                missing.push(`#${id}`);
                console.warn(`⚠️ UIController: Critical element missing: #${id}`);
            }
        }

        if (missing.length > 0) {
            console.error(`❌ UIController: Missing critical elements: ${missing.join(', ')}. Check HTML structure.`);
            // Emit error event for user
            this.eventBus.emit(EventBus.Events.NOTIFICATION_SHOW, {
                message: `❌ Application error: Missing UI elements. Please refresh the page.`,
                type: 'error'
            });
        }
    }

    /**
     * Attach DOM event listeners
     */
    attachEventListeners() {
        // NOTE: Button clicks are now handled by ButtonController's event delegation
        // Only attach non-button specific listeners here

        // Input validation listeners (for real-time button state updates)
        this.dom.textInput?.addEventListener('input', () => this.updateGenerateButtonState());
        this.dom.imageInput?.addEventListener('change', () => this.updateGenerateButtonState());
        this.dom.poemInput?.addEventListener('input', () => this.updateGenerateButtonState());

        // Keyword input (not a button)
        if (this.dom.keywordsInput) {
            this.dom.keywordsInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addKeyword(this.dom.keywordsInput.value);
                    this.dom.keywordsInput.value = '';
                }
            });
        }

        console.log('📌 UIController: Event listeners attached (buttons handled by delegation)');
    }

    /**
     * Subscribe to generation events
     */
    subscribeToEvents() {
        // Button click events
        this.eventBus.on('ui:generate:click', () => this.onGenerateClick());
        this.eventBus.on('ui:copy:click', () => this.onCopyClick());
        this.eventBus.on('ui:download:click', () => this.onDownloadClick());
        this.eventBus.on('ui:clear:click', () => this.onClearClick());
        this.eventBus.on('ui:mode:switch', (data) => this.switchMode(data.mode));

        // Generation start
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_START, () => this.onGenerationStart('text'));
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_START, () => this.onGenerationStart('image'));
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_START, () => this.onGenerationStart('poetry'));

        // Generation complete
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => this.onGenerationComplete(result));
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_COMPLETE, (result) => this.onGenerationComplete(result));
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_COMPLETE, (result) => this.onGenerationComplete(result));

        // Generation errors
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_ERROR, (error) => this.onGenerationError(error));
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_ERROR, (error) => this.onGenerationError(error));
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_ERROR, (error) => this.onGenerationError(error));

        // UI notifications (for warnings, status updates)
        this.eventBus.on('ui:notification', (notification) => this.showNotification(notification.message, notification.type));

        console.log('🔗 UIController: Event subscriptions complete');
    }

    /**
     * BUTTON CLICK HANDLERS
     */

    onGenerateClick() {
        console.log('🎨 UIController: Generate clicked');
        
        if (this.state.isGenerating) {
            this.showNotification('⏳ Please wait for current generation to complete', 'warning');
            return;
        }

        try {
            const { ok, options, error } = this.inputReader.readTextOptions();
            
            if (!ok) {
                this.showNotification(`⚠️ ${error}`, 'warning');
                return;
            }

            this.disableGenerateButton();
            
            // Emit generation request
            this.eventBus.emit('request:text:gen', options);
            console.log('📤 UIController: Generation request emitted');
        } catch (error) {
            console.error('❌ UIController: Generate error:', error);
            this.showNotification('❌ Error: ' + error.message, 'error');
            this.enableGenerateButton();
        }
    }

    onCopyClick() {
        console.log('📋 UIController: Copy clicked');
        if (!this.outputPanel || !this.outputPanel.hasContent()) {
            this.showNotification('⚠️ Nothing to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.outputPanel.getOutput())
            .then(() => this.showNotification('✅ Copied to clipboard', 'success'))
            .catch(err => this.showNotification('❌ Copy failed', 'error'));
    }

    onDownloadClick() {
        console.log('💾 UIController: Download clicked');
        if (!this.outputPanel || !this.outputPanel.hasContent()) {
            this.showNotification('⚠️ Nothing to download', 'warning');
            return;
        }

        const blob = new Blob([this.outputPanel.getOutput()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-art-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('✅ Downloaded successfully', 'success');
    }

    onClearClick() {
        console.log('🗑️ UIController: Clear clicked');
        if (this.outputPanel) {
            this.outputPanel.clear();
            this.showNotification('🗑️ Cleared', 'info');
        }
    }

    onThemeClick() {
        console.log('🌙 UIController: Theme clicked');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {}
        this.dom.themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        console.log('✅ Theme changed to:', newTheme);
    }

    onAutoDetectClick() {
        console.log('🔍 UIController: Auto-detect keywords clicked');
        this.showNotification('✨ Auto-detect feature coming soon', 'info');
    }

    /**
     * GENERATION EVENT HANDLERS
     */

    onGenerationStart(type) {
        console.log('⏳ UIController: Generation started -', type);
        this.state.isGenerating = true;
        this.showLoading(true);
        this.disableGenerateButton();
    }

    onGenerationComplete(result) {
        console.log('✅ UIController: Generation complete', {
            success: result.success,
            asciiLength: result.ascii?.length
        });
        
        this.state.isGenerating = false;
        this.showLoading(false);
        this.enableGenerateButton();

        if (!result.success || !result.ascii) {
            this.showNotification('❌ Generation failed', 'error');
            return;
        }

        // Update stats if available
        if (result.ascii && this.dom.outputStats) {
            const lines = result.ascii.split('\n');
            const width = Math.max(...lines.map(l => l.length));
            const height = lines.length;
            this.dom.outputStats.textContent = `${width}×${height}, ${result.ascii.length} chars`;
        }

        this.showNotification('✨ Generation complete!', 'success');
    }

    onGenerationError(error) {
        console.error('❌ UIController: Generation error:', error);
        
        this.state.isGenerating = false;
        this.showLoading(false);
        this.enableGenerateButton();

        const message = typeof error === 'string' ? error : (error?.message || 'Unknown error');
        this.showNotification(`❌ ${message}`, 'error');
    }

    /**
     * MODE MANAGEMENT
     */

    switchMode(mode) {
        // Validate mode
        const validModes = ['text', 'image', 'poetry'];
        
        if (!validModes.includes(mode)) {
            console.error(`❌ UIController: Invalid mode "${mode}". Valid modes: ${validModes.join(', ')}`);
            this.showNotification(`Invalid mode: "${mode}"`, 'error');
            return;
        }

        console.log('🔄 UIController: Switching mode to:', mode);
        
        if (this.state.currentMode === mode) return;
        this.state.currentMode = mode;

        // Update button states
        this.dom.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update content visibility
        this.dom.modeContents.forEach(content => {
            content.classList.toggle('active', content.id === `${mode}-mode`);
        });

        // Show/hide poetry options
        document.querySelectorAll('.poetry-only').forEach(el => {
            el.style.display = mode === 'poetry' ? 'flex' : 'none';
        });

        this.updateGenerateButtonState();
        console.log('✅ Mode switched to:', mode);
    }

    setInitialMode(mode) {
        this.switchMode(mode);
    }

    /**
     * UI STATE MANAGEMENT
     */

    updateGenerateButtonState() {
        if (!this.dom.generateBtn) return;

        let canGenerate = false;

        switch (this.state.currentMode) {
            case 'text':
                canGenerate = !!(this.dom.textInput?.value?.trim());
                break;
            case 'image':
                canGenerate = !!(this.dom.imageInput?.files?.[0]);
                break;
            case 'poetry':
                canGenerate = !!(this.dom.poemInput?.value?.trim());
                break;
        }

        this.dom.generateBtn.disabled = !canGenerate;
        this.dom.generateBtn.classList.toggle('disabled', !canGenerate);
    }

    disableGenerateButton() {
        if (this.dom.generateBtn) {
            this.dom.generateBtn.disabled = true;
            this.dom.generateBtn.classList.add('disabled');
        }
    }

    enableGenerateButton() {
        if (this.dom.generateBtn) {
            this.dom.generateBtn.disabled = false;
            this.dom.generateBtn.classList.remove('disabled');
        }
        this.updateGenerateButtonState();
    }

    showLoading(show) {
        if (this.dom.loading) {
            this.dom.loading.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * NOTIFICATIONS
     */

    showNotification(message, type = 'info') {
        console.log(`📢 UIController: ${type.toUpperCase()} - ${message}`);

        if (!this.dom.notification) {
            const notif = document.createElement('div');
            notif.id = 'notification';
            notif.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, rgba(18, 18, 26, 0.95) 0%, rgba(26, 26, 40, 0.95) 100%);
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid rgba(102, 126, 234, 0.3);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(notif);
            this.dom.notification = notif;
        }

        this.dom.notification.textContent = message;
        this.dom.notification.style.opacity = '1';

        setTimeout(() => {
            if (this.dom.notification) {
                this.dom.notification.style.opacity = '0';
            }
        }, 3000);
    }

    /**
     * KEYWORD MANAGEMENT
     */

    addKeyword(keyword) {
        if (!keyword || !keyword.trim()) return;
        
        const trimmed = keyword.trim();
        if (this.dom.keywordChipsContainer) {
            const chip = document.createElement('div');
            chip.className = 'keyword-chip';
            chip.textContent = trimmed;
            chip.addEventListener('click', () => chip.remove());
            this.dom.keywordChipsContainer.appendChild(chip);
        }
    }

    /**
     * UTILITIES
     */

    getState() {
        return { ...this.state };
    }

    getCurrentMode() {
        return this.state.currentMode;
    }

    /**
     * RECOVERY AND ERROR HANDLING
     */

    /**
     * Recover from error state
     */
    recover() {
        console.log('🔄 UIController: Attempting recovery...');
        
        try {
            // Reset state
            this.state.isGenerating = false;
            
            // Reset UI
            this.showLoading(false);
            this.enableGenerateButton();
            
            // Reset output
            if (this.outputPanel) {
                this.outputPanel.setDefaultState();
            }
            
            // Clear notifications
            this.clearNotification();
            
            console.log('✅ UIController: Recovery complete');
            return true;
        } catch (error) {
            console.error('❌ UIController: Recovery failed:', error);
            return false;
        }
    }

    /**
     * Hard reset - reinitialize critical components
     */
    hardReset() {
        console.log('⚠️  UIController: Performing hard reset...');
        
        try {
            // Unsubscribe from events
            if (this.eventBus && this.eventBus.cleanup) {
                this.eventBus.cleanup();
            }
            
            // Reset state
            this.state = {
                currentMode: 'text',
                isGenerating: false
            };
            
            // Re-cache DOM
            this.cacheDOM();
            
            // Re-attach listeners
            this.attachEventListeners();
            
            // Re-subscribe to events
            this.subscribeToEvents();
            
            // Reset UI
            this.showLoading(false);
            this.enableGenerateButton();
            
            // Reset output
            if (this.outputPanel) {
                this.outputPanel.setDefaultState();
            }
            
            console.log('✅ UIController: Hard reset complete');
            this.showNotification('🔄 Application reset', 'info');
            return true;
        } catch (error) {
            console.error('❌ UIController: Hard reset failed:', error);
            this.showNotification('❌ Reset failed', 'error');
            return false;
        }
    }

    /**
     * Clear notifications
     */
    clearNotification() {
        if (this.dom?.notification) {
            this.dom.notification.textContent = '';
            this.dom.notification.className = 'notification';
        }
    }

    /**
     * Handle critical errors
     */
    handleCriticalError(error) {
        console.error('🚨 UIController: Critical error:', error);
        
        // Show error to user
        this.showNotification(`🚨 Critical error: ${error.message || 'Unknown error'}`, 'error');
        
        // Reset UI state
        this.state.isGenerating = false;
        this.showLoading(false);
        this.enableGenerateButton();
        
        // Suggest recovery
        console.log('💡 Tip: Use window.app.uiController.recover() to recover, or hardReset() for full reset');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
