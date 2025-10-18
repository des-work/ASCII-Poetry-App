/**
 * UI Controller
 * Manages all UI interactions and updates
 */

class UIController {
    constructor(eventBus, config, fontManager, asciiRenderer, validator) {
        this.eventBus = eventBus;
        this.config = config;
        this.fontManager = fontManager;
        this.renderer = asciiRenderer;
        this.validator = validator;
        this.dom = {}; // Use 'dom' to be more specific than 'elements'
        this.state = {
            currentTab: 'text',
            theme: this.config?.ui?.theme?.default || 'dark',
            isLoading: false,
            keywords: new Set()
        };
        
        this.initialize();
        // Expose for debugging
        window.ui = this;
    }


    /**
     * Initialize UI controller
     */
    initialize() {
        this.cacheElements();
        this.attachEventListeners();
        this.initializeTheme();
        this.initializeAnimatedTitle();
        console.log('🕹️ UIController initialized');
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.dom = {
            // Tabs
            modeButtons: document.querySelectorAll('.mode-btn'),
            modeContents: document.querySelectorAll('.mode-content'),
            
            // Output
            output: document.getElementById('ascii-output'),
            
            // Controls
            generateBtn: document.getElementById('generate-main'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            clearBtn: document.getElementById('clear-btn'),
            themeBtn: document.getElementById('theme-btn'),
            
            // Inputs
            textInput: document.getElementById('text-input'),
            imageInput: document.getElementById('image-input'),
            poemInput: document.getElementById('poem-input'),

            // Options
            fontSelect: document.getElementById('font-select'),
            colorSelect: document.getElementById('color-select'),
            animationSelect: document.getElementById('animation-select'),
            imageWidthSlider: document.getElementById('image-width'),
            imageWidthValue: document.getElementById('width-value'),
            imageCharsSelect: document.getElementById('image-chars'),
            poetryLayoutSelect: document.getElementById('poetry-layout'),
            poetryDecorationSelect: document.getElementById('poetry-decoration'),

            // Keyword System
            keywordsInput: document.getElementById('keywords-input'),
            autoDetectBtn: document.getElementById('auto-detect-btn'),
            keywordChipsContainer: document.getElementById('keyword-chips'),

            // Loading
            loading: document.getElementById('loading-indicator'),
            
            // Notification
            notification: document.getElementById('notification'),

            // Title
            asciiTitle: document.getElementById('ascii-title'),
        };
    }

    /**
     * Attach DOM event listeners
     */
    attachEventListeners() {
        // Mode switching
        this.dom.modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) this.switchMode(mode);
            });
        });

        // Main Generate Button
        if (this.dom.generateBtn) {
            console.log('✅ Attaching event listener to generate button');
            this.dom.generateBtn.addEventListener('click', () => {
                console.log('🖱️ Generate button clicked!');
                this.handleGenerateClick();
            });
        } else {
            console.warn('⚠️ Generate button not found!');
        }

        // Output controls
        if (this.dom.copyBtn) {
            console.log('✅ Attaching event listener to copy button');
            this.dom.copyBtn.addEventListener('click', () => {
                console.log('🖱️ Copy button clicked!');
                this.copyToClipboard();
            });
        } else {
            console.warn('⚠️ Copy button not found!');
        }

        if (this.dom.downloadBtn) {
            console.log('✅ Attaching event listener to download button');
            this.dom.downloadBtn.addEventListener('click', () => {
                console.log('🖱️ Download button clicked!');
                this.downloadOutput();
            });
        } else {
            console.warn('⚠️ Download button not found!');
        }

        if (this.dom.clearBtn) {
            console.log('✅ Attaching event listener to clear button');
            this.dom.clearBtn.addEventListener('click', () => {
                console.log('🖱️ Clear button clicked!');
                this.clearOutput();
            });
        } else {
            console.warn('⚠️ Clear button not found!');
        }

        // Theme toggle
        if (this.dom.themeBtn) {
            this.dom.themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Image width slider
        if (this.dom.imageWidthSlider) {
            this.dom.imageWidthSlider.addEventListener('input', (e) => {
                if (this.dom.imageWidthValue) {
                    this.dom.imageWidthValue.textContent = e.target.value;
                }
            });
        }

        // Keyword input handling
        if (this.dom.keywordsInput) {
            this.dom.keywordsInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.dom.keywordsInput.value) {
                    e.preventDefault();
                    this.addKeyword(this.dom.keywordsInput.value.trim());
                    this.dom.keywordsInput.value = '';
                }
            });
        }

        // Auto-detect keywords button
        if (this.dom.autoDetectBtn) {
            this.dom.autoDetectBtn.addEventListener('click', () => this.autoDetectKeywords());
        }

        if (this.dom.keywordChipsContainer) {
            this.dom.keywordChipsContainer.addEventListener('click', (e) => this.handleChipClick(e));
        }
    }

    /**
     * Subscribe to event bus events
     */
    subscribeToEvents() {
        // Notification events
        this.eventBus.on(EventBus.Events.NOTIFICATION_SHOW, (data) => {
            this.showNotification(data.message, data.type);
        });
        
        // Generation complete events
        const onGenerationStart = () => this.showLoading();
        const onGenerationEnd = () => this.hideLoading();

        this.eventBus.on(EventBus.Events.TEXT_GENERATION_START, onGenerationStart);
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => {
            console.log('📥 UIController received TEXT_GENERATION_COMPLETE');
            onGenerationEnd();
            this.displayOutput({
                ascii: result.ascii,
                color: result.metadata?.color,
                animation: result.metadata?.animation
            });
            this.showNotification('✨ Text art generated!', 'success');
        });
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_ERROR, (error) => {
            onGenerationEnd();
            this.showNotification(`❌ ${error.message}`, 'error');
        });

        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_START, onGenerationStart);
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_COMPLETE, (result) => {
            onGenerationEnd();
            this.displayOutput({
                ascii: result.ascii,
                color: 'none',
                animation: 'none'
            });
            this.showNotification('✨ Image art generated!', 'success');
        });
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_ERROR, (error) => {
            onGenerationEnd();
            this.showNotification(`❌ ${error.message}`, 'error');
        });

        this.eventBus.on(EventBus.Events.POETRY_GENERATION_START, onGenerationStart);
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_COMPLETE, (result) => {
            onGenerationEnd();
            this.displayOutput({
                ascii: result.ascii,
                color: result.metadata?.color,
                animation: result.metadata?.animation
            });
            this.showNotification('✨ Poetry art generated!', 'success');
        });
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_ERROR, (error) => {
            onGenerationEnd();
            this.showNotification(`❌ ${error.message}`, 'error');
        });
    }

    /**
     * Handles the main "Generate" button click and dispatches to the correct service request.
     */
    handleGenerateClick() {
        console.log('🎨 handleGenerateClick called, current mode:', this.state.currentTab);

        switch (this.state.currentTab) {
            case 'text':
                const textOptions = {
                    text: this.dom.textInput?.value || '',
                    fontName: this.dom.fontSelect?.value || 'standard',
                    color: this.dom.colorSelect?.value || 'none',
                    animation: this.dom.animationSelect?.value || 'none',
                };
                console.log('📤 Emitting REQUEST_TEXT_GENERATION');
                this.eventBus.emit(EventBus.Events.REQUEST_TEXT_GENERATION, textOptions);
                break;

            case 'image':
                const imageFile = this.dom.imageInput?.files?.[0];
                if (!imageFile) {
                    console.warn('⚠️ No image file selected');
                    this.showNotification('Please select an image first', 'error');
                    return;
                }
                const imageOptions = {
                    file: imageFile,
                    width: parseInt(this.dom.imageWidthSlider?.value || '80', 10),
                    charSet: this.dom.imageCharsSelect?.value || 'standard',
                };
                console.log('📤 Emitting REQUEST_IMAGE_GENERATION');
                this.eventBus.emit(EventBus.Events.REQUEST_IMAGE_GENERATION, imageOptions);
                break;

            case 'poetry':
                const poetryOptions = {
                    poem: this.dom.poemInput?.value || '',
                    fontName: this.dom.fontSelect?.value || 'mini',
                    layout: this.dom.poetryLayoutSelect?.value || 'centered',
                    decoration: this.dom.poetryDecorationSelect?.value || 'none',
                    color: this.dom.colorSelect?.value || 'none',
                    animation: this.dom.animationSelect?.value || 'none',
                    keywords: Array.from(this.state.keywords)
                };
                console.log('📤 Emitting REQUEST_POETRY_GENERATION');
                this.eventBus.emit(EventBus.Events.REQUEST_POETRY_GENERATION, poetryOptions);
                break;

            default:
                console.error(`❌ Unknown generation mode: ${this.state.currentTab}`);
                this.showNotification('Unknown mode selected', 'error');
        }
    }

    initializeTheme() {
        try {
            const savedTheme = localStorage.getItem(this.config?.storage?.keys?.theme || 'theme') || this.config?.ui?.theme?.default || 'dark';
            this.setTheme(savedTheme);
        } catch (error) {
            console.error('Error initializing theme:', error);
            this.setTheme('dark'); // Fallback
        }
    }

    /**
     * Switch active tab
     * @param {string} tabName - Name of the tab
     */
    switchMode(mode) {
        try {
            if (this.state.currentTab === mode) return;
            console.log('📑 Switching to mode:', mode);
            this.state.currentTab = mode;
            
            // Update button states
            this.dom.modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });

            // Update tab content visibility
            this.dom.modeContents.forEach(content => {
                content.classList.toggle('active', content.id === `${mode}-mode`);
            });

            // Show/hide poetry-specific options
            const poetryOptions = document.querySelectorAll('.poetry-only');
            poetryOptions.forEach(opt => {
                opt.style.display = mode === 'poetry' ? 'flex' : 'none';
            });

            // Update font options based on mode
            this.updateFontOptions(mode);

            this.eventBus.emit(EventBus.Events.TAB_CHANGED, { tab: mode });
        } catch (error) {
            console.error('Error switching mode:', error);
        }
    }

    updateFontOptions(mode) {
        const fontOption = this.dom.fontSelect.closest('.compact-option');
        if (!fontOption) return;

        fontOption.style.display = (mode === 'image') ? 'none' : 'flex';
    }

    /**
     * Display ASCII art output
     * @param {Object} data - Output data
     */
    displayOutput(data) {
        try {
            this.renderer.renderToElement(this.dom.output, data);
        } catch (error) {
            console.error('❌ Error displaying output:', error);
            console.error('Stack:', error.stack);
            this.showNotification(`Failed to display output: ${error.message}`, 'error');
        }
    }

    /**
     * Display poetry-specific output
     * @param {Object} result - Generation result
     */
    // This method is now redundant as its logic is handled by the renderer
    // and the POETRY_GENERATION_COMPLETE event handler.
    // displayPoetryOutput(result) { ... }

    // --- Keyword Management ---

    addKeyword(keyword) {
        const validation = this.validator.validateKeyword(keyword, this.state.keywords.size);
        if (!validation.valid) {
            this.showNotification(`⚠️ ${validation.error}`, 'warning');
            return;
        }

        if (this.state.keywords.has(validation.value)) {
            this.showNotification('⚠️ Keyword already added!', 'warning');
            return;
        }

        this.state.keywords.add(validation.value);
        this.renderKeywordChips();
    }

    removeKeyword(keyword) {
        this.state.keywords.delete(keyword);
        this.renderKeywordChips();
    }

    renderKeywordChips() {
        if (!this.dom.keywordChipsContainer) return;

        this.dom.keywordChipsContainer.innerHTML = '';
        this.state.keywords.forEach(keyword => {
            const chip = document.createElement('div');
            chip.className = 'keyword-chip';
            chip.textContent = keyword;
            chip.dataset.keyword = keyword;
            this.dom.keywordChipsContainer.appendChild(chip);
        });
    }

    handleChipClick(event) {
        const keyword = event.target.dataset.keyword;
        if (keyword) {
            this.removeKeyword(keyword);
        }
    }

    autoDetectKeywords() {
        const poem = this.dom.poemInput?.value;
        if (!poem || !poem.trim()) {
            this.showNotification('⚠️ Please enter a poem first!', 'warning');
            return;
        }

        try {
            const config = this.config?.poetry || {};
            const commonWords = new Set(config.commonWords || []);
            const minLength = config.autoDetect?.minWordLength || 4;
            const maxKeywords = config.autoDetect?.maxKeywords || 5;

            // Extract words and count their frequency
            const words = poem.toLowerCase().match(/\b[a-z]+\b/g) || [];
            const wordCount = {};
            
            words.forEach(word => {
                if (!commonWords.has(word) && word.length >= minLength) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });

            // Get top keywords based on frequency and length
            const detectedKeywords = Object.keys(wordCount)
                .sort((a, b) => {
                    // Prioritize more frequent words, then longer words
                    if (wordCount[b] !== wordCount[a]) {
                        return wordCount[b] - wordCount[a];
                    }
                    return b.length - a.length;
                })
                .filter(word => !this.state.keywords.has(word)); // Exclude already added keywords

            if (detectedKeywords.length === 0) {
                this.showNotification('ℹ️ No new significant keywords detected.', 'info');
                return;
            }

            // Add the top detected keywords up to the limit
            let addedCount = 0;
            for (const keyword of detectedKeywords) {
                if (this.state.keywords.size < (this.config?.validation?.keywords?.max || 20)) {
                    this.addKeyword(keyword);
                    addedCount++;
                    if (addedCount >= maxKeywords) break;
                } else {
                    this.showNotification('⚠️ Keyword limit reached.', 'warning');
                    break;
                }
            }

            if (addedCount > 0) {
                this.showNotification(`✨ Detected and added ${addedCount} new keyword(s)!`, 'success');
            } else {
                this.showNotification('ℹ️ No new keywords could be added.', 'info');
            }

        } catch (error) {
            console.error('Error auto-detecting keywords:', error);
            this.showNotification('❌ Error detecting keywords.', 'error');
        }
    }

    // --- End Keyword Management ---

    /**
     * Hide loading indicator
     */
    hideLoading() {
        if (this.dom.loading) {
            this.dom.loading.style.display = 'none';
            this.state.isLoading = false;
        }
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        try {
            let notification = this.dom.notification;
            
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, rgba(18, 18, 26, 0.95) 0%, rgba(26, 26, 40, 0.95) 100%);
                    color: var(--text-primary);
                    padding: 12px 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateY(-10px);
                `;
                document.body.appendChild(notification);
                this.dom.notification = notification;
            }

            notification.textContent = message;
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';

            const duration = this.config?.ui?.notifications?.duration || 3000;

            setTimeout(() => {
                if (notification) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-10px)';
                }
            }, duration);

        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    /**
     * Copy output to clipboard
     */
    async copyToClipboard() {
        try {
            const output = this.dom.output?.textContent;
            
            if (!output || !output.trim()) {
                this.showNotification('⚠️ No ASCII art to copy!', 'warning');
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(output);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = output;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            this.showNotification('📋 Copied to clipboard!', 'success');
            this.eventBus.emit(EventBus.Events.OUTPUT_COPIED, { output });

        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('❌ Failed to copy', 'error');
        }
    }

    /**
     * Download output as text file
     */
    downloadOutput() {
        try {
            const output = this.dom.output?.textContent;
            
            if (!output || !output.trim()) {
                this.showNotification('⚠️ No ASCII art to download!', 'warning');
                return;
            }

            const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ascii-art-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            this.showNotification('💾 Downloaded successfully!', 'success');
            this.eventBus.emit(EventBus.Events.OUTPUT_DOWNLOADED, { output });

        } catch (error) {
            console.error('Error downloading output:', error);
            this.showNotification('❌ Failed to download', 'error');
        }
    }

    /**
     * Clear output
     */
    clearOutput() {
        try {
            if (this.dom.output) {
                this.dom.output.textContent = '';
                this.dom.output.className = 'ascii-output';
                this.showNotification('🗑️ Output cleared', 'info');
                this.eventBus.emit(EventBus.Events.OUTPUT_CLEARED);
            }
        } catch (error) {
            console.error('Error clearing output:', error);
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        try {
            const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);

            // Save to localStorage
            try {
                const themeKey = this.config?.storage?.keys?.theme || 'theme';
                localStorage.setItem(themeKey, newTheme);
            } catch (storageError) {
                console.warn('Failed to save theme preference:', storageError);
            }

            this.eventBus.emit(EventBus.Events.THEME_CHANGED, { theme: this.state.theme });

        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (this.dom.themeBtn) {
            this.dom.themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    initializeAnimatedTitle() {
        const interval = this.config?.ascii?.titleRotationInterval || 4000;
        this.animateTitle();
        setInterval(() => this.animateTitle(), interval);
    }

    animateTitle() {
        if (!this.dom.asciiTitle) return;

        const titleFonts = this.config?.ascii?.titleFonts || ['standard'];
        const currentFontIndex = (this.state.titleFontIndex || 0) % titleFonts.length;
        const fontName = titleFonts[currentFontIndex];
        
        const font = this.fontManager.getFont(fontName);
        if (!font) {
            console.warn(`Title font "${fontName}" not found.`);
            return;
        }

        const asciiText = this.renderer.renderTextWithFont('ASCII ART', font);
        this.dom.asciiTitle.textContent = asciiText;

        this.state.titleFontIndex = currentFontIndex + 1;
    }

    /**
     * Get current state
     * @returns {Object}
     */
    getState() {
        return { ...this.state };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
