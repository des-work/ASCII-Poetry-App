/**
 * Application Configuration
 * Central configuration for all app settings
 */

const AppConfig = {
    // Application metadata
    app: {
        name: 'ASCII Art Poetry',
        version: '2.0.0',
        author: 'ASCII Art Generator',
        environment: 'production' // 'development' | 'production'
    },

    // Validation constraints
    validation: {
        text: {
            maxLength: 5000,
            minLength: 1
        },
        keywords: {
            max: 20,
            minLength: 2
        },
        image: {
            maxSize: 10 * 1024 * 1024, // 10MB
            supportedTypes: [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp'
            ],
            defaultWidth: 80,
            minWidth: 20,
            maxWidth: 200
        }
    },

    // UI settings
    ui: {
        theme: {
            default: 'dark',
            available: ['dark', 'light']
        },
        notifications: {
            duration: 3000,
            position: 'top-right'
        },
        loading: {
            minDisplayTime: 500
        },
        animations: {
            enabled: true,
            defaultDuration: 300
        }
    },

    // ASCII generation settings
    ascii: {
        defaultFont: 'standard',
        titleFonts: ['mini', 'small', 'bubble', 'lean'],
        titleRotationInterval: 3000,
        fonts: {
            text: [
                'standard', 'block', 'bubble', 'mini', 'small',
                'lean', 'slant', 'script', 'big', 'elegant',
                'romantic', 'classic', 'modern', 'calligraphy',
                'gothic', 'serif', 'sans', 'decorative',
                'artistic', '3d', 'star', 'dot', 'wavy', 'pixel'
            ],
            poetry: [
                'mini', 'small', 'elegant', 'romantic',
                'calligraphy', 'script', 'artistic', 'decorative'
            ]
        },
        colors: {
            solid: ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta', 'gold', 'silver'],
            special: ['rainbow', 'gradient', 'romantic', 'mystical']
        },
        animations: ['none', 'blink', 'scroll', 'wave', 'glow', 'fade', 'typewriter', 'floating'],
        decorations: ['none', 'borders', 'flowers', 'stars', 'hearts', 'ornate', 'minimal']
    },

    // Image processing settings
    image: {
        characterSets: {
            standard: '@#%&*+=~-:,.`',
            blocks: '█▓▒░',
            dots: '●○◯',
            simple: '#*+.',
            detailed: '@#$%&*+=~-:,.`'
        },
        colorModes: ['none', 'grayscale', 'color', 'invert']
    },

    // Poetry settings
    poetry: {
        layouts: ['centered', 'left-aligned', 'right-aligned', 'justified', 'stanza', 'artistic'],
        autoDetect: {
            enabled: true,
            minWordLength: 4,
            maxKeywords: 5,
            excludeCommonWords: true
        },
        commonWords: [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
            'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are',
            'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
            'does', 'did', 'will', 'would', 'should', 'could', 'may',
            'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'them', 'their', 'this', 'that', 'these', 'those', 'your',
            'my', 'his', 'her', 'its', 'our', 'who', 'what', 'where',
            'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
            'more', 'most', 'other', 'some', 'such'
        ]
    },

    // Storage settings
    storage: {
        enabled: true,
        keys: {
            theme: 'ascii-art-theme',
            preferences: 'ascii-art-prefs',
            history: 'ascii-art-history'
        },
        historyLimit: 50
    },

    // Performance settings
    performance: {
        enableWebWorkers: false, // Future enhancement
        batchSize: 100,
        debounceDelay: 300
    },

    // Debug settings
    debug: {
        enabled: true, // Set to false in production
        logLevel: 'info', // 'error' | 'warn' | 'info' | 'debug'
        showTimings: true,
        logEvents: true
    },

    // Feature flags
    features: {
        textToAscii: true,
        imageToAscii: true,
        poetryArt: true,
        downloadFeature: true,
        copyFeature: true,
        themeToggle: true,
        animationEffects: true,
        keywordDetection: true
    },

    // API endpoints (for future extensions)
    api: {
        baseUrl: '',
        endpoints: {
            fonts: '/api/fonts',
            templates: '/api/templates',
            share: '/api/share'
        }
    }
};

// Freeze configuration to prevent modifications
Object.freeze(AppConfig);
Object.freeze(AppConfig.validation);
Object.freeze(AppConfig.ui);
Object.freeze(AppConfig.ascii);
Object.freeze(AppConfig.image);
Object.freeze(AppConfig.poetry);
Object.freeze(AppConfig.storage);
Object.freeze(AppConfig.performance);
Object.freeze(AppConfig.debug);
Object.freeze(AppConfig.features);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}

