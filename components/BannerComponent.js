/**
 * Banner Component
 * Manages the header banner with animated title and controls
 */

class BannerComponent {
    constructor(config, fontManager, asciiRenderer) {
        this.config = config;
        this.fontManager = fontManager;
        this.renderer = asciiRenderer;
        this.dom = {};
        this.state = {
            titleFontIndex: 0
        };
        
        this.initialize();
    }

    /**
     * Initialize banner component
     */
    initialize() {
        this.cacheElements();
        this.initializeTheme();
        this.initializeAnimatedTitle();
        this.attachEventListeners();
        console.log('🎨 BannerComponent initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.dom = {
            asciiTitle: document.getElementById('ascii-title'),
            themeBtn: document.getElementById('theme-btn'),
            buildBadge: document.getElementById('build-badge'),
            buildId: document.getElementById('build-id')
        };
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.dom.themeBtn) {
            this.dom.themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    /**
     * Initialize theme
     */
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
     * Toggle theme
     */
    toggleTheme() {
        try {
            const newTheme = this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);

            // Save to localStorage
            try {
                const themeKey = this.config?.storage?.keys?.theme || 'theme';
                localStorage.setItem(themeKey, newTheme);
            } catch (storageError) {
                console.warn('Failed to save theme preference:', storageError);
            }

            // Emit theme change event
            if (window.eventBus) {
                window.eventBus.emit('theme:changed', { theme: newTheme });
            }

        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (this.dom.themeBtn) {
            this.dom.themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    /**
     * Initialize animated title
     */
    initializeAnimatedTitle() {
        const interval = this.config?.ascii?.titleRotationInterval || 4000;
        this.animateTitle();
        setInterval(() => this.animateTitle(), interval);
    }

    /**
     * Animate title with different fonts
     */
    animateTitle() {
        if (!this.dom.asciiTitle) return;

        const titleFonts = this.config?.ascii?.titleFonts || ['standard'];
        const currentFontIndex = this.state.titleFontIndex % titleFonts.length;
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
     * Set build information
     */
    setBuildInfo(buildId) {
        if (this.dom.buildId) {
            this.dom.buildId.textContent = buildId;
        }
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BannerComponent;
}
