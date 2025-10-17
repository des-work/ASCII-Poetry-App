/**
 * UI Controller
 * Manages all UI interactions and updates
 */

class UIController {
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.elements = {};
        this.state = {
            currentTab: 'text',
            theme: 'dark',
            isLoading: false
        };
        
        this.initialize();
    }

    /**
     * Initialize UI controller
     */
    initialize() {
        this.cacheElements();
        this.attachEventListeners();
        this.subscribeToEvents();
        console.log('✅ UIController initialized');
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Tabs
            tabButtons: document.querySelectorAll('.tab-button'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Output
            output: document.getElementById('ascii-output'),
            outputSection: document.querySelector('.output-section'),
            
            // Controls
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            clearBtn: document.getElementById('clear-btn'),
            themeBtn: document.getElementById('theme-btn'),
            
            // Loading
            loading: document.getElementById('loading-indicator'),
            
            // Notification
            notification: document.getElementById('notification')
        };
    }

    /**
     * Attach DOM event listeners
     */
    attachEventListeners() {
        // Tab switching
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        // Output controls
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => this.downloadOutput());
        }

        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearOutput());
        }

        // Theme toggle
        if (this.elements.themeBtn) {
            this.elements.themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    /**
     * Subscribe to event bus events
     */
    subscribeToEvents() {
        // Loading events
        this.eventBus.on(EventBus.Events.LOADING_START, () => this.showLoading());
        this.eventBus.on(EventBus.Events.LOADING_END, () => this.hideLoading());
        
        // Notification events
        this.eventBus.on(EventBus.Events.NOTIFICATION_SHOW, (data) => {
            this.showNotification(data.message, data.type);
        });
        
        // Output events
        this.eventBus.on(EventBus.Events.OUTPUT_UPDATED, (data) => {
            this.displayOutput(data);
        });
        
        // Generation complete events
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => {
            this.displayOutput({
                ascii: result.ascii,
                color: result.metadata.color,
                animation: result.metadata.animation
            });
        });
        
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_COMPLETE, (result) => {
            this.displayOutput({
                ascii: result.ascii,
                color: 'none',
                animation: 'none'
            });
        });
        
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_COMPLETE, (result) => {
            this.displayPoetryOutput(result);
        });
        
        // Error events
        this.eventBus.on(EventBus.Events.ERROR_OCCURRED, (data) => {
            this.showNotification(data.message, 'error');
        });
    }

    /**
     * Switch active tab
     * @param {string} tabName - Name of the tab
     */
    switchTab(tabName) {
        try {
            console.log('📑 Switching to tab:', tabName);
            
            // Update button states
            this.elements.tabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tabName) {
                    btn.classList.add('active');
                }
            });

            // Update tab content
            this.elements.tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });

            this.state.currentTab = tabName;
            this.eventBus.emit(EventBus.Events.TAB_CHANGED, { tab: tabName });
            
        } catch (error) {
            console.error('Error switching tabs:', error);
        }
    }

    /**
     * Display ASCII art output
     * @param {Object} data - Output data
     */
    displayOutput(data) {
        try {
            const { ascii, color = 'none', animation = 'none' } = data;
            
            if (!this.elements.output) {
                throw new Error('Output element not found');
            }

            this.elements.output.textContent = ascii;
            this.elements.output.className = 'ascii-output';

            // Apply color
            if (color && color !== 'none') {
                this.applyColor(color);
            }

            // Apply animation
            if (animation && animation !== 'none') {
                this.elements.output.classList.add(`animation-${animation}`);
            }

            this.eventBus.emit(EventBus.Events.OUTPUT_UPDATED, data);
            
        } catch (error) {
            console.error('Error displaying output:', error);
            this.eventBus.emit(EventBus.Events.ERROR_OCCURRED, { message: 'Failed to display output' });
        }
    }

    /**
     * Display poetry-specific output
     * @param {Object} result - Generation result
     */
    displayPoetryOutput(result) {
        try {
            const { ascii, metadata } = result;
            const { layout, color, animation, decoration } = metadata;

            this.elements.output.textContent = ascii;
            this.elements.output.className = 'ascii-output';

            // Apply layout
            if (layout && layout !== 'centered') {
                this.elements.output.classList.add(`poetry-layout-${layout}`);
            }

            // Apply decoration
            if (decoration && decoration !== 'none') {
                this.elements.output.classList.add(`poetry-decoration-${decoration}`);
            }

            // Apply color
            if (color && color !== 'none') {
                this.applyColor(color);
            }

            // Apply animation
            if (animation && animation !== 'none') {
                this.elements.output.classList.add(`animation-${animation}`);
            }

        } catch (error) {
            console.error('Error displaying poetry output:', error);
        }
    }

    /**
     * Apply color to output
     * @param {string} color - Color name
     */
    applyColor(color) {
        const colorMap = {
            red: '#ff6b6b',
            green: '#51cf66',
            blue: '#4dabf7',
            yellow: '#ffd43b',
            purple: '#cc5de8',
            cyan: '#22b8cf',
            magenta: '#ff6b9d',
            gold: '#ffd700',
            silver: '#c0c0c0'
        };

        if (colorMap[color]) {
            this.elements.output.style.color = colorMap[color];
        } else if (color === 'rainbow') {
            this.applyRainbowEffect();
        } else if (color === 'gradient') {
            this.applyGradientEffect();
        }
    }

    /**
     * Apply rainbow effect
     */
    applyRainbowEffect() {
        const text = this.elements.output.textContent;
        const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff6b9d'];
        let html = '';

        for (let i = 0; i < text.length; i++) {
            const color = colors[i % colors.length];
            html += `<span style="color: ${color}">${text[i]}</span>`;
        }

        this.elements.output.innerHTML = html;
    }

    /**
     * Apply gradient effect
     */
    applyGradientEffect() {
        this.elements.output.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        this.elements.output.style.webkitBackgroundClip = 'text';
        this.elements.output.style.webkitTextFillColor = 'transparent';
        this.elements.output.style.backgroundClip = 'text';
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'block';
            this.state.isLoading = true;
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
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
            let notification = this.elements.notification;
            
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
                this.elements.notification = notification;
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
            const output = this.elements.output?.textContent;
            
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
            const output = this.elements.output?.textContent;
            
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
            if (this.elements.output) {
                this.elements.output.textContent = '';
                this.elements.output.className = 'ascii-output';
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
            this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.state.theme);
            
            if (this.elements.themeBtn) {
                this.elements.themeBtn.textContent = this.state.theme === 'dark' ? '🌙' : '☀️';
            }

            // Save to localStorage
            try {
                localStorage.setItem(this.config.storage.keys.theme, this.state.theme);
            } catch (storageError) {
                console.warn('Failed to save theme preference:', storageError);
            }

            this.eventBus.emit(EventBus.Events.THEME_CHANGED, { theme: this.state.theme });

        } catch (error) {
            console.error('Error toggling theme:', error);
        }
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

