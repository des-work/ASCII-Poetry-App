// Font Manager Module - Handles all ASCII font definitions and retrieval

class FontManager {
    constructor() {
        this.fonts = this.initializeFonts();
    }

    initializeFonts() {
        return {
            standard: 'getStandardFont',
            block: 'getBlockFont',
            bubble: 'getBubbleFont',
            lean: 'getLeanFont',
            mini: 'getMiniFont',
            script: 'getScriptFont',
            slant: 'getSlantFont',
            small: 'getSmallFont',
            big: 'getBigFont',
            elegant: 'getElegantFont',
            romantic: 'getRomanticFont',
            classic: 'getClassicFont',
            modern: 'getModernFont',
            calligraphy: 'getCalligraphyFont',
            gothic: 'getGothicFont',
            serif: 'getSerifFont',
            sans: 'getSansFont',
            decorative: 'getDecorativeFont',
            artistic: 'getArtisticFont',
            '3d': 'get3DFont',
            star: 'getStarFont',
            dot: 'getDotFont',
            wavy: 'getWavyFont',
            pixel: 'getPixelFont'
        };
    }

    getFont(fontName) {
        const methodName = this.fonts[fontName] || this.fonts.standard;
        return this[methodName]();
    }

    getAllFontNames() {
        return Object.keys(this.fonts);
    }

    getFontDisplayName(fontName) {
        const displayNames = {
            'standard': 'Standard',
            'block': 'Block',
            'bubble': 'Bubble',
            'mini': 'Mini',
            'small': 'Small',
            'lean': 'Lean',
            'slant': 'Slant',
            'script': 'Script',
            'big': 'Big',
            'elegant': 'Elegant ♠',
            'romantic': 'Romantic ♥',
            'classic': 'Classic █',
            'modern': 'Modern ▲',
            'calligraphy': 'Calligraphy ╔',
            'gothic': 'Gothic ░',
            'serif': 'Serif',
            'sans': 'Sans ▄',
            'decorative': 'Decorative ◊',
            'artistic': 'Artistic ◆',
            '3d': '3D Effect',
            'star': 'Stars ★',
            'dot': 'Dots •',
            'wavy': 'Wavy ≈',
            'pixel': 'Pixel ▓'
        };
        return displayNames[fontName] || fontName;
    }

    // Font definitions would continue here...
    // For brevity, I'll add just a few examples

    getStandardFont() {
        return {
            A: ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██', '██  ██'],
            B: ['█████ ', '██  ██', '█████ ', '██  ██', '██  ██', '█████ '],
            C: [' ████ ', '██  ██', '██    ', '██    ', '██  ██', ' ████ '],
            // ... rest of alphabet
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getMiniFont() {
        return {
            A: ['▄▀▄', '█▀█', '█ █'],
            B: ['█▀▄', '█▀▄', '▀▀ '],
            C: ['▄▀▀', '█  ', '▀▀▀'],
            // ... rest of alphabet
            ' ': ['   ', '   ', '   ']
        };
    }

    // Add other font methods here...
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontManager;
}

