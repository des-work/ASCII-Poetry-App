/**
 * Generator Factory
 * Factory pattern for creating different types of ASCII generators
 */

class GeneratorFactory {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.generators = new Map();
        this.registerDefaultGenerators();
    }

    /**
     * Register default generators
     */
    registerDefaultGenerators() {
        this.register('text', TextGenerator);
        this.register('image', ImageGenerator);
        this.register('poetry', PoetryGenerator);
    }

    /**
     * Register a generator type
     * @param {string} type - Generator type
     * @param {Function} GeneratorClass - Generator class constructor
     */
    register(type, GeneratorClass) {
        if (!type || typeof GeneratorClass !== 'function') {
            throw new Error('Invalid generator registration');
        }
        this.generators.set(type, GeneratorClass);
        console.log(`✅ Registered generator: ${type}`);
    }

    /**
     * Create a generator instance
     * @param {string} type - Generator type
     * @returns {Object} Generator instance
     */
    create(type) {
        const GeneratorClass = this.generators.get(type);
        
        if (!GeneratorClass) {
            throw new Error(`Generator type "${type}" not found`);
        }

        return new GeneratorClass(this.dependencies);
    }

    /**
     * Get list of available generator types
     * @returns {Array<string>}
     */
    getAvailableTypes() {
        return Array.from(this.generators.keys());
    }

    /**
     * Check if generator type exists
     * @param {string} type - Generator type
     * @returns {boolean}
     */
    has(type) {
        return this.generators.has(type);
    }
}

/**
 * Base Generator class
 */
class BaseGenerator {
    constructor(dependencies) {
        this.fontManager = dependencies.fontManager;
        this.renderer = dependencies.renderer;
        this.validator = dependencies.validator;
        this.eventBus = dependencies.eventBus;
    }

    /**
     * Generate ASCII art (to be implemented by subclasses)
     * @abstract
     */
    async generate(options) {
        throw new Error('generate() must be implemented by subclass');
    }

    /**
     * Validate options
     * @abstract
     */
    validate(options) {
        throw new Error('validate() must be implemented by subclass');
    }
}

/**
 * Text Generator
 */
class TextGenerator extends BaseGenerator {
    async generate(options) {
        const { text, fontName = 'standard' } = options;

        // Validate
        const validation = this.validator.validateText(text);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Get font
        const font = this.fontManager.getFont(fontName);
        if (!font) {
            throw new Error(`Font "${fontName}" not found`);
        }

        // Render
        const ascii = this.renderer.renderTextWithFont(validation.value.toUpperCase(), font);

        return {
            success: true,
            ascii,
            type: 'text',
            metadata: {
                text: validation.value,
                fontName,
                timestamp: Date.now()
            }
        };
    }

    validate(options) {
        if (!options.text) {
            return { valid: false, error: 'Text is required' };
        }
        return { valid: true };
    }
}

/**
 * Image Generator
 */
class ImageGenerator extends BaseGenerator {
    async generate(options) {
        const { file, width = 80, charSet = 'standard' } = options;

        // Validate file
        const fileValidation = this.validator.validateImageFile(file);
        if (!fileValidation.valid) {
            throw new Error(fileValidation.error);
        }

        // Validate width
        const widthValidation = this.validator.validateNumberRange(width, 20, 200);
        if (!widthValidation.valid) {
            throw new Error(widthValidation.error);
        }

        // Convert image
        const ascii = await this.convertImageToASCII(file, widthValidation.value, charSet);

        return {
            success: true,
            ascii,
            type: 'image',
            metadata: {
                fileName: file.name,
                width: widthValidation.value,
                charSet,
                timestamp: Date.now()
            }
        };
    }

    validate(options) {
        if (!options.file) {
            return { valid: false, error: 'Image file is required' };
        }
        return { valid: true };
    }

    async convertImageToASCII(file, width, charSet) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onerror = () => reject(new Error('Failed to load image'));

            img.onload = () => {
                try {
                    const aspectRatio = img.height / img.width;
                    const height = Math.floor(width * aspectRatio * 0.5);

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    const imageData = ctx.getImageData(0, 0, width, height);

                    const chars = this.getCharacterSet(charSet);
                    let ascii = '';

                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const pixelIndex = (y * width + x) * 4;
                            const r = imageData.data[pixelIndex];
                            const g = imageData.data[pixelIndex + 1];
                            const b = imageData.data[pixelIndex + 2];
                            const brightness = (r + g + b) / 3;

                            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                            ascii += chars[charIndex];
                        }
                        ascii += '\n';
                    }

                    resolve(ascii);
                } catch (error) {
                    reject(error);
                }
            };

            img.src = URL.createObjectURL(file);
        });
    }

    getCharacterSet(setName) {
        const sets = {
            standard: '@#%&*+=~-:,.` ',
            blocks: '█▓▒░ ',
            dots: '●○◯ ',
            simple: '#*+. ',
            detailed: '@#$%&*+=~-:,.` '
        };
        return (sets[setName] || sets.standard).split('').reverse().join('');
    }
}

/**
 * Poetry Generator
 */
class PoetryGenerator extends BaseGenerator {
    async generate(options) {
        const {
            poem,
            fontName = 'mini',
            keywords = new Set(),
            decoration = 'none'
        } = options;

        // Validate
        const validation = this.validator.validateText(poem);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Get font
        const font = this.fontManager.getFont(fontName);
        if (!font) {
            throw new Error(`Font "${fontName}" not found`);
        }

        // Generate
        const ascii = await this.convertPoetryToASCII(validation.value, font, keywords, decoration);

        return {
            success: true,
            ascii,
            type: 'poetry',
            metadata: {
                poem: validation.value,
                fontName,
                keywords: Array.from(keywords),
                decoration,
                timestamp: Date.now()
            }
        };
    }

    validate(options) {
        if (!options.poem) {
            return { valid: false, error: 'Poem is required' };
        }
        return { valid: true };
    }

    async convertPoetryToASCII(poem, font, keywords, decoration) {
        const lines = poem.split('\n');
        let result = '';

        // Add top decoration
        if (decoration !== 'none') {
            result += this.getDecoration(decoration, 'top') + '\n\n';
        }

        // Process lines
        for (const line of lines) {
            if (!line.trim()) {
                result += '\n';
                continue;
            }

            const transformedLine = this.transformLine(line, font, keywords);
            result += transformedLine + '\n';
        }

        // Add bottom decoration
        if (decoration !== 'none') {
            result += '\n' + this.getDecoration(decoration, 'bottom');
        }

        return result;
    }

    transformLine(line, font, keywords) {
        if (!keywords || keywords.size === 0) {
            return '  ' + line;
        }

        const words = line.split(/(\s+)/);
        const transformed = words.map(word => {
            if (!word.trim()) return word;

            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
            if (keywords.has(cleanWord)) {
                return this.renderer.renderSmallASCII(word.toUpperCase(), font);
            }
            return '  ' + word;
        });

        return transformed.join('');
    }

    getDecoration(type, position) {
        const decorations = {
            borders: position === 'top' ? '┌' + '─'.repeat(40) + '┐' : '└' + '─'.repeat(40) + '┘',
            flowers: '  🌸 '.repeat(15),
            stars: '  ✨ '.repeat(15),
            hearts: '  💖 '.repeat(15)
        };
        return decorations[type] || '';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeneratorFactory, BaseGenerator, TextGenerator, ImageGenerator, PoetryGenerator };
}

