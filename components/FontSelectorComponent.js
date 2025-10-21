/**
 * FontSelectorComponent - Handles font selection functionality
 * Manages font dropdown, current selection, and font switching
 */

class FontSelectorComponent {
    constructor(eventBus, fontManager) {
        this.eventBus = eventBus;
        this.fontManager = fontManager;
        this.dom = {};
        this.state = {
            currentFont: 'standard',
            availableFonts: [],
            isLoading: false
        };
        this.init();
    }

    init() {
        console.log('Ì¥§ FontSelectorComponent: Initializing...');
        this.cacheDOM();
        this.attachEventListeners();
        this.loadFonts();
        console.log('‚úÖ FontSelectorComponent: Initialized');
    }

    cacheDOM() {
        this.dom.fontSelect = document.getElementById('font-select');
        if (!this.dom.fontSelect) {
            console.error('‚ùå FontSelectorComponent: Font select element not found');
        }
    }

    attachEventListeners() {
        if (!this.dom.fontSelect) return;

        this.dom.fontSelect.addEventListener('change', () => {
            this.handleFontChange();
        });

        console.log('Ì¥ó FontSelectorComponent: Event listeners attached');
    }

    async loadFonts() {
        if (!this.fontManager) {
            console.error('‚ùå FontSelectorComponent: FontManager not available');
            return;
        }

        try {
            this.state.isLoading = true;
            this.updateLoadingState();

            // Get available fonts from AppConfig or FontManager
            if (window.AppConfig?.ascii?.fonts?.text) {
                this.state.availableFonts = window.AppConfig.ascii.fonts.text;
            } else {
                // Fallback to FontManager's font loaders
                this.state.availableFonts = Object.keys(this.fontManager.fontLoaders || {});
            }

            // Populate the dropdown
            this.populateFontOptions();

            // Set default font
            this.setFont('standard');

            this.state.isLoading = false;
            this.updateLoadingState();

            console.log('Ì¥§ FontSelectorComponent: Fonts loaded', {
                count: this.state.availableFonts.length,
                current: this.state.currentFont
            });

        } catch (error) {
            console.error('‚ùå FontSelectorComponent: Font loading error:', error);
            this.state.isLoading = false;
            this.updateLoadingState();
        }
    }

    populateFontOptions() {
        if (!this.dom.fontSelect) return;

        // Clear existing options
        this.dom.fontSelect.innerHTML = '';

        // Add font options
        this.state.availableFonts.forEach(fontName => {
            const option = document.createElement('option');
            option.value = fontName;
            option.textContent = this.formatFontName(fontName);
            this.dom.fontSelect.appendChild(option);
        });
    }

    formatFontName(fontName) {
        // Convert camelCase to Title Case
        return fontName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    handleFontChange() {
        if (!this.dom.fontSelect) return;

        const newFont = this.dom.fontSelect.value;
        this.setFont(newFont);

        // Emit font change event
        this.eventBus.emit('font:changed', {
            fontName: newFont,
            previousFont: this.state.currentFont
        });

        console.log('Ì¥§ FontSelectorComponent: Font changed', {
            from: this.state.currentFont,
            to: newFont
        });
    }

    setFont(fontName) {
        if (!this.state.availableFonts.includes(fontName)) {
            console.warn(`‚ö†Ô∏è FontSelectorComponent: Font "${fontName}" not available`);
            fontName = 'standard'; // Fallback
        }

        this.state.currentFont = fontName;

        if (this.dom.fontSelect) {
            this.dom.fontSelect.value = fontName;
        }

        console.log('Ì¥§ FontSelectorComponent: Font set to', fontName);
    }

    getCurrentFont() {
        return this.state.currentFont;
    }

    getAvailableFonts() {
        return [...this.state.availableFonts];
    }

    updateLoadingState() {
        if (this.dom.fontSelect) {
            this.dom.fontSelect.disabled = this.state.isLoading;
            this.dom.fontSelect.classList.toggle('loading', this.state.isLoading);
        }
    }

    refreshFonts() {
        this.loadFonts();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontSelectorComponent;
}
