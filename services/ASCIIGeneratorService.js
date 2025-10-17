/**
 * ASCII Generator Service
 * Business logic layer for ASCII art generation
 */

class ASCIIGeneratorService {
    constructor(fontManager, renderer, validator, eventBus) {
        this.fontManager = fontManager;
        this.renderer = renderer;
        this.validator = validator;
        this.eventBus = eventBus;
        this.isGenerating = false;
        this.subscribeToRequests();
    }

    /**
     * Generate text-based ASCII art
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Result with ascii art and metadata
     */
    subscribeToRequests() {
        if (!this.eventBus) return;

        this.eventBus.on(EventBus.Events.REQUEST_TEXT_GENERATION, (options) => 
            this.generateTextASCII(options).catch(err => {
                console.error('Unhandled error in generateTextASCII:', err.message);
            })
        );

        this.eventBus.on(EventBus.Events.REQUEST_IMAGE_GENERATION, (options) =>
            this.generateImageASCII(options).catch(err => {
                console.error('Unhandled error in generateImageASCII:', err.message);
            })
        );

        this.eventBus.on(EventBus.Events.REQUEST_POETRY_GENERATION, (options) =>
            this.generatePoetryASCII(options).catch(err => {
                console.error('Unhandled error in generatePoetryASCII:', err.message);
            })
        );
    }

    async generateTextASCII(options) {
        const { text, fontName = 'standard', color = 'none', animation = 'none' } = options;

        // Prevent concurrent generation
        if (this.isGenerating) {
            this.eventBus.emit(EventBus.Events.NOTIFICATION_SHOW, { message: '⚠️ Please wait for the current generation to complete!', type: 'warning' });
            return;
        }

        try {
            this.isGenerating = true;
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_START, { text, fontName });

            // Validate input
            const validation = this.validator.validateText(text);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Get font
            const font = this.fontManager.getFont(fontName);
            if (!font) {
                throw new Error(`Font "${fontName}" not found`);
            }

            // Render ASCII art
            const ascii = this.renderer.renderTextWithFont(validation.value.toUpperCase(), font);

            const result = {
                success: true,
                ascii,
                metadata: {
                    text: validation.value,
                    fontName,
                    color,
                    animation,
                    timestamp: Date.now(),
                    lineCount: ascii.split('\n').length,
                    characterCount: ascii.length
                }
            };

            console.log('✅ Text generation complete, emitting event:', {
                asciiLength: ascii.length,
                lineCount: result.metadata.lineCount,
                fontName,
                color,
                animation
            });
            console.log('📤 Emitting TEXT_GENERATION_COMPLETE event');
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_COMPLETE, result);
            console.log('✅ Event emitted successfully');
            return result;

        } catch (error) {
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_ERROR, { error: error.message });
            throw error;
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Generate image-based ASCII art
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Result with ascii art and metadata
     */
    async generateImageASCII(options) {
        const { file, width = 80, charSet = 'standard', colorMode = 'none' } = options;

        if (this.isGenerating) {
            this.eventBus.emit(EventBus.Events.NOTIFICATION_SHOW, { message: '⚠️ Please wait for the current generation to complete!', type: 'warning' });
            return;
        }

        try {
            this.isGenerating = true;
            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_START, { width, charSet, colorMode });

            // Validate image
            const validation = this.validator.validateImageFile(file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Validate width
            const widthValidation = this.validator.validateNumberRange(width, 20, 200);
            if (!widthValidation.valid) {
                throw new Error(widthValidation.error);
            }

            // Convert image to ASCII
            const ascii = await this.convertImageToASCII(
                validation.value,
                widthValidation.value,
                charSet,
                colorMode
            );

            const result = {
                success: true,
                ascii,
                metadata: {
                    fileName: file.name,
                    fileSize: file.size,
                    width: widthValidation.value,
                    charSet,
                    colorMode,
                    timestamp: Date.now(),
                    lineCount: ascii.split('\n').length,
                    characterCount: ascii.length
                }
            };

            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_COMPLETE, result);
            return result;

        } catch (error) {
            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_ERROR, { error: error.message });
            throw error;
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Generate poetry ASCII art with keyword highlighting
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Result with ascii art and metadata
     */
    async generatePoetryASCII(options) {
        const {
            poem,
            fontName = 'mini',
            keywords = [],
            layout = 'centered',
            color = 'none',
            animation = 'none',
            decoration = 'none'
        } = options;

        if (this.isGenerating) {
            this.eventBus.emit(EventBus.Events.NOTIFICATION_SHOW, { message: '⚠️ Please wait for the current generation to complete!', type: 'warning' });
            return;
        }

        try {
            this.isGenerating = true;
            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_START, {
                poem: poem.substring(0, 50) + '...',
                fontName,
                keywordCount: keywords.length
            });

            // Validate poem
            const validation = this.validator.validateText(poem);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Get font
            const font = this.fontManager.getFont(fontName);
            if (!font) {
                throw new Error(`Font "${fontName}" not found`);
            }

            // Ensure keywords are a Set for efficient lookup
            const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

            // Generate poetry ASCII
            const ascii = await this.convertPoetryToASCII(
                validation.value,
                font,
                keywordSet,
                layout,
                decoration
            );

            const result = {
                success: true,
                ascii,
                metadata: {
                    poem: validation.value,
                    fontName,
                    keywords: Array.from(keywordSet),
                    layout,
                    color,
                    animation,
                    decoration,
                    timestamp: Date.now(),
                    lineCount: ascii.split('\n').length,
                    characterCount: ascii.length
                }
            };

            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_COMPLETE, result);
            return result;

        } catch (error) {
            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_ERROR, { error: error.message });
            throw error;
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Convert image to ASCII art
     * @private
     */
    async convertImageToASCII(file, width, charSet, colorMode) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onerror = () => reject(new Error('Failed to load image'));

            img.onload = () => {
                try {
                    const aspectRatio = img.height / img.width;
                    const height = Math.floor(width * aspectRatio * 0.5); // Adjust for character aspect ratio

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

    /**
     * Convert poetry to ASCII with keyword highlighting
     * @private
     */
    async convertPoetryToASCII(poem, font, keywordSet, layout, decoration) {
        const lines = poem.split('\n');
        let result = '';

        // Add top decoration
        if (decoration === 'borders') {
            result += this.renderer.createBorderLine('top', 40, 'single') + '\n\n';
        } else if (decoration === 'flowers') {
            result += '  🌸 '.repeat(15) + '\n\n';
        } else if (decoration === 'stars') {
            result += '  ✨ '.repeat(15) + '\n\n';
        } else if (decoration === 'hearts') {
            result += '  💖 '.repeat(15) + '\n\n';
        }

        // Process each line
        for (const line of lines) {
            if (!line.trim()) {
                result += '\n';
                continue;
            }

            const transformedLine = this.transformLineWithKeywords(line, font, keywordSet);
            result += transformedLine + '\n';
        }

        // Add bottom decoration
        if (decoration === 'borders') {
            result += '\n' + this.renderer.createBorderLine('bottom', 40, 'single');
        } else if (decoration === 'flowers') {
            result += '\n  🌸 '.repeat(15);
        } else if (decoration === 'stars') {
            result += '\n  ✨ '.repeat(15);
        } else if (decoration === 'hearts') {
            result += '\n  💖 '.repeat(15);
        }

        return result;
    }

    /**
     * Transform line with keyword highlighting
     * @private
     */
    transformLineWithKeywords(line, font, keywordSet) {
        if (!keywordSet || keywordSet.size === 0) {
            return '  ' + line;
        }

        const words = line.split(/(\s+)/);
        const transformedWords = words.map(word => {
            if (!word.trim()) return word;

            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
            const isKeyword = keywordSet.has(cleanWord);

            if (isKeyword) {
                return this.renderer.renderSmallASCII(word.toUpperCase(), font);
            } else {
                return '  ' + word;
            }
        });

        return transformedWords.join('');
    }

    /**
     * Get character set for image conversion
     * @private
     */
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

    /**
     * Check if service is currently generating
     * @returns {boolean}
     */
    isBusy() {
        return this.isGenerating;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASCIIGeneratorService;
}
