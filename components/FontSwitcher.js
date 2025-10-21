/**
 * Font Switcher Component
 * Handles font selection changes and triggers regeneration
 */

class FontSwitcher {
    constructor(eventBus, fontManager, config) {
        this.eventBus = eventBus;
        this.fontManager = fontManager;
        this.config = config;
        this.dom = {};
        this.state = {
            currentFont: 'standard',
            lastGeneratedText: '',
            lastGeneratedOptions: null
        };
        
        this.initialize();
    }

    /**
     * Initialize font switcher
     */
    initialize() {
        this.cacheElements();
        this.attachEventListeners();
        this.subscribeToEvents();
        console.log('🔤 FontSwitcher initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.dom = {
            fontSelect: document.getElementById('font-select')
        };
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.dom.fontSelect) {
            this.dom.fontSelect.addEventListener('change', (e) => {
                this.handleFontChange(e.target.value);
            });
        }
    }

    /**
     * Subscribe to generation events
     */
    subscribeToEvents() {
        // Listen for successful text generation to update state
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => {
            if (result.success && result.metadata?.text) {
                this.updateGeneratedText(result.metadata.text, {
                    text: result.metadata.text,
                    fontName: result.metadata.fontName,
                    color: result.metadata.color,
                    animation: result.metadata.animation
                });
            }
        });
    }

    /**
     * Handle font change
     */
    handleFontChange(newFont) {
        if (this.state.currentFont === newFont) return;
        
        console.log('🔤 FontSwitcher: Font changed from', this.state.currentFont, 'to', newFont);
        this.state.currentFont = newFont;

        // If we have previously generated text, regenerate with new font
        if (this.state.lastGeneratedText && this.state.lastGeneratedOptions) {
            this.regenerateWithNewFont();
        }
    }

    /**
     * Regenerate output with new font
     */
    regenerateWithNewFont() {
        if (!this.state.lastGeneratedText) return;

        console.log('🔄 FontSwitcher: Regenerating with new font:', this.state.currentFont);
        
        const options = {
            ...this.state.lastGeneratedOptions,
            fontName: this.state.currentFont
        };

        // Emit regeneration request
        this.eventBus.emit('request:text:gen', options);
    }

    /**
     * Update state when new text is generated
     */
    updateGeneratedText(text, options) {
        this.state.lastGeneratedText = text;
        this.state.lastGeneratedOptions = options;
        console.log('📝 FontSwitcher: Updated generated text state');
    }

    /**
     * Get current font
     */
    getCurrentFont() {
        return this.state.currentFont;
    }

    /**
     * Set current font programmatically
     */
    setCurrentFont(fontName) {
        if (this.dom.fontSelect && this.dom.fontSelect.value !== fontName) {
            this.dom.fontSelect.value = fontName;
        }
        this.state.currentFont = fontName;
    }

    /**
     * Get available fonts
     */
    getAvailableFonts() {
        return this.fontManager.getAvailableFonts();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontSwitcher;
}
