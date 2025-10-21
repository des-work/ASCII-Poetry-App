/**
 * GenerationService - New Simplified Generation System
 * Handles ASCII art generation with proper event handling
 */

class GenerationService {
    constructor(fontManager, renderer, validator, eventBus, performanceManager) {
        this.fontManager = fontManager;
        this.renderer = renderer;
        this.validator = validator;
        this.eventBus = eventBus;
        this.performanceManager = performanceManager;
        this.isGenerating = false;
        
        // Timeout configuration (in milliseconds)
        this.generationTimeout = 10000; // 10 seconds
        this.imageProcessingTimeout = 15000; // 15 seconds for image processing
        
        this.init();
    }

    /**
     * Create a timeout promise that rejects after specified time
     */
    createTimeoutPromise(timeoutMs, operationName) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`${operationName} took too long (${timeoutMs}ms timeout). Please try again.`));
            }, timeoutMs);
        });
    }

    /**
     * Race a promise against a timeout
     */
    async raceWithTimeout(promise, timeoutMs, operationName) {
        try {
            return await Promise.race([
                Promise.resolve(promise),
                this.createTimeoutPromise(timeoutMs, operationName)
            ]);
        } catch (error) {
            throw error;
        }
    }

    init() {
        console.log('⚙️ GenerationService: Initializing...');
        this.subscribeToRequests();
        console.log('✅ GenerationService: Initialized');
    }

    subscribeToRequests() {
        // Text generation
        this.eventBus.on('request:text:gen', (options) => {
            console.log('⚙️ GenerationService: Text generation request received');
            this.generateText(options);
        });

        // Image generation
        this.eventBus.on('request:image:gen', (options) => {
            console.log('⚙️ GenerationService: Image generation request received');
            this.generateImage(options);
        });

        // Poetry generation
        this.eventBus.on('request:poetry:gen', (options) => {
            console.log('⚙️ GenerationService: Poetry generation request received');
            this.generatePoetry(options);
        });

        console.log('⚙️ GenerationService: Event subscriptions complete');
    }

    async generateText(options) {
        if (this.isGenerating) {
            this.eventBus.emit('ui:notification', { 
                message: 'Please wait for current generation to complete', 
                type: 'warning' 
            });
            return;
        }

        try {
            this.isGenerating = true;
            console.log('⚙️ GenerationService: Starting text generation...');
            
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_START);

            // Validate options object
            if (!options || typeof options !== 'object') {
                throw new Error('Invalid options: options must be an object');
            }

            const {
                text = '',
                fontName = 'standard',
                color = 'none',
                animation = 'none'
            } = options;

            // Validate required fields
            if (typeof text !== 'string') {
                throw new Error('Invalid input: text must be a string');
            }

            if (!text || !text.trim()) {
                throw new Error('Text is required');
            }

            // Validate optional fields
            if (typeof fontName !== 'string' || !fontName.trim()) {
                throw new Error('Invalid input: fontName must be a non-empty string');
            }

            if (typeof color !== 'string') {
                throw new Error('Invalid input: color must be a string');
            }

            if (typeof animation !== 'string') {
                throw new Error('Invalid input: animation must be a string');
            }

            // Check cache first
            const cachedResult = this.performanceManager?.getCachedResult(text, fontName, color, animation);
            if (cachedResult) {
                console.log('⚙️ GenerationService: Using cached result');
                this.isGenerating = false;  // ✅ FIX: Reset flag before returning
                this.eventBus.emit(EventBus.Events.TEXT_GENERATION_COMPLETE, cachedResult);
                return;
            }

            // Get font
            const font = this.fontManager.getFont(fontName);
            if (!font) {
                throw new Error(`Font "${fontName}" not found`);
            }

            // Generate ASCII with timeout protection
            const asciiPromise = Promise.resolve(
                this.renderer.renderTextWithFont(text.toUpperCase(), font)
            );
            const ascii = await this.raceWithTimeout(
                asciiPromise, 
                this.generationTimeout, 
                'Text generation'
            );

            const result = {
                success: true,
                ascii,
                metadata: {
                    text,
                    fontName,
                    color,
                    animation,
                    timestamp: Date.now()
                }
            };

            // Cache the result
            this.performanceManager?.cacheResult(text, fontName, color, animation, result);

            console.log('⚙️ GenerationService: Text generation complete');
            // Emit with the correct event name from EventBus.Events
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_COMPLETE, result);

        } catch (error) {
            console.error('⚙️ GenerationService: Text generation error:', error);

            // Enhanced error information
            const errorInfo = {
                type: 'TextGenerationError',
                message: error.message || 'Unknown text generation error',
                stack: error.stack,
                timestamp: new Date().toISOString(),
                options: options,
                phase: 'text_generation'
            };

            // Log to ErrorHandler if available
            if (window.errorHandler) {
                window.errorHandler.handleError(errorInfo);
            }

            // Emit error with detailed information
            this.eventBus.emit(EventBus.Events.TEXT_GENERATION_ERROR, {
                message: errorInfo.message,
                type: errorInfo.type,
                timestamp: errorInfo.timestamp
            });
        } finally {
            this.isGenerating = false;
        }
    }

    async generateImage(options) {
        if (this.isGenerating) {
            this.eventBus.emit('ui:notification', { 
                message: 'Please wait for current generation to complete', 
                type: 'warning' 
            });
            return;
        }

        try {
            this.isGenerating = true;
            console.log('⚙️ GenerationService: Starting image generation...');
            
            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_START);

            const { file, width = 80, charSet = 'standard' } = options;

            // Validate input
            if (!file) {
                throw new Error('Image file is required');
            }

            // Convert image to ASCII
            const ascii = await this.convertImageToASCII(file, width, charSet);

            const result = {
                success: true,
                ascii,
                metadata: {
                    fileName: file.name,
                    width,
                    charSet,
                    timestamp: Date.now()
                }
            };

            console.log('⚙️ GenerationService: Image generation complete');
            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_COMPLETE, result);

        } catch (error) {
            console.error('⚙️ GenerationService: Image generation error:', error);
            
            // Log to ErrorHandler if available
            if (window.errorHandler) {
                window.errorHandler.handleError({
                    type: 'ImageGenerationError',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.eventBus.emit(EventBus.Events.IMAGE_GENERATION_ERROR, error.message);
        } finally {
            this.isGenerating = false;
        }
    }

    async generatePoetry(options) {
        if (this.isGenerating) {
            this.eventBus.emit('ui:notification', { 
                message: 'Please wait for current generation to complete', 
                type: 'warning' 
            });
            return;
        }

        try {
            this.isGenerating = true;
            console.log('⚙️ GenerationService: Starting poetry generation...');
            
            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_START);

            const { 
                poem, 
                fontName = 'mini', 
                keywords = [], 
                layout = 'centered', 
                decoration = 'none',
                color = 'none',
                animation = 'none'
            } = options;

            // Validate input
            if (!poem || !poem.trim()) {
                throw new Error('Poem is required');
            }

            // Get font
            const font = this.fontManager.getFont(fontName);
            if (!font) {
                throw new Error(`Font "${fontName}" not found`);
            }

            // Generate poetry ASCII
            const ascii = await this.convertPoetryToASCII(poem, font, keywords, layout, decoration);

            const result = {
                success: true,
                ascii,
                metadata: {
                    poem,
                    fontName,
                    keywords,
                    layout,
                    decoration,
                    color,
                    animation,
                    timestamp: Date.now()
                }
            };

            console.log('⚙️ GenerationService: Poetry generation complete');
            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_COMPLETE, result);

        } catch (error) {
            console.error('⚙️ GenerationService: Poetry generation error:', error);
            
            // Log to ErrorHandler if available
            if (window.errorHandler) {
                window.errorHandler.handleError({
                    type: 'PoetryGenerationError',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.eventBus.emit(EventBus.Events.POETRY_GENERATION_ERROR, error.message);
        } finally {
            this.isGenerating = false;
        }
    }

    async convertImageToASCII(file, width, charSet) {
        return new Promise((resolve, reject) => {
            // Validate input
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Invalid file: must be an image'));
                return;
            }

            if (width < 20 || width > 200) {
                reject(new Error('Invalid width: must be between 20 and 200'));
                return;
            }

            // Timeout for image loading (5 seconds)
            const loadTimeout = setTimeout(() => {
                reject(new Error('Image loading timed out. Please try a different image.'));
            }, 5000);

            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                clearTimeout(loadTimeout);
                reject(new Error('Canvas context not available'));
                return;
            }

            img.onerror = () => {
                clearTimeout(loadTimeout);
                reject(new Error('Failed to load image. Please check the file and try again.'));
            };

            img.onabort = () => {
                clearTimeout(loadTimeout);
                reject(new Error('Image loading was aborted'));
            };

            img.onload = () => {
                clearTimeout(loadTimeout);
                try {
                    // Validate image dimensions
                    if (img.width <= 0 || img.height <= 0) {
                        throw new Error('Invalid image dimensions');
                    }

                    // Calculate height maintaining aspect ratio
                    const aspectRatio = img.height / img.width;
                    const height = Math.max(1, Math.floor(width * aspectRatio * 0.5)); // 0.5 for character aspect ratio

                    canvas.width = width;
                    canvas.height = height;

                    // Draw with error handling
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Get image data with error handling
                    let imageData;
                    try {
                        imageData = ctx.getImageData(0, 0, width, height);
                    } catch (error) {
                        throw new Error('Could not read image data. This might be a cross-origin image.');
                    }

                    const chars = this.getCharacterSet(charSet);
                    if (!chars || chars.length === 0) {
                        throw new Error(`Invalid character set: "${charSet}"`);
                    }

                    let ascii = '';

                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const pixelIndex = (y * width + x) * 4;
                            const r = imageData.data[pixelIndex] || 0;
                            const g = imageData.data[pixelIndex + 1] || 0;
                            const b = imageData.data[pixelIndex + 2] || 0;
                            const brightness = (r + g + b) / 3;

                            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                            ascii += chars[charIndex];
                        }
                        ascii += '\n';
                    }

                    if (!ascii || ascii.trim().length === 0) {
                        throw new Error('No ASCII art generated from image');
                    }

                    resolve(ascii);
                } catch (error) {
                    reject(new Error(`Image processing error: ${error.message}`));
                }
            };

            // Set source to trigger loading
            try {
                img.src = URL.createObjectURL(file);
            } catch (error) {
                clearTimeout(loadTimeout);
                reject(new Error(`Failed to create image URL: ${error.message}`));
            }
        });
    }

    async convertPoetryToASCII(poem, font, keywords, layout, decoration) {
        const lines = poem.split('\n');
        let result = '';

        // Add decoration
        if (decoration === 'borders') {
            result += this.createBorderLine(40) + '\n\n';
        } else if (decoration === 'stars') {
            result += '  ✨ '.repeat(15) + '\n\n';
        } else if (decoration === 'hearts') {
            result += '  💖 '.repeat(15) + '\n\n';
        }

        // Process lines
        const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
        
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
            result += '\n' + this.createBorderLine(40);
        } else if (decoration === 'stars') {
            result += '\n  ✨ '.repeat(15);
        } else if (decoration === 'hearts') {
            result += '\n  💖 '.repeat(15);
        }

        return result;
    }

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

    createBorderLine(length) {
        return '─'.repeat(length);
    }

    getCharacterSet(setName) {
        const sets = {
            standard: '@#%&*+=~-:,.` ',
            blocks: '█▓▒░ ',
            dots: '●○◯ ',
            simple: '#*+. ',
            detailed: '@#$%&*+=~-:,.` '
        };
        return sets[setName] || sets.standard;
    }

    isBusy() {
        return this.isGenerating;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GenerationService;
}
