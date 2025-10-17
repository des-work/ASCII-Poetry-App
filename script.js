// ASCII Art Generator - Main JavaScript File

class ASCIIArtGenerator {
    constructor() {
        try {
            // Constants
            this.MAX_TEXT_LENGTH = 5000;
            this.MAX_KEYWORDS = 20;
            this.MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
            this.SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            
            // State
            this.currentTheme = 'dark';
            this.currentTitleIndex = 0;
            this.titleFonts = ['block', '3d', 'star', 'pixel', 'bubble', 'slant', 'gothic'];
            this.keywords = new Set();
            this.isGenerating = false;
            this.currentImage = null;
            
            // Initialize
            this.initializeEventListeners();
            this.initializeTheme();
            this.initializeAnimatedTitle();
            this.addAsciiDecorations();
            this.initializeKeywordSystem();
        } catch (error) {
            console.error('Failed to initialize ASCIIArtGenerator:', error);
            this.showNotification('❌ Failed to initialize app. Please refresh the page.');
        }
    }

    initializeEventListeners() {
        try {
            console.log('🔧 Initializing event listeners...');
            
            // Tab switching
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tab = e?.target?.dataset?.tab;
                    console.log('📑 Tab clicked:', tab);
                    if (tab) this.switchTab(tab);
                });
            });

            // Text generation
            const generateTextBtn = document.getElementById('generate-text');
            if (generateTextBtn) {
                console.log('✅ Text generate button found');
                generateTextBtn.addEventListener('click', () => {
                    console.log('🎨 Generate Text ASCII button clicked!');
                    this.generateTextASCII();
                });
            } else {
                console.error('❌ Text generate button NOT found');
            }
            
            // Image generation
            const generateImageBtn = document.getElementById('generate-image');
            if (generateImageBtn) {
                console.log('✅ Image generate button found');
                generateImageBtn.addEventListener('click', () => {
                    console.log('🖼️ Generate Image ASCII button clicked!');
                    this.generateImageASCII();
                });
            } else {
                console.error('❌ Image generate button NOT found');
            }
            
            // Poetry generation
            const generatePoetryBtn = document.getElementById('generate-poetry');
            if (generatePoetryBtn) {
                console.log('✅ Poetry generate button found');
                generatePoetryBtn.addEventListener('click', () => {
                    console.log('📝 Generate Poetry ASCII button clicked!');
                    this.generatePoetryASCII();
                });
            } else {
                console.error('❌ Poetry generate button NOT found');
            }
            
            // Image input
            const imageInput = document.getElementById('image-input');
            if (imageInput) {
                imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
            }
            
            // Width slider
            const widthSlider = document.getElementById('image-width');
            const widthValue = document.getElementById('width-value');
            if (widthSlider && widthValue) {
                widthSlider.addEventListener('input', (e) => {
                    widthValue.textContent = e.target.value;
                });
            }

            // Output controls
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => this.copyToClipboard());
            }
            
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.downloadASCII());
            }
            
            const clearBtn = document.getElementById('clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearOutput());
            }

            // Theme toggle
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => this.toggleTheme());
            }
            
            console.log('✅ Event listeners initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing event listeners:', error);
        }
    }

    initializeTheme() {
        try {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            this.setTheme(savedTheme);
        } catch (error) {
            console.error('Error initializing theme:', error);
            this.setTheme('dark');
        }
    }

    switchTab(tabName) {
        try {
            if (!tabName || typeof tabName !== 'string') {
                console.warn('Invalid tab name:', tabName);
                return;
            }

            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
            if (tabButton) {
                tabButton.classList.add('active');
            }

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const tabContent = document.getElementById(`${tabName}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        } catch (error) {
            console.error('Error switching tabs:', error);
        }
    }

    async generateTextASCII() {
        console.log('🎨 generateTextASCII called');
        
        // Prevent concurrent generation
        if (this.isGenerating) {
            console.warn('⚠️ Already generating...');
            this.showNotification('⚠️ Please wait for current generation to complete!');
            return;
        }

        try {
            this.isGenerating = true;
            console.log('🚀 Starting text generation...');
            
            const textInput = document.getElementById('text-input');
            const fontSelect = document.getElementById('font-select');
            const colorSelect = document.getElementById('color-select');
            const animationSelect = document.getElementById('animation-select');

            if (!textInput || !fontSelect || !colorSelect || !animationSelect) {
                throw new Error('Required elements not found');
            }

            const text = this.sanitizeInput(textInput.value.trim());
            
            // Validate input
            if (!text) {
                this.showNotification('⚠️ Please enter some text first!');
                return;
            }

            if (text.length > this.MAX_TEXT_LENGTH) {
                this.showNotification(`⚠️ Text too long! Maximum ${this.MAX_TEXT_LENGTH} characters.`);
                return;
            }

            const font = fontSelect.value || 'standard';
            const color = colorSelect.value || 'none';
            const animation = animationSelect.value || 'none';

            this.showLoading();
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for effect
            
            const asciiArt = await this.convertTextToASCII(text, font);
            
            if (!asciiArt) {
                throw new Error('Failed to generate ASCII art');
            }
            
            this.displayASCII(asciiArt, color, animation);
            this.showNotification('✨ ASCII art generated successfully!');
        } catch (error) {
            console.error('Error generating ASCII art:', error);
            this.showNotification('❌ Error generating ASCII art. Please try again.');
        } finally {
            this.hideLoading();
            this.isGenerating = false;
        }
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        // Remove potentially dangerous characters but keep ASCII art friendly ones
        return input.replace(/[<>]/g, '');
    }

    validateImageFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (!this.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            return { 
                valid: false, 
                error: `Unsupported file type. Please use: ${this.SUPPORTED_IMAGE_TYPES.join(', ')}` 
            };
        }

        if (file.size > this.MAX_IMAGE_SIZE) {
            return { 
                valid: false, 
                error: `File too large. Maximum size: ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB` 
            };
        }

        return { valid: true };
    }

    showNotification(message) {
        try {
            if (!message || typeof message !== 'string') {
                console.warn('Invalid notification message:', message);
                return;
            }

            // Create notification element if it doesn't exist
            let notification = document.getElementById('notification');
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
            }

            notification.textContent = message;
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';

            setTimeout(() => {
                if (notification) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-10px)';
                }
            }, 3000);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    async convertTextToASCII(text, font) {
        // ASCII art fonts using figlet-like patterns
        const fonts = {
            standard: this.getStandardFont(),
            block: this.getBlockFont(),
            bubble: this.getBubbleFont(),
            lean: this.getLeanFont(),
            mini: this.getMiniFont(),
            script: this.getScriptFont(),
            slant: this.getSlantFont(),
            small: this.getSmallFont(),
            big: this.getBigFont()
        };

        const selectedFont = fonts[font] || fonts.standard;
        return this.renderTextWithFont(text.toUpperCase(), selectedFont);
    }

    renderTextWithFont(text, font) {
        const lines = [];
        const height = font.A.length;
        
        for (let i = 0; i < height; i++) {
            let line = '';
            for (const char of text) {
                if (font[char] && font[char][i]) {
                    line += font[char][i];
                } else {
                    line += ' '.repeat(font.A[i].length);
                }
            }
            lines.push(line);
        }
        
        return lines.join('\n');
    }

    async generateImageASCII() {
        console.log('🖼️ generateImageASCII called');
        
        // Prevent concurrent generation
        if (this.isGenerating) {
            console.warn('⚠️ Already generating...');
            this.showNotification('⚠️ Please wait for current generation to complete!');
            return;
        }

        try {
            this.isGenerating = true;
            console.log('🚀 Starting image generation...');
            
            const fileInput = document.getElementById('image-input');
            if (!fileInput || !fileInput.files[0]) {
                this.showNotification('⚠️ Please select an image first!');
                this.isGenerating = false;
                return;
            }

            const widthInput = document.getElementById('image-width');
            const charSetSelect = document.getElementById('image-chars');
            const colorModeSelect = document.getElementById('image-color');
            
            if (!widthInput || !charSetSelect || !colorModeSelect) {
                throw new Error('Required image input elements not found');
            }

            const width = parseInt(widthInput.value);
            const charSet = charSetSelect.value;
            const colorMode = colorModeSelect.value;

            console.log(`📊 Image settings: width=${width}, charSet=${charSet}, colorMode=${colorMode}`);

            this.showLoading();
            const asciiArt = await this.convertImageToASCII(fileInput.files[0], width, charSet, colorMode);
            this.displayASCII(asciiArt, 'none', 'none');
            this.showNotification('✨ Image converted to ASCII art!');
            console.log('✅ Image generation complete');
        } catch (error) {
            console.error('❌ Error generating image ASCII:', error);
            this.showNotification('❌ Error generating ASCII art. Please try again.');
        } finally {
            this.hideLoading();
            this.isGenerating = false;
        }
    }

    async generatePoetryASCII() {
        console.log('📝 generatePoetryASCII called');
        
        // Prevent concurrent generation
        if (this.isGenerating) {
            console.warn('⚠️ Already generating...');
            this.showNotification('⚠️ Please wait for current generation to complete!');
            return;
        }

        try {
            this.isGenerating = true;
            console.log('🚀 Starting poetry generation...');
            
            const poemInput = document.getElementById('poem-input');
            if (!poemInput) {
                throw new Error('Poem input element not found');
            }

            const poem = poemInput.value.trim();
            if (!poem) {
                this.showNotification('⚠️ Please enter a poem first!');
                this.isGenerating = false;
                return;
            }

            const fontSelect = document.getElementById('poetry-font-select');
            const layoutSelect = document.getElementById('poetry-layout');
            const colorSelect = document.getElementById('poetry-color-select');
            const animationSelect = document.getElementById('poetry-animation-select');
            const decorationSelect = document.getElementById('poetry-decoration');

            if (!fontSelect || !layoutSelect || !colorSelect || !animationSelect || !decorationSelect) {
                throw new Error('Required poetry input elements not found');
            }

            const font = fontSelect.value;
            const layout = layoutSelect.value;
            const color = colorSelect.value;
            const animation = animationSelect.value;
            const decoration = decorationSelect.value;

            console.log(`📊 Poetry settings: font=${font}, layout=${layout}, color=${color}, keywords=${this.keywords.size}`);

            this.showLoading();
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for effect
            const asciiArt = await this.convertPoetryToASCII(poem, font, layout, decoration);
            this.displayPoetryASCII(asciiArt, color, animation, layout, decoration);
            this.showNotification('✨ Poetry art created beautifully!');
            console.log('✅ Poetry generation complete');
        } catch (error) {
            console.error('❌ Error generating poetry ASCII:', error);
            this.showNotification('❌ Error generating poetry ASCII art. Please try again.');
        } finally {
            this.hideLoading();
            this.isGenerating = false;
        }
    }

    async convertImageToASCII(file, width, charSet, colorMode) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                const aspectRatio = img.height / img.width;
                const height = Math.floor(width * aspectRatio);
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                
                const chars = this.getCharacterSet(charSet);
                let asciiArt = '';
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const pixelIndex = (y * width + x) * 4;
                        const r = imageData.data[pixelIndex];
                        const g = imageData.data[pixelIndex + 1];
                        const b = imageData.data[pixelIndex + 2];
                        const brightness = (r + g + b) / 3;
                        
                        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                        asciiArt += chars[charIndex];
                    }
                    asciiArt += '\n';
                }
                
                resolve(asciiArt);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    getCharacterSet(setName) {
        const sets = {
            standard: '@#%&*+=~-:,.`',
            blocks: '█▓▒░',
            dots: '●○◯',
            simple: '#*+.',
            detailed: '@#$%&*+=~-:,.`'
        };
        return sets[setName] || sets.standard;
    }

    displayASCII(asciiArt, color, animation) {
        const output = document.getElementById('ascii-output');
        output.textContent = asciiArt;
        
        // Remove existing classes
        output.className = 'ascii-output';
        
        // Apply color
        if (color !== 'none') {
            this.applyColor(output, color);
        }
        
        // Apply animation
        if (animation !== 'none') {
            output.classList.add(`animation-${animation}`);
        }
    }

    displayPoetryASCII(asciiArt, color, animation, layout, decoration) {
        const output = document.getElementById('ascii-output');
        output.textContent = asciiArt;
        
        // Remove existing classes
        output.className = 'ascii-output';
        
        // Apply layout
        if (layout !== 'centered') {
            output.classList.add(`poetry-layout-${layout}`);
        }
        
        // Apply decoration
        if (decoration !== 'none') {
            output.classList.add(`poetry-decoration-${decoration}`);
        }
        
        // Apply color
        if (color !== 'none') {
            this.applyPoetryColor(output, color);
        }
        
        // Apply animation
        if (animation !== 'none') {
            output.classList.add(`animation-${animation}`);
        }
    }

    applyColor(element, color) {
        const colors = {
            red: '#ff4444',
            green: '#44ff44',
            blue: '#4444ff',
            yellow: '#ffff44',
            purple: '#ff44ff',
            cyan: '#44ffff',
            magenta: '#ff44ff',
            rainbow: 'rainbow'
        };

        if (color === 'rainbow') {
            this.applyRainbowEffect(element);
        } else {
            element.style.color = colors[color] || '#ffffff';
        }
    }

    applyRainbowEffect(element) {
        const text = element.textContent;
        let rainbowText = '';
        const colors = ['#ff0000', '#ff8800', '#ffff00', '#88ff00', '#00ff00', '#00ff88', '#00ffff', '#0088ff', '#0000ff', '#8800ff', '#ff00ff', '#ff0088'];
        
        for (let i = 0; i < text.length; i++) {
            const color = colors[i % colors.length];
            rainbowText += `<span style="color: ${color}">${text[i]}</span>`;
        }
        
        element.innerHTML = rainbowText;
    }

    applyPoetryColor(element, color) {
        const colors = {
            red: '#ff4444',
            green: '#44ff44',
            blue: '#4444ff',
            purple: '#ff44ff',
            gold: '#ffd700',
            silver: '#c0c0c0',
            rainbow: 'rainbow',
            gradient: 'gradient',
            romantic: '#ff69b4',
            mystical: '#9370db'
        };

        if (color === 'rainbow') {
            this.applyRainbowEffect(element);
        } else if (color === 'gradient') {
            this.applyGradientEffect(element);
        } else {
            element.style.color = colors[color] || '#ffffff';
        }
    }

    applyGradientEffect(element) {
        const text = element.textContent;
        let gradientText = '';
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < text.length; i++) {
            const color = colors[i % colors.length];
            gradientText += `<span style="color: ${color}">${text[i]}</span>`;
        }
        
        element.innerHTML = gradientText;
    }

    async convertPoetryToASCII(poem, font, layout, decoration) {
        const lines = poem.split('\n');
        const selectedFont = this.getFont(font);
        
        let result = '';
        
        // Add decoration at the top if specified
        if (decoration === 'borders') {
            result += this.createBorder('top') + '\n\n';
        } else if (decoration === 'flowers') {
            result += '  🌸 '.repeat(15) + '\n\n';
        } else if (decoration === 'stars') {
            result += '  ✨ '.repeat(15) + '\n\n';
        } else if (decoration === 'hearts') {
            result += '  💖 '.repeat(15) + '\n\n';
        }
        
        // Process each line of the poem
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) {
                result += '\n';
                continue;
            }
            
            // Transform line with keywords
            const transformedLine = this.transformLineWithKeywords(line, selectedFont);
            result += transformedLine + '\n';
        }
        
        // Add decoration at the bottom if specified
        if (decoration === 'borders') {
            result += '\n' + this.createBorder('bottom');
        } else if (decoration === 'flowers') {
            result += '\n  🌸 '.repeat(15);
        } else if (decoration === 'stars') {
            result += '\n  ✨ '.repeat(15);
        } else if (decoration === 'hearts') {
            result += '\n  💖 '.repeat(15);
        }
        
        return result;
    }

    transformLineWithKeywords(line, font) {
        if (this.keywords.size === 0) {
            // No keywords, return normal text
            return '  ' + line;
        }

        // Split line into words while preserving punctuation
        const words = line.split(/(\s+)/);
        let transformedLine = [];
        
        words.forEach(word => {
            if (!word.trim()) {
                transformedLine.push(word);
                return;
            }
            
            // Check if word (without punctuation) is a keyword
            const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
            const isKeyword = this.keywords.has(cleanWord);
            
            if (isKeyword) {
                // Transform keyword to ASCII
                const asciiWord = this.renderSmallASCII(word.toUpperCase(), font);
                transformedLine.push(asciiWord);
            } else {
                // Keep as normal text with spacing
                transformedLine.push('  ' + word);
            }
        });
        
        return transformedLine.join('');
    }

    renderSmallASCII(word, font) {
        // Create a compact ASCII version for keywords
        const chars = word.split('');
        let result = '';
        
        // Get the height of the font
        const height = font.A ? font.A.length : 3;
        
        for (let row = 0; row < height; row++) {
            for (let char of chars) {
                const upperChar = char.toUpperCase();
                if (font[upperChar] && font[upperChar][row]) {
                    result += font[upperChar][row];
                } else if (char === ' ') {
                    result += ' '.repeat(font.A ? font.A[row].length : 3);
                } else {
                    // For punctuation or unsupported chars, use the char itself
                    result += char + ' ';
                }
            }
            if (row < height - 1) result += '\n';
        }
        
        return result;
    }

    createBorder(type) {
        if (type === 'top') {
            return '┌' + '─'.repeat(38) + '┐';
        } else if (type === 'bottom') {
            return '└' + '─'.repeat(38) + '┘';
        }
        return '';
    }

    getFont(fontName) {
        const fonts = {
            standard: this.getStandardFont(),
            block: this.getBlockFont(),
            bubble: this.getBubbleFont(),
            lean: this.getLeanFont(),
            mini: this.getMiniFont(),
            script: this.getScriptFont(),
            slant: this.getSlantFont(),
            small: this.getSmallFont(),
            big: this.getBigFont(),
            elegant: this.getElegantFont(),
            romantic: this.getRomanticFont(),
            classic: this.getClassicFont(),
            modern: this.getModernFont(),
            calligraphy: this.getCalligraphyFont(),
            gothic: this.getGothicFont(),
            serif: this.getSerifFont(),
            sans: this.getSansFont(),
            decorative: this.getDecorativeFont(),
            artistic: this.getArtisticFont(),
            '3d': this.get3DFont(),
            star: this.getStarFont(),
            dot: this.getDotFont(),
            wavy: this.getWavyFont(),
            pixel: this.getPixelFont()
        };
        return fonts[fontName] || fonts.standard;
    }

    handleImageUpload(event) {
        try {
            const file = event?.target?.files?.[0];
            if (!file) {
                return;
            }

            // Validate file
            const validation = this.validateImageFile(file);
            if (!validation.valid) {
                this.showNotification(`⚠️ ${validation.error}`);
                event.target.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            
            reader.onerror = () => {
                console.error('Error reading file');
                this.showNotification('❌ Error reading image file');
                event.target.value = '';
            };
            
            reader.onload = (e) => {
                try {
                    this.currentImage = e.target.result;
                    console.log('Image loaded successfully:', file.name);
                    this.showNotification('✅ Image loaded successfully!');
                } catch (error) {
                    console.error('Error processing image:', error);
                    this.showNotification('❌ Error processing image');
                }
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error handling image upload:', error);
            this.showNotification('❌ Error uploading image');
        }
    }

    copyToClipboard() {
        try {
            const outputElement = document.getElementById('ascii-output');
            if (!outputElement) {
                throw new Error('Output element not found');
            }

            const output = outputElement.textContent;
            if (!output || !output.trim()) {
                this.showNotification('⚠️ No ASCII art to copy!');
                return;
            }

            if (!navigator.clipboard) {
                // Fallback for browsers without clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = output;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('📋 Copied to clipboard!');
                return;
            }

            navigator.clipboard.writeText(output).then(() => {
                this.showNotification('📋 Copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                this.showNotification('❌ Failed to copy to clipboard');
            });
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('❌ Failed to copy to clipboard');
        }
    }

    downloadASCII() {
        try {
            const outputElement = document.getElementById('ascii-output');
            if (!outputElement) {
                throw new Error('Output element not found');
            }

            const output = outputElement.textContent;
            if (!output || !output.trim()) {
                this.showNotification('⚠️ No ASCII art to download!');
                return;
            }

            const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ascii-art-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            this.showNotification('💾 Downloaded successfully!');
        } catch (error) {
            console.error('Error downloading ASCII art:', error);
            this.showNotification('❌ Failed to download');
        }
    }

    clearOutput() {
        try {
            const outputElement = document.getElementById('ascii-output');
            if (outputElement) {
                outputElement.textContent = '';
                outputElement.className = 'ascii-output';
                this.showNotification('🗑️ Output cleared');
            }
        } catch (error) {
            console.error('Error clearing output:', error);
        }
    }

    toggleTheme() {
        try {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(this.currentTheme);
            
            try {
                localStorage.setItem('theme', this.currentTheme);
            } catch (storageError) {
                console.warn('Failed to save theme to localStorage:', storageError);
            }
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    setTheme(theme) {
        try {
            if (!theme || (theme !== 'dark' && theme !== 'light')) {
                theme = 'dark';
            }
            
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) {
                themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
            }
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }

    initializeAnimatedTitle() {
        try {
            this.animateTitle();
            // Change title every 4 seconds for more dramatic effect
            setInterval(() => {
                try {
                    this.animateTitle();
                } catch (error) {
                    console.error('Error in title animation:', error);
                }
            }, 4000);
        } catch (error) {
            console.error('Error initializing animated title:', error);
        }
    }

    animateTitle() {
        try {
            const titleElement = document.getElementById('ascii-title');
            if (!titleElement) return;

            const text = 'ASCII ART';
            const fontName = this.titleFonts[this.currentTitleIndex];
            const font = this.getFont(fontName);
            
            if (!font) {
                console.warn('Font not found:', fontName);
                return;
            }
            
            const asciiText = this.renderTextWithFont(text, font);
            if (asciiText) {
                titleElement.textContent = asciiText;
            }
            
            this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titleFonts.length;
        } catch (error) {
            console.error('Error animating title:', error);
        }
    }

    addAsciiDecorations() {
        // Add loading indicator
        this.createLoadingIndicator();
        
        // Add corner decorations
        this.addCornerDecorations();
    }

    createLoadingIndicator() {
        const loadingHTML = `
            <div id="loading-indicator" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;">
                <div style="font-family: 'JetBrains Mono', monospace; color: var(--accent); font-size: 2rem; text-align: center;">
                    <div class="loading-ascii">
                        ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏
                    </div>
                    <p style="font-size: 1rem; margin-top: 20px;">Generating...</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        
        // Add CSS for loading animation
        const style = document.createElement('style');
        style.textContent = `
            .loading-ascii {
                animation: loading-spin 1s steps(10) infinite;
            }
            @keyframes loading-spin {
                0% { content: '⠋'; }
                10% { content: '⠙'; }
                20% { content: '⠹'; }
                30% { content: '⠸'; }
                40% { content: '⠼'; }
                50% { content: '⠴'; }
                60% { content: '⠦'; }
                70% { content: '⠧'; }
                80% { content: '⠇'; }
                90% { content: '⠏'; }
                100% { content: '⠋'; }
            }
        `;
        document.head.appendChild(style);
    }

    addCornerDecorations() {
        const corners = `
            <div class="corner-decorations" style="position: fixed; pointer-events: none; z-index: 1;">
                <div style="position: fixed; top: 10px; left: 10px; font-family: 'JetBrains Mono', monospace; opacity: 0.2; font-size: 0.9rem; background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    ╭─
                </div>
                <div style="position: fixed; top: 10px; right: 10px; font-family: 'JetBrains Mono', monospace; opacity: 0.2; font-size: 0.9rem; background: var(--gradient-soft); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    ─╮
                </div>
                <div style="position: fixed; bottom: 10px; left: 10px; font-family: 'JetBrains Mono', monospace; opacity: 0.2; font-size: 0.9rem; background: var(--gradient-glow); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    ╰─
                </div>
                <div style="position: fixed; bottom: 10px; right: 10px; font-family: 'JetBrains Mono', monospace; opacity: 0.2; font-size: 0.9rem; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    ─╯
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', corners);
    }

    showLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.style.display = 'block';
    }

    hideLoading() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.style.display = 'none';
    }

    initializeKeywordSystem() {
        try {
            const keywordsInput = document.getElementById('keywords-input');
            const autoDetectBtn = document.getElementById('auto-detect-btn');
            
            if (keywordsInput) {
                keywordsInput.addEventListener('input', (e) => this.handleKeywordInput(e));
                keywordsInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addKeywordFromInput();
                    }
                });
            }
            
            if (autoDetectBtn) {
                autoDetectBtn.addEventListener('click', () => this.autoDetectKeywords());
            }
        } catch (error) {
            console.error('Error initializing keyword system:', error);
        }
    }

    handleKeywordInput(e) {
        try {
            const value = e?.target?.value;
            if (!value) return;
            
            if (value.includes(',')) {
                const keywords = value.split(',')
                    .map(k => this.sanitizeInput(k.trim()))
                    .filter(k => k && k.length > 0);
                    
                keywords.forEach(keyword => this.addKeyword(keyword));
                e.target.value = '';
            }
        } catch (error) {
            console.error('Error handling keyword input:', error);
        }
    }

    addKeywordFromInput() {
        try {
            const input = document.getElementById('keywords-input');
            if (!input) return;
            
            const keyword = this.sanitizeInput(input.value.trim());
            if (keyword) {
                this.addKeyword(keyword);
                input.value = '';
            }
        } catch (error) {
            console.error('Error adding keyword from input:', error);
        }
    }

    addKeyword(keyword) {
        try {
            if (!keyword || typeof keyword !== 'string') return;
            
            const cleanKeyword = keyword.toLowerCase();
            
            if (this.keywords.has(cleanKeyword)) {
                this.showNotification('⚠️ Keyword already added!');
                return;
            }
            
            if (this.keywords.size >= this.MAX_KEYWORDS) {
                this.showNotification(`⚠️ Maximum ${this.MAX_KEYWORDS} keywords allowed!`);
                return;
            }
            
            this.keywords.add(cleanKeyword);
            this.renderKeywordChips();
        } catch (error) {
            console.error('Error adding keyword:', error);
        }
    }

    removeKeyword(keyword) {
        try {
            if (!keyword) return;
            this.keywords.delete(keyword.toLowerCase());
            this.renderKeywordChips();
        } catch (error) {
            console.error('Error removing keyword:', error);
        }
    }

    renderKeywordChips() {
        try {
            const container = document.getElementById('keyword-chips');
            if (!container) return;
            
            container.innerHTML = '';
            
            this.keywords.forEach(keyword => {
                try {
                    const chip = document.createElement('div');
                    chip.className = 'keyword-chip';
                    
                    const textSpan = document.createElement('span');
                    textSpan.textContent = keyword;
                    
                    const removeSpan = document.createElement('span');
                    removeSpan.className = 'remove';
                    removeSpan.textContent = '×';
                    removeSpan.setAttribute('data-keyword', keyword);
                    removeSpan.addEventListener('click', () => {
                        this.removeKeyword(keyword);
                    });
                    
                    chip.appendChild(textSpan);
                    chip.appendChild(removeSpan);
                    container.appendChild(chip);
                } catch (chipError) {
                    console.error('Error creating chip:', chipError);
                }
            });
        } catch (error) {
            console.error('Error rendering keyword chips:', error);
        }
    }

    autoDetectKeywords() {
        try {
            const poemInput = document.getElementById('poem-input');
            if (!poemInput) {
                throw new Error('Poem input element not found');
            }

            const poem = poemInput.value;
            if (!poem || !poem.trim()) {
                this.showNotification('⚠️ Please enter a poem first!');
                return;
            }

            // Common words to exclude
            const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'this', 'that', 'these', 'those', 'your', 'my', 'his', 'her', 'its', 'our', 'their', 'who', 'what', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such']);

            // Extract words and find significant ones
            const words = poem.toLowerCase().match(/\b[a-z]+\b/g) || [];
            const wordCount = {};
            
            words.forEach(word => {
                if (!commonWords.has(word) && word.length > 3) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });

            // Get top keywords (words that appear more than once or are longer)
            const detectedKeywords = Object.keys(wordCount)
                .filter(word => wordCount[word] > 1 || word.length > 6)
                .slice(0, Math.min(5, this.MAX_KEYWORDS - this.keywords.size));

            if (detectedKeywords.length === 0) {
                this.showNotification('ℹ️ No significant keywords detected. Try adding them manually!');
                return;
            }

            detectedKeywords.forEach(keyword => this.addKeyword(keyword));
            this.showNotification(`✨ Detected ${detectedKeywords.length} keywords!`);
        } catch (error) {
            console.error('Error auto-detecting keywords:', error);
            this.showNotification('❌ Error detecting keywords');
        }
    }

    // ASCII Font Definitions
    getStandardFont() {
        return {
            A: ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██', '██  ██'],
            B: ['█████ ', '██  ██', '█████ ', '██  ██', '██  ██', '█████ '],
            C: [' █████', '██    ', '██    ', '██    ', '██    ', ' █████'],
            D: ['█████ ', '██  ██', '██  ██', '██  ██', '██  ██', '█████ '],
            E: ['██████', '██    ', '████  ', '██    ', '██    ', '██████'],
            F: ['██████', '██    ', '████  ', '██    ', '██    ', '██    '],
            G: [' █████', '██    ', '██    ', '██ ███', '██  ██', ' █████'],
            H: ['██  ██', '██  ██', '██████', '██  ██', '██  ██', '██  ██'],
            I: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '██████'],
            J: ['██████', '    ██', '    ██', '    ██', '██  ██', ' ████ '],
            K: ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██', '██  ██'],
            L: ['██    ', '██    ', '██    ', '██    ', '██    ', '██████'],
            M: ['██  ██', '██████', '██ ███', '██  ██', '██  ██', '██  ██'],
            N: ['██  ██', '███ ██', '██████', '██ ███', '██  ██', '██  ██'],
            O: [' █████', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
            P: ['█████ ', '██  ██', '█████ ', '██    ', '██    ', '██    '],
            Q: [' █████', '██  ██', '██  ██', '██ ███', '██  ██', ' █████'],
            R: ['█████ ', '██  ██', '█████ ', '██ ██ ', '██  ██', '██  ██'],
            S: [' █████', '██    ', ' █████', '    ██', '    ██', ' █████'],
            T: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
            U: ['██  ██', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
            V: ['██  ██', '██  ██', '██  ██', ' ████ ', ' ████ ', '  ██  '],
            W: ['██  ██', '██  ██', '██ ███', '██████', '██  ██', '██  ██'],
            X: ['██  ██', ' ████ ', '  ██  ', '  ██  ', ' ████ ', '██  ██'],
            Y: ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
            Z: ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██████'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getBlockFont() {
        return {
            A: ['████  ', '██  ██', '██████', '██  ██', '██  ██', '██  ██'],
            B: ['█████ ', '██  ██', '█████ ', '██  ██', '██  ██', '█████ '],
            C: [' █████', '██    ', '██    ', '██    ', '██    ', ' █████'],
            D: ['█████ ', '██  ██', '██  ██', '██  ██', '██  ██', '█████ '],
            E: ['██████', '██    ', '████  ', '██    ', '██    ', '██████'],
            F: ['██████', '██    ', '████  ', '██    ', '██    ', '██    '],
            G: [' █████', '██    ', '██    ', '██ ███', '██  ██', ' █████'],
            H: ['██  ██', '██  ██', '██████', '██  ██', '██  ██', '██  ██'],
            I: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '██████'],
            J: ['██████', '    ██', '    ██', '    ██', '██  ██', ' ████ '],
            K: ['██  ██', '██ ██ ', '████  ', '██ ██ ', '██  ██', '██  ██'],
            L: ['██    ', '██    ', '██    ', '██    ', '██    ', '██████'],
            M: ['██  ██', '██████', '██ ███', '██  ██', '██  ██', '██  ██'],
            N: ['██  ██', '███ ██', '██████', '██ ███', '██  ██', '██  ██'],
            O: [' █████', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
            P: ['█████ ', '██  ██', '█████ ', '██    ', '██    ', '██    '],
            Q: [' █████', '██  ██', '██  ██', '██ ███', '██  ██', ' █████'],
            R: ['█████ ', '██  ██', '█████ ', '██ ██ ', '██  ██', '██  ██'],
            S: [' █████', '██    ', ' █████', '    ██', '    ██', ' █████'],
            T: ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  '],
            U: ['██  ██', '██  ██', '██  ██', '██  ██', '██  ██', ' █████'],
            V: ['██  ██', '██  ██', '██  ██', ' ████ ', ' ████ ', '  ██  '],
            W: ['██  ██', '██  ██', '██ ███', '██████', '██  ██', '██  ██'],
            X: ['██  ██', ' ████ ', '  ██  ', '  ██  ', ' ████ ', '██  ██'],
            Y: ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  '],
            Z: ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██████'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getBubbleFont() {
        return {
            A: ['  ●●  ', ' ●●●● ', '●●  ●●', '●●●●●●', '●●  ●●', '●●  ●●'],
            B: ['●●●●● ', '●●  ●●', '●●●●● ', '●●  ●●', '●●  ●●', '●●●●● '],
            C: [' ●●●●●', '●●    ', '●●    ', '●●    ', '●●    ', ' ●●●●●'],
            D: ['●●●●● ', '●●  ●●', '●●  ●●', '●●  ●●', '●●  ●●', '●●●●● '],
            E: ['●●●●●●', '●●    ', '●●●●  ', '●●    ', '●●    ', '●●●●●●'],
            F: ['●●●●●●', '●●    ', '●●●●  ', '●●    ', '●●    ', '●●    '],
            G: [' ●●●●●', '●●    ', '●●    ', '●● ●●●', '●●  ●●', ' ●●●●●'],
            H: ['●●  ●●', '●●  ●●', '●●●●●●', '●●  ●●', '●●  ●●', '●●  ●●'],
            I: ['●●●●●●', '  ●●  ', '  ●●  ', '  ●●  ', '  ●●  ', '●●●●●●'],
            J: ['●●●●●●', '    ●●', '    ●●', '    ●●', '●●  ●●', ' ●●●● '],
            K: ['●●  ●●', '●● ●● ', '●●●●  ', '●● ●● ', '●●  ●●', '●●  ●●'],
            L: ['●●    ', '●●    ', '●●    ', '●●    ', '●●    ', '●●●●●●'],
            M: ['●●  ●●', '●●●●●●', '●● ●●●', '●●  ●●', '●●  ●●', '●●  ●●'],
            N: ['●●  ●●', '●●● ●●', '●●●●●●', '●● ●●●', '●●  ●●', '●●  ●●'],
            O: [' ●●●●●', '●●  ●●', '●●  ●●', '●●  ●●', '●●  ●●', ' ●●●●●'],
            P: ['●●●●● ', '●●  ●●', '●●●●● ', '●●    ', '●●    ', '●●    '],
            Q: [' ●●●●●', '●●  ●●', '●●  ●●', '●● ●●●', '●●  ●●', ' ●●●●●'],
            R: ['●●●●● ', '●●  ●●', '●●●●● ', '●● ●● ', '●●  ●●', '●●  ●●'],
            S: [' ●●●●●', '●●    ', ' ●●●●●', '    ●●', '    ●●', ' ●●●●●'],
            T: ['●●●●●●', '  ●●  ', '  ●●  ', '  ●●  ', '  ●●  ', '  ●●  '],
            U: ['●●  ●●', '●●  ●●', '●●  ●●', '●●  ●●', '●●  ●●', ' ●●●●●'],
            V: ['●●  ●●', '●●  ●●', '●●  ●●', ' ●●●● ', ' ●●●● ', '  ●●  '],
            W: ['●●  ●●', '●●  ●●', '●● ●●●', '●●●●●●', '●●  ●●', '●●  ●●'],
            X: ['●●  ●●', ' ●●●● ', '  ●●  ', '  ●●  ', ' ●●●● ', '●●  ●●'],
            Y: ['●●  ●●', '●●  ●●', ' ●●●● ', '  ●●  ', '  ●●  ', '  ●●  '],
            Z: ['●●●●●●', '    ●●', '   ●● ', '  ●●  ', ' ●●   ', '●●●●●●'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getLeanFont() {
        return {
            A: ['  /\\  ', ' /  \\ ', '/____\\', '/    \\', '/    \\', '/    \\'],
            B: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|____/'],
            C: [' /\\   ', '/  \\  ', '|    ', '|    ', '\\  / ', ' \\/  '],
            D: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|____/'],
            E: ['|____ ', '|     ', '|____ ', '|     ', '|     ', '|____ '],
            F: ['|____ ', '|     ', '|____ ', '|     ', '|     ', '|     '],
            G: [' /\\   ', '/  \\  ', '|    ', '|  /\\ ', '\\  / ', ' \\/  '],
            H: ['|    |', '|    |', '|____|', '|    |', '|    |', '|    |'],
            I: ['|____|', '  |  ', '  |  ', '  |  ', '  |  ', '|____|'],
            J: ['|____|', '    |', '    |', '    |', '|  |', ' \\/ '],
            K: ['|   / ', '|  /  ', '| /   ', '|/    ', '| \\   ', '|  \\  '],
            L: ['|     ', '|     ', '|     ', '|     ', '|     ', '|____ '],
            M: ['|\\  /|', '| \\/ |', '|    |', '|    |', '|    |', '|    |'],
            N: ['|\\   |', '| \\  |', '|  \\ |', '|   \\|', '|    |', '|    |'],
            O: [' /\\   ', '/  \\  ', '|    |', '|    |', '\\  / ', ' \\/  '],
            P: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    ', '|     '],
            Q: [' /\\   ', '/  \\  ', '|    |', '|  \\ |', '\\  \\|', ' \\/\\ '],
            R: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|     '],
            S: [' /\\   ', '/  \\  ', ' \\   ', '  \\  ', '  /  ', ' \\/  '],
            T: ['|____|', '  |  ', '  |  ', '  |  ', '  |  ', '  |  '],
            U: ['|    |', '|    |', '|    |', '|    |', '\\  / ', ' \\/  '],
            V: ['|    |', '|    |', '|    |', ' \\  / ', '  \\/  ', '  /\\  '],
            W: ['|    |', '|    |', '| /\\ |', '|/  \\|', '|    |', '|    |'],
            X: ['|    |', ' \\  / ', '  \\/  ', '  /\\  ', ' /  \\ ', '|    |'],
            Y: ['|    |', '|    |', ' \\  / ', '  \\/  ', '  /\\  ', '  /\\  '],
            Z: ['|____|', '    / ', '   /  ', '  /   ', ' /    ', '|____|'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getMiniFont() {
        return {
            A: [' ▄ ', '▄▀▄', '▀ ▀'],
            B: ['▄▀▄', '▄▀▄', '▀▀▀'],
            C: ['▄▀▄', '▄  ', '▀▀▀'],
            D: ['▄▀▄', '▄ ▀', '▀▀▀'],
            E: ['▄▀▀', '▄▀ ', '▀▀▀'],
            F: ['▄▀▀', '▄▀ ', '▀  '],
            G: ['▄▀▄', '▄ ▀', '▀▀▀'],
            H: ['▄ ▄', '▄▀▄', '▀ ▀'],
            I: ['▄▀▄', ' ▀ ', '▄▀▄'],
            J: ['  ▄', '  ▀', '▀▀▀'],
            K: ['▄ ▀', '▄▀ ', '▀ ▀'],
            L: ['▄  ', '▄  ', '▀▀▀'],
            M: ['▄▄▄', '▄▄▄', '▀ ▀'],
            N: ['▄▄▄', '▄ ▀', '▀ ▀'],
            O: ['▄▀▄', '▄ ▀', '▀▀▀'],
            P: ['▄▀▄', '▄▀ ', '▀  '],
            Q: ['▄▀▄', '▄ ▀', '▀▀▀'],
            R: ['▄▀▄', '▄▀▄', '▀ ▀'],
            S: ['▄▀▀', ' ▀▄', '▀▀▀'],
            T: ['▄▀▄', ' ▀ ', ' ▀ '],
            U: ['▄ ▄', '▄ ▀', '▀▀▀'],
            V: ['▄ ▄', '▄ ▀', ' ▀ '],
            W: ['▄ ▄', '▄▄▄', '▀ ▀'],
            X: ['▄ ▄', ' ▀ ', '▄ ▄'],
            Y: ['▄ ▄', ' ▀ ', ' ▀ '],
            Z: ['▄▀▀', ' ▀ ', '▀▀▀'],
            ' ': ['   ', '   ', '   ']
        };
    }

    getScriptFont() {
        return {
            A: ['  ╭─╮  ', ' ╱   ╲ ', '╱     ╲', '╲     ╱', ' ╲   ╱ ', '  ╰─╯  '],
            B: ['╭────╮', '│    │', '╰────╯', '│    │', '│    │', '╰────╯'],
            C: [' ╭───╮', '╱     ', '│     ', '│     ', '╲     ', ' ╰───╯'],
            D: ['╭────╮', '│    │', '│    │', '│    │', '│    │', '╰────╯'],
            E: ['╭────╮', '│     ', '╰────╮', '│     ', '│     ', '╰────╯'],
            F: ['╭────╮', '│     ', '╰────╮', '│     ', '│     ', '│     '],
            G: [' ╭───╮', '╱     ', '│  ╭─╮', '│  │ │', '╲  ╰─╯', ' ╰───╯'],
            H: ['│    │', '│    │', '╰────╯', '│    │', '│    │', '│    │'],
            I: ['╭────╮', '  │  ', '  │  ', '  │  ', '  │  ', '╰────╯'],
            J: ['╭────╮', '    │', '    │', '    │', '│  │', '╰──╯ '],
            K: ['│  ╱ ', '│ ╱  ', '│╱   ', '│╲   ', '│ ╲  ', '│  ╲ '],
            L: ['│     ', '│     ', '│     ', '│     ', '│     ', '╰────╯'],
            M: ['│╲  ╱│', '│ ╲╱ │', '│    │', '│    │', '│    │', '│    │'],
            N: ['│╲   │', '│ ╲  │', '│  ╲ │', '│   ╲│', '│    │', '│    │'],
            O: [' ╭───╮', '╱     ╲', '│     │', '│     │', '╲     ╱', ' ╰───╯'],
            P: ['╭────╮', '│    │', '╰────╯', '│     ', '│     ', '│     '],
            Q: [' ╭───╮', '╱     ╲', '│     │', '│  ╲  │', '╲  ╲  ╱', ' ╰───╯'],
            R: ['╭────╮', '│    │', '╰────╯', '│  ╲  ', '│   ╲ ', '│    ╲'],
            S: [' ╭───╮', '╱     ', '╰────╮', '     │', '     ╱', '╰────╯'],
            T: ['╭────╮', '  │  ', '  │  ', '  │  ', '  │  ', '  │  '],
            U: ['│    │', '│    │', '│    │', '│    │', '╲    ╱', ' ╰──╯ '],
            V: ['│    │', '│    │', '│    │', '╲    ╱', ' ╲  ╱ ', '  ╲╱  '],
            W: ['│    │', '│    │', '│ ╲╱ │', '│╱  ╲│', '│    │', '│    │'],
            X: ['│    │', ' ╲  ╱ ', '  ╲╱  ', '  ╱╲  ', ' ╱  ╲ ', '│    │'],
            Y: ['│    │', '│    │', ' ╲  ╱ ', '  ╲╱  ', '  ╱╲  ', '  ╱╲  '],
            Z: ['╭────╮', '    ╱', '   ╱ ', '  ╱  ', ' ╱   ', '╰────╯'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getSlantFont() {
        return {
            A: ['  /\\  ', ' /  \\ ', '/____\\', '/    \\', '/    \\', '/    \\'],
            B: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|____/'],
            C: [' /\\   ', '/  \\  ', '|    ', '|    ', '\\  / ', ' \\/  '],
            D: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|____/'],
            E: ['|____ ', '|     ', '|____ ', '|     ', '|     ', '|____ '],
            F: ['|____ ', '|     ', '|____ ', '|     ', '|     ', '|     '],
            G: [' /\\   ', '/  \\  ', '|    ', '|  /\\ ', '\\  / ', ' \\/  '],
            H: ['|    |', '|    |', '|____|', '|    |', '|    |', '|    |'],
            I: ['|____|', '  |  ', '  |  ', '  |  ', '  |  ', '|____|'],
            J: ['|____|', '    |', '    |', '    |', '|  |', ' \\/ '],
            K: ['|   / ', '|  /  ', '| /   ', '|/    ', '| \\   ', '|  \\  '],
            L: ['|     ', '|     ', '|     ', '|     ', '|     ', '|____ '],
            M: ['|\\  /|', '| \\/ |', '|    |', '|    |', '|    |', '|    |'],
            N: ['|\\   |', '| \\  |', '|  \\ |', '|   \\|', '|    |', '|    |'],
            O: [' /\\   ', '/  \\  ', '|    |', '|    |', '\\  / ', ' \\/  '],
            P: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    ', '|     '],
            Q: [' /\\   ', '/  \\  ', '|    |', '|  \\ |', '\\  \\|', ' \\/\\ '],
            R: ['|\\    ', '| \\   ', '|  \\  ', '|   \\ ', '|    \\', '|     '],
            S: [' /\\   ', '/  \\  ', ' \\   ', '  \\  ', '  /  ', ' \\/  '],
            T: ['|____|', '  |  ', '  |  ', '  |  ', '  |  ', '  |  '],
            U: ['|    |', '|    |', '|    |', '|    |', '\\  / ', ' \\/  '],
            V: ['|    |', '|    |', '|    |', ' \\  / ', '  \\/  ', '  /\\  '],
            W: ['|    |', '|    |', '| /\\ |', '|/  \\|', '|    |', '|    |'],
            X: ['|    |', ' \\  / ', '  \\/  ', '  /\\  ', ' /  \\ ', '|    |'],
            Y: ['|    |', '|    |', ' \\  / ', '  \\/  ', '  /\\  ', '  /\\  '],
            Z: ['|____|', '    / ', '   /  ', '  /   ', ' /    ', '|____|'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getSmallFont() {
        return {
            A: [' ▄ ', '▄▀▄', '▀ ▀'],
            B: ['▄▀▄', '▄▀▄', '▀▀▀'],
            C: ['▄▀▄', '▄  ', '▀▀▀'],
            D: ['▄▀▄', '▄ ▀', '▀▀▀'],
            E: ['▄▀▀', '▄▀ ', '▀▀▀'],
            F: ['▄▀▀', '▄▀ ', '▀  '],
            G: ['▄▀▄', '▄ ▀', '▀▀▀'],
            H: ['▄ ▄', '▄▀▄', '▀ ▀'],
            I: ['▄▀▄', ' ▀ ', '▄▀▄'],
            J: ['  ▄', '  ▀', '▀▀▀'],
            K: ['▄ ▀', '▄▀ ', '▀ ▀'],
            L: ['▄  ', '▄  ', '▀▀▀'],
            M: ['▄▄▄', '▄▄▄', '▀ ▀'],
            N: ['▄▄▄', '▄ ▀', '▀ ▀'],
            O: ['▄▀▄', '▄ ▀', '▀▀▀'],
            P: ['▄▀▄', '▄▀ ', '▀  '],
            Q: ['▄▀▄', '▄ ▀', '▀▀▀'],
            R: ['▄▀▄', '▄▀▄', '▀ ▀'],
            S: ['▄▀▀', ' ▀▄', '▀▀▀'],
            T: ['▄▀▄', ' ▀ ', ' ▀ '],
            U: ['▄ ▄', '▄ ▀', '▀▀▀'],
            V: ['▄ ▄', '▄ ▀', ' ▀ '],
            W: ['▄ ▄', '▄▄▄', '▀ ▀'],
            X: ['▄ ▄', ' ▀ ', '▄ ▄'],
            Y: ['▄ ▄', ' ▀ ', ' ▀ '],
            Z: ['▄▀▀', ' ▀ ', '▀▀▀'],
            ' ': ['   ', '   ', '   ']
        };
    }

    getBigFont() {
        return {
            A: ['    ██    ', '   ████   ', '  ██  ██  ', ' ██    ██ ', '██████████', '██      ██', '██      ██'],
            B: ['████████  ', '██      ██', '████████  ', '██      ██', '██      ██', '██      ██', '████████  '],
            C: ['  ███████ ', '██       ██', '██        ', '██        ', '██        ', '██       ██', '  ███████ '],
            D: ['████████  ', '██      ██', '██      ██', '██      ██', '██      ██', '██      ██', '████████  '],
            E: ['██████████', '██        ', '██        ', '████████  ', '██        ', '██        ', '██████████'],
            F: ['██████████', '██        ', '██        ', '████████  ', '██        ', '██        ', '██        '],
            G: ['  ███████ ', '██       ██', '██        ', '██   █████', '██      ██', '██       ██', '  ███████ '],
            H: ['██      ██', '██      ██', '██      ██', '██████████', '██      ██', '██      ██', '██      ██'],
            I: ['██████████', '    ██    ', '    ██    ', '    ██    ', '    ██    ', '    ██    ', '██████████'],
            J: ['██████████', '        ██', '        ██', '        ██', '██      ██', '██      ██', '  ███████ '],
            K: ['██      ██', '██    ██  ', '██  ██    ', '████      ', '██  ██    ', '██    ██  ', '██      ██'],
            L: ['██        ', '██        ', '██        ', '██        ', '██        ', '██        ', '██████████'],
            M: ['██      ██', '███    ███', '██ ██  ██ ██', '██  ████  ██', '██   ██   ██', '██        ██', '██        ██'],
            N: ['██      ██', '███     ██', '██ ██    ██', '██  ██   ██', '██   ██  ██', '██    ██ ██', '██     ████'],
            O: ['  ███████ ', '██       ██', '██       ██', '██       ██', '██       ██', '██       ██', '  ███████ '],
            P: ['████████  ', '██      ██', '██      ██', '████████  ', '██        ', '██        ', '██        '],
            Q: ['  ███████ ', '██       ██', '██       ██', '██    ██ ██', '██     ████', '██      ███', '  ████████'],
            R: ['████████  ', '██      ██', '██      ██', '████████  ', '██    ██  ', '██      ██', '██      ██'],
            S: ['  ███████ ', '██       ██', '██        ', '  ███████ ', '        ██', '██       ██', '  ███████ '],
            T: ['██████████', '    ██    ', '    ██    ', '    ██    ', '    ██    ', '    ██    ', '    ██    '],
            U: ['██      ██', '██      ██', '██      ██', '██      ██', '██      ██', '██      ██', '  ███████ '],
            V: ['██      ██', '██      ██', '██      ██', ' ██    ██ ', '  ██  ██  ', '   ████   ', '    ██    '],
            W: ['██      ██', '██      ██', '██      ██', '██  ██  ██', '██ ████ ██', '███    ███', '██      ██'],
            X: ['██      ██', ' ██    ██ ', '  ██  ██  ', '   ████   ', '  ██  ██  ', ' ██    ██ ', '██      ██'],
            Y: ['██      ██', ' ██    ██ ', '  ██  ██  ', '   ████   ', '    ██    ', '    ██    ', '    ██    '],
            Z: ['██████████', '        ██', '       ██ ', '      ██  ', '     ██   ', '    ██    ', '██████████'],
            ' ': ['          ', '          ', '          ', '          ', '          ', '          ', '          ']
        };
    }

    // New Poetry Fonts
    getElegantFont() {
        return {
            A: ['    ♠    ', '   ♠♠♠   ', '  ♠   ♠  ', ' ♠     ♠ ', '♠♠♠♠♠♠♠♠♠', '♠       ♠', '♠       ♠'],
            B: ['♠♠♠♠♠♠♠♠ ', '♠       ♠', '♠♠♠♠♠♠♠♠ ', '♠       ♠', '♠       ♠', '♠       ♠', '♠♠♠♠♠♠♠♠ '],
            C: ['  ♠♠♠♠♠♠♠', '♠        ', '♠        ', '♠        ', '♠        ', '♠        ', '  ♠♠♠♠♠♠♠'],
            D: ['♠♠♠♠♠♠♠♠ ', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠♠♠♠♠♠♠♠ '],
            E: ['♠♠♠♠♠♠♠♠♠', '♠        ', '♠        ', '♠♠♠♠♠♠♠♠ ', '♠        ', '♠        ', '♠♠♠♠♠♠♠♠♠'],
            F: ['♠♠♠♠♠♠♠♠♠', '♠        ', '♠        ', '♠♠♠♠♠♠♠♠ ', '♠        ', '♠        ', '♠        '],
            G: ['  ♠♠♠♠♠♠♠', '♠        ', '♠        ', '♠   ♠♠♠♠♠', '♠       ♠', '♠       ♠', '  ♠♠♠♠♠♠♠'],
            H: ['♠       ♠', '♠       ♠', '♠       ♠', '♠♠♠♠♠♠♠♠♠', '♠       ♠', '♠       ♠', '♠       ♠'],
            I: ['♠♠♠♠♠♠♠♠♠', '    ♠    ', '    ♠    ', '    ♠    ', '    ♠    ', '    ♠    ', '♠♠♠♠♠♠♠♠♠'],
            J: ['♠♠♠♠♠♠♠♠♠', '        ♠', '        ♠', '        ♠', '♠       ♠', '♠       ♠', '  ♠♠♠♠♠♠♠'],
            K: ['♠      ♠', '♠     ♠ ', '♠    ♠  ', '♠   ♠   ', '♠  ♠    ', '♠ ♠     ', '♠♠      '],
            L: ['♠        ', '♠        ', '♠        ', '♠        ', '♠        ', '♠        ', '♠♠♠♠♠♠♠♠♠'],
            M: ['♠       ♠', '♠♠     ♠♠', '♠ ♠   ♠ ♠', '♠  ♠ ♠  ♠', '♠   ♠   ♠', '♠       ♠', '♠       ♠'],
            N: ['♠       ♠', '♠♠      ♠', '♠ ♠     ♠', '♠  ♠    ♠', '♠   ♠   ♠', '♠    ♠  ♠', '♠     ♠♠♠'],
            O: ['  ♠♠♠♠♠♠♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '  ♠♠♠♠♠♠♠'],
            P: ['♠♠♠♠♠♠♠♠ ', '♠       ♠', '♠       ♠', '♠♠♠♠♠♠♠♠ ', '♠        ', '♠        ', '♠        '],
            Q: ['  ♠♠♠♠♠♠♠', '♠       ♠', '♠       ♠', '♠    ♠  ♠', '♠     ♠ ♠', '♠      ♠♠', '  ♠♠♠♠♠♠♠'],
            R: ['♠♠♠♠♠♠♠♠ ', '♠       ♠', '♠       ♠', '♠♠♠♠♠♠♠♠ ', '♠  ♠     ', '♠   ♠    ', '♠    ♠   '],
            S: ['  ♠♠♠♠♠♠♠', '♠        ', '♠        ', '  ♠♠♠♠♠♠♠', '        ♠', '        ♠', '  ♠♠♠♠♠♠♠'],
            T: ['♠♠♠♠♠♠♠♠♠', '    ♠    ', '    ♠    ', '    ♠    ', '    ♠    ', '    ♠    ', '    ♠    '],
            U: ['♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '♠       ♠', '  ♠♠♠♠♠♠♠'],
            V: ['♠       ♠', '♠       ♠', ' ♠     ♠ ', '  ♠   ♠  ', '   ♠ ♠   ', '    ♠    ', '    ♠    '],
            W: ['♠       ♠', '♠       ♠', '♠   ♠   ♠', '♠  ♠ ♠  ♠', '♠ ♠   ♠ ♠', '♠♠     ♠♠', '♠       ♠'],
            X: ['♠       ♠', ' ♠     ♠ ', '  ♠   ♠  ', '   ♠ ♠   ', '  ♠   ♠  ', ' ♠     ♠ ', '♠       ♠'],
            Y: ['♠       ♠', ' ♠     ♠ ', '  ♠   ♠  ', '   ♠ ♠   ', '    ♠    ', '    ♠    ', '    ♠    '],
            Z: ['♠♠♠♠♠♠♠♠♠', '       ♠ ', '      ♠  ', '     ♠   ', '    ♠    ', '   ♠     ', '♠♠♠♠♠♠♠♠♠'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getRomanticFont() {
        return {
            A: ['    ♥    ', '   ♥♥♥   ', '  ♥   ♥  ', ' ♥     ♥ ', '♥♥♥♥♥♥♥♥♥', '♥       ♥', '♥       ♥'],
            B: ['♥♥♥♥♥♥♥♥ ', '♥       ♥', '♥♥♥♥♥♥♥♥ ', '♥       ♥', '♥       ♥', '♥       ♥', '♥♥♥♥♥♥♥♥ '],
            C: ['  ♥♥♥♥♥♥♥', '♥        ', '♥        ', '♥        ', '♥        ', '♥        ', '  ♥♥♥♥♥♥♥'],
            D: ['♥♥♥♥♥♥♥♥ ', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥♥♥♥♥♥♥♥ '],
            E: ['♥♥♥♥♥♥♥♥♥', '♥        ', '♥        ', '♥♥♥♥♥♥♥♥ ', '♥        ', '♥        ', '♥♥♥♥♥♥♥♥♥'],
            F: ['♥♥♥♥♥♥♥♥♥', '♥        ', '♥        ', '♥♥♥♥♥♥♥♥ ', '♥        ', '♥        ', '♥        '],
            G: ['  ♥♥♥♥♥♥♥', '♥        ', '♥        ', '♥   ♥♥♥♥♥', '♥       ♥', '♥       ♥', '  ♥♥♥♥♥♥♥'],
            H: ['♥       ♥', '♥       ♥', '♥       ♥', '♥♥♥♥♥♥♥♥♥', '♥       ♥', '♥       ♥', '♥       ♥'],
            I: ['♥♥♥♥♥♥♥♥♥', '    ♥    ', '    ♥    ', '    ♥    ', '    ♥    ', '    ♥    ', '♥♥♥♥♥♥♥♥♥'],
            J: ['♥♥♥♥♥♥♥♥♥', '        ♥', '        ♥', '        ♥', '♥       ♥', '♥       ♥', '  ♥♥♥♥♥♥♥'],
            K: ['♥      ♥', '♥     ♥ ', '♥    ♥  ', '♥   ♥   ', '♥  ♥    ', '♥ ♥     ', '♥♥      '],
            L: ['♥        ', '♥        ', '♥        ', '♥        ', '♥        ', '♥        ', '♥♥♥♥♥♥♥♥♥'],
            M: ['♥       ♥', '♥♥     ♥♥', '♥ ♥   ♥ ♥', '♥  ♥ ♥  ♥', '♥   ♥   ♥', '♥       ♥', '♥       ♥'],
            N: ['♥       ♥', '♥♥      ♥', '♥ ♥     ♥', '♥  ♥    ♥', '♥   ♥   ♥', '♥    ♥  ♥', '♥     ♥♥♥'],
            O: ['  ♥♥♥♥♥♥♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '  ♥♥♥♥♥♥♥'],
            P: ['♥♥♥♥♥♥♥♥ ', '♥       ♥', '♥       ♥', '♥♥♥♥♥♥♥♥ ', '♥        ', '♥        ', '♥        '],
            Q: ['  ♥♥♥♥♥♥♥', '♥       ♥', '♥       ♥', '♥    ♥  ♥', '♥     ♥ ♥', '♥      ♥♥', '  ♥♥♥♥♥♥♥'],
            R: ['♥♥♥♥♥♥♥♥ ', '♥       ♥', '♥       ♥', '♥♥♥♥♥♥♥♥ ', '♥  ♥     ', '♥   ♥    ', '♥    ♥   '],
            S: ['  ♥♥♥♥♥♥♥', '♥        ', '♥        ', '  ♥♥♥♥♥♥♥', '        ♥', '        ♥', '  ♥♥♥♥♥♥♥'],
            T: ['♥♥♥♥♥♥♥♥♥', '    ♥    ', '    ♥    ', '    ♥    ', '    ♥    ', '    ♥    ', '    ♥    '],
            U: ['♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '♥       ♥', '  ♥♥♥♥♥♥♥'],
            V: ['♥       ♥', '♥       ♥', ' ♥     ♥ ', '  ♥   ♥  ', '   ♥ ♥   ', '    ♥    ', '    ♥    '],
            W: ['♥       ♥', '♥       ♥', '♥   ♥   ♥', '♥  ♥ ♥  ♥', '♥ ♥   ♥ ♥', '♥♥     ♥♥', '♥       ♥'],
            X: ['♥       ♥', ' ♥     ♥ ', '  ♥   ♥  ', '   ♥ ♥   ', '  ♥   ♥  ', ' ♥     ♥ ', '♥       ♥'],
            Y: ['♥       ♥', ' ♥     ♥ ', '  ♥   ♥  ', '   ♥ ♥   ', '    ♥    ', '    ♥    ', '    ♥    '],
            Z: ['♥♥♥♥♥♥♥♥♥', '       ♥ ', '      ♥  ', '     ♥   ', '    ♥    ', '   ♥     ', '♥♥♥♥♥♥♥♥♥'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getClassicFont() {
        return {
            A: ['    █    ', '   ███   ', '  █   █  ', ' █     █ ', '█████████', '█       █', '█       █'],
            B: ['████████ ', '█       █', '████████ ', '█       █', '█       █', '█       █', '████████ '],
            C: ['  ███████', '█        ', '█        ', '█        ', '█        ', '█        ', '  ███████'],
            D: ['████████ ', '█       █', '█       █', '█       █', '█       █', '█       █', '████████ '],
            E: ['█████████', '█        ', '█        ', '████████ ', '█        ', '█        ', '█████████'],
            F: ['█████████', '█        ', '█        ', '████████ ', '█        ', '█        ', '█        '],
            G: ['  ███████', '█        ', '█        ', '█   █████', '█       █', '█       █', '  ███████'],
            H: ['█       █', '█       █', '█       █', '█████████', '█       █', '█       █', '█       █'],
            I: ['█████████', '    █    ', '    █    ', '    █    ', '    █    ', '    █    ', '█████████'],
            J: ['█████████', '        █', '        █', '        █', '█       █', '█       █', '  ███████'],
            K: ['█      █', '█     █ ', '█    █  ', '█   █   ', '█  █    ', '█ █     ', '██      '],
            L: ['█        ', '█        ', '█        ', '█        ', '█        ', '█        ', '█████████'],
            M: ['█       █', '██     ██', '█ █   █ █', '█  █ █  █', '█   █   █', '█       █', '█       █'],
            N: ['█       █', '██      █', '█ █     █', '█  █    █', '█   █   █', '█    █  █', '█     ███'],
            O: ['  ███████', '█       █', '█       █', '█       █', '█       █', '█       █', '  ███████'],
            P: ['████████ ', '█       █', '█       █', '████████ ', '█        ', '█        ', '█        '],
            Q: ['  ███████', '█       █', '█       █', '█    █  █', '█     █ █', '█      ██', '  ███████'],
            R: ['████████ ', '█       █', '█       █', '████████ ', '█  █     ', '█   █    ', '█    █   '],
            S: ['  ███████', '█        ', '█        ', '  ███████', '        █', '        █', '  ███████'],
            T: ['█████████', '    █    ', '    █    ', '    █    ', '    █    ', '    █    ', '    █    '],
            U: ['█       █', '█       █', '█       █', '█       █', '█       █', '█       █', '  ███████'],
            V: ['█       █', '█       █', ' █     █ ', '  █   █  ', '   █ █   ', '    █    ', '    █    '],
            W: ['█       █', '█       █', '█   █   █', '█  █ █  █', '█ █   █ █', '██     ██', '█       █'],
            X: ['█       █', ' █     █ ', '  █   █  ', '   █ █   ', '  █   █  ', ' █     █ ', '█       █'],
            Y: ['█       █', ' █     █ ', '  █   █  ', '   █ █   ', '    █    ', '    █    ', '    █    '],
            Z: ['█████████', '       █ ', '      █  ', '     █   ', '    █    ', '   █     ', '█████████'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getModernFont() {
        return {
            A: ['    ▲    ', '   ▲▲▲   ', '  ▲   ▲  ', ' ▲     ▲ ', '▲▲▲▲▲▲▲▲▲', '▲       ▲', '▲       ▲'],
            B: ['▲▲▲▲▲▲▲▲ ', '▲       ▲', '▲▲▲▲▲▲▲▲ ', '▲       ▲', '▲       ▲', '▲       ▲', '▲▲▲▲▲▲▲▲ '],
            C: ['  ▲▲▲▲▲▲▲', '▲        ', '▲        ', '▲        ', '▲        ', '▲        ', '  ▲▲▲▲▲▲▲'],
            D: ['▲▲▲▲▲▲▲▲ ', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲▲▲▲▲▲▲▲ '],
            E: ['▲▲▲▲▲▲▲▲▲', '▲        ', '▲        ', '▲▲▲▲▲▲▲▲ ', '▲        ', '▲        ', '▲▲▲▲▲▲▲▲▲'],
            F: ['▲▲▲▲▲▲▲▲▲', '▲        ', '▲        ', '▲▲▲▲▲▲▲▲ ', '▲        ', '▲        ', '▲        '],
            G: ['  ▲▲▲▲▲▲▲', '▲        ', '▲        ', '▲   ▲▲▲▲▲', '▲       ▲', '▲       ▲', '  ▲▲▲▲▲▲▲'],
            H: ['▲       ▲', '▲       ▲', '▲       ▲', '▲▲▲▲▲▲▲▲▲', '▲       ▲', '▲       ▲', '▲       ▲'],
            I: ['▲▲▲▲▲▲▲▲▲', '    ▲    ', '    ▲    ', '    ▲    ', '    ▲    ', '    ▲    ', '▲▲▲▲▲▲▲▲▲'],
            J: ['▲▲▲▲▲▲▲▲▲', '        ▲', '        ▲', '        ▲', '▲       ▲', '▲       ▲', '  ▲▲▲▲▲▲▲'],
            K: ['▲      ▲', '▲     ▲ ', '▲    ▲  ', '▲   ▲   ', '▲  ▲    ', '▲ ▲     ', '▲▲      '],
            L: ['▲        ', '▲        ', '▲        ', '▲        ', '▲        ', '▲        ', '▲▲▲▲▲▲▲▲▲'],
            M: ['▲       ▲', '▲▲     ▲▲', '▲ ▲   ▲ ▲', '▲  ▲ ▲  ▲', '▲   ▲   ▲', '▲       ▲', '▲       ▲'],
            N: ['▲       ▲', '▲▲      ▲', '▲ ▲     ▲', '▲  ▲    ▲', '▲   ▲   ▲', '▲    ▲  ▲', '▲     ▲▲▲'],
            O: ['  ▲▲▲▲▲▲▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '  ▲▲▲▲▲▲▲'],
            P: ['▲▲▲▲▲▲▲▲ ', '▲       ▲', '▲       ▲', '▲▲▲▲▲▲▲▲ ', '▲        ', '▲        ', '▲        '],
            Q: ['  ▲▲▲▲▲▲▲', '▲       ▲', '▲       ▲', '▲    ▲  ▲', '▲     ▲ ▲', '▲      ▲▲', '  ▲▲▲▲▲▲▲'],
            R: ['▲▲▲▲▲▲▲▲ ', '▲       ▲', '▲       ▲', '▲▲▲▲▲▲▲▲ ', '▲  ▲     ', '▲   ▲    ', '▲    ▲   '],
            S: ['  ▲▲▲▲▲▲▲', '▲        ', '▲        ', '  ▲▲▲▲▲▲▲', '        ▲', '        ▲', '  ▲▲▲▲▲▲▲'],
            T: ['▲▲▲▲▲▲▲▲▲', '    ▲    ', '    ▲    ', '    ▲    ', '    ▲    ', '    ▲    ', '    ▲    '],
            U: ['▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '▲       ▲', '  ▲▲▲▲▲▲▲'],
            V: ['▲       ▲', '▲       ▲', ' ▲     ▲ ', '  ▲   ▲  ', '   ▲ ▲   ', '    ▲    ', '    ▲    '],
            W: ['▲       ▲', '▲       ▲', '▲   ▲   ▲', '▲  ▲ ▲  ▲', '▲ ▲   ▲ ▲', '▲▲     ▲▲', '▲       ▲'],
            X: ['▲       ▲', ' ▲     ▲ ', '  ▲   ▲  ', '   ▲ ▲   ', '  ▲   ▲  ', ' ▲     ▲ ', '▲       ▲'],
            Y: ['▲       ▲', ' ▲     ▲ ', '  ▲   ▲  ', '   ▲ ▲   ', '    ▲    ', '    ▲    ', '    ▲    '],
            Z: ['▲▲▲▲▲▲▲▲▲', '       ▲ ', '      ▲  ', '     ▲   ', '    ▲    ', '   ▲     ', '▲▲▲▲▲▲▲▲▲'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getCalligraphyFont() {
        return {
            A: ['    ╔    ', '   ╔╗╔   ', '  ╔   ╗  ', ' ╔     ╗ ', '╔╗╗╗╗╗╗╗╗', '╔       ╗', '╔       ╗'],
            B: ['╔╗╗╗╗╗╗╗ ', '╔       ╗', '╔╗╗╗╗╗╗╗ ', '╔       ╗', '╔       ╗', '╔       ╗', '╔╗╗╗╗╗╗╗ '],
            C: ['  ╔╗╗╗╗╗╗', '╔        ', '╔        ', '╔        ', '╔        ', '╔        ', '  ╔╗╗╗╗╗╗'],
            D: ['╔╗╗╗╗╗╗╗ ', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔╗╗╗╗╗╗╗ '],
            E: ['╔╗╗╗╗╗╗╗╗', '╔        ', '╔        ', '╔╗╗╗╗╗╗╗ ', '╔        ', '╔        ', '╔╗╗╗╗╗╗╗╗'],
            F: ['╔╗╗╗╗╗╗╗╗', '╔        ', '╔        ', '╔╗╗╗╗╗╗╗ ', '╔        ', '╔        ', '╔        '],
            G: ['  ╔╗╗╗╗╗╗', '╔        ', '╔        ', '╔   ╔╗╗╗╗', '╔       ╗', '╔       ╗', '  ╔╗╗╗╗╗╗'],
            H: ['╔       ╗', '╔       ╗', '╔       ╗', '╔╗╗╗╗╗╗╗╗', '╔       ╗', '╔       ╗', '╔       ╗'],
            I: ['╔╗╗╗╗╗╗╗╗', '    ╔    ', '    ╔    ', '    ╔    ', '    ╔    ', '    ╔    ', '╔╗╗╗╗╗╗╗╗'],
            J: ['╔╗╗╗╗╗╗╗╗', '        ╗', '        ╗', '        ╗', '╔       ╗', '╔       ╗', '  ╔╗╗╗╗╗╗'],
            K: ['╔      ╗', '╔     ╗ ', '╔    ╗  ', '╔   ╗   ', '╔  ╗    ', '╔ ╗     ', '╔╗      '],
            L: ['╔        ', '╔        ', '╔        ', '╔        ', '╔        ', '╔        ', '╔╗╗╗╗╗╗╗╗'],
            M: ['╔       ╗', '╔╗     ╔╗', '╔ ╗   ╗ ╗', '╔  ╗ ╗  ╗', '╔   ╗   ╗', '╔       ╗', '╔       ╗'],
            N: ['╔       ╗', '╔╗      ╗', '╔ ╗     ╗', '╔  ╗    ╗', '╔   ╗   ╗', '╔    ╗  ╗', '╔     ╗╗╗'],
            O: ['  ╔╗╗╗╗╗╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '  ╔╗╗╗╗╗╗'],
            P: ['╔╗╗╗╗╗╗╗ ', '╔       ╗', '╔       ╗', '╔╗╗╗╗╗╗╗ ', '╔        ', '╔        ', '╔        '],
            Q: ['  ╔╗╗╗╗╗╗', '╔       ╗', '╔       ╗', '╔    ╗  ╗', '╔     ╗ ╗', '╔      ╗╗', '  ╔╗╗╗╗╗╗'],
            R: ['╔╗╗╗╗╗╗╗ ', '╔       ╗', '╔       ╗', '╔╗╗╗╗╗╗╗ ', '╔  ╗     ', '╔   ╗    ', '╔    ╗   '],
            S: ['  ╔╗╗╗╗╗╗', '╔        ', '╔        ', '  ╔╗╗╗╗╗╗', '        ╗', '        ╗', '  ╔╗╗╗╗╗╗'],
            T: ['╔╗╗╗╗╗╗╗╗', '    ╔    ', '    ╔    ', '    ╔    ', '    ╔    ', '    ╔    ', '    ╔    '],
            U: ['╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '╔       ╗', '  ╔╗╗╗╗╗╗'],
            V: ['╔       ╗', '╔       ╗', ' ╔     ╗ ', '  ╔   ╗  ', '   ╔ ╗   ', '    ╔    ', '    ╔    '],
            W: ['╔       ╗', '╔       ╗', '╔   ╔   ╗', '╔  ╔ ╗  ╗', '╔ ╔   ╗ ╗', '╔╗     ╔╗', '╔       ╗'],
            X: ['╔       ╗', ' ╔     ╗ ', '  ╔   ╗  ', '   ╔ ╗   ', '  ╔   ╗  ', ' ╔     ╗ ', '╔       ╗'],
            Y: ['╔       ╗', ' ╔     ╗ ', '  ╔   ╗  ', '   ╔ ╗   ', '    ╔    ', '    ╔    ', '    ╔    '],
            Z: ['╔╗╗╗╗╗╗╗╗', '       ╗ ', '      ╗  ', '     ╗   ', '    ╗    ', '   ╗     ', '╔╗╗╗╗╗╗╗╗'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getGothicFont() {
        return {
            A: ['    ░    ', '   ░░░   ', '  ░   ░  ', ' ░     ░ ', '░░░░░░░░░', '░       ░', '░       ░'],
            B: ['░░░░░░░░ ', '░       ░', '░░░░░░░░ ', '░       ░', '░       ░', '░       ░', '░░░░░░░░ '],
            C: ['  ░░░░░░░', '░        ', '░        ', '░        ', '░        ', '░        ', '  ░░░░░░░'],
            D: ['░░░░░░░░ ', '░       ░', '░       ░', '░       ░', '░       ░', '░       ░', '░░░░░░░░ '],
            E: ['░░░░░░░░░', '░        ', '░        ', '░░░░░░░░ ', '░        ', '░        ', '░░░░░░░░░'],
            F: ['░░░░░░░░░', '░        ', '░        ', '░░░░░░░░ ', '░        ', '░        ', '░        '],
            G: ['  ░░░░░░░', '░        ', '░        ', '░   ░░░░░', '░       ░', '░       ░', '  ░░░░░░░'],
            H: ['░       ░', '░       ░', '░       ░', '░░░░░░░░░', '░       ░', '░       ░', '░       ░'],
            I: ['░░░░░░░░░', '    ░    ', '    ░    ', '    ░    ', '    ░    ', '    ░    ', '░░░░░░░░░'],
            J: ['░░░░░░░░░', '        ░', '        ░', '        ░', '░       ░', '░       ░', '  ░░░░░░░'],
            K: ['░      ░', '░     ░ ', '░    ░  ', '░   ░   ', '░  ░    ', '░ ░     ', '░░      '],
            L: ['░        ', '░        ', '░        ', '░        ', '░        ', '░        ', '░░░░░░░░░'],
            M: ['░       ░', '░░     ░░', '░ ░   ░ ░', '░  ░ ░  ░', '░   ░   ░', '░       ░', '░       ░'],
            N: ['░       ░', '░░      ░', '░ ░     ░', '░  ░    ░', '░   ░   ░', '░    ░  ░', '░     ░░░'],
            O: ['  ░░░░░░░', '░       ░', '░       ░', '░       ░', '░       ░', '░       ░', '  ░░░░░░░'],
            P: ['░░░░░░░░ ', '░       ░', '░       ░', '░░░░░░░░ ', '░        ', '░        ', '░        '],
            Q: ['  ░░░░░░░', '░       ░', '░       ░', '░    ░  ░', '░     ░ ░', '░      ░░', '  ░░░░░░░'],
            R: ['░░░░░░░░ ', '░       ░', '░       ░', '░░░░░░░░ ', '░  ░     ', '░   ░    ', '░    ░   '],
            S: ['  ░░░░░░░', '░        ', '░        ', '  ░░░░░░░', '        ░', '        ░', '  ░░░░░░░'],
            T: ['░░░░░░░░░', '    ░    ', '    ░    ', '    ░    ', '    ░    ', '    ░    ', '    ░    '],
            U: ['░       ░', '░       ░', '░       ░', '░       ░', '░       ░', '░       ░', '  ░░░░░░░'],
            V: ['░       ░', '░       ░', ' ░     ░ ', '  ░   ░  ', '   ░ ░   ', '    ░    ', '    ░    '],
            W: ['░       ░', '░       ░', '░   ░   ░', '░  ░ ░  ░', '░ ░   ░ ░', '░░     ░░', '░       ░'],
            X: ['░       ░', ' ░     ░ ', '  ░   ░  ', '   ░ ░   ', '  ░   ░  ', ' ░     ░ ', '░       ░'],
            Y: ['░       ░', ' ░     ░ ', '  ░   ░  ', '   ░ ░   ', '    ░    ', '    ░    ', '    ░    '],
            Z: ['░░░░░░░░░', '       ░ ', '      ░  ', '     ░   ', '    ░    ', '   ░     ', '░░░░░░░░░'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getSerifFont() {
        return {
            A: ['    █    ', '   ███   ', '  █   █  ', ' █     █ ', '█████████', '█       █', '█       █'],
            B: ['████████ ', '█       █', '████████ ', '█       █', '█       █', '█       █', '████████ '],
            C: ['  ███████', '█        ', '█        ', '█        ', '█        ', '█        ', '  ███████'],
            D: ['████████ ', '█       █', '█       █', '█       █', '█       █', '█       █', '████████ '],
            E: ['█████████', '█        ', '█        ', '████████ ', '█        ', '█        ', '█████████'],
            F: ['█████████', '█        ', '█        ', '████████ ', '█        ', '█        ', '█        '],
            G: ['  ███████', '█        ', '█        ', '█   █████', '█       █', '█       █', '  ███████'],
            H: ['█       █', '█       █', '█       █', '█████████', '█       █', '█       █', '█       █'],
            I: ['█████████', '    █    ', '    █    ', '    █    ', '    █    ', '    █    ', '█████████'],
            J: ['█████████', '        █', '        █', '        █', '█       █', '█       █', '  ███████'],
            K: ['█      █', '█     █ ', '█    █  ', '█   █   ', '█  █    ', '█ █     ', '██      '],
            L: ['█        ', '█        ', '█        ', '█        ', '█        ', '█        ', '█████████'],
            M: ['█       █', '██     ██', '█ █   █ █', '█  █ █  █', '█   █   █', '█       █', '█       █'],
            N: ['█       █', '██      █', '█ █     █', '█  █    █', '█   █   █', '█    █  █', '█     ███'],
            O: ['  ███████', '█       █', '█       █', '█       █', '█       █', '█       █', '  ███████'],
            P: ['████████ ', '█       █', '█       █', '████████ ', '█        ', '█        ', '█        '],
            Q: ['  ███████', '█       █', '█       █', '█    █  █', '█     █ █', '█      ██', '  ███████'],
            R: ['████████ ', '█       █', '█       █', '████████ ', '█  █     ', '█   █    ', '█    █   '],
            S: ['  ███████', '█        ', '█        ', '  ███████', '        █', '        █', '  ███████'],
            T: ['█████████', '    █    ', '    █    ', '    █    ', '    █    ', '    █    ', '    █    '],
            U: ['█       █', '█       █', '█       █', '█       █', '█       █', '█       █', '  ███████'],
            V: ['█       █', '█       █', ' █     █ ', '  █   █  ', '   █ █   ', '    █    ', '    █    '],
            W: ['█       █', '█       █', '█   █   █', '█  █ █  █', '█ █   █ █', '██     ██', '█       █'],
            X: ['█       █', ' █     █ ', '  █   █  ', '   █ █   ', '  █   █  ', ' █     █ ', '█       █'],
            Y: ['█       █', ' █     █ ', '  █   █  ', '   █ █   ', '    █    ', '    █    ', '    █    '],
            Z: ['█████████', '       █ ', '      █  ', '     █   ', '    █    ', '   █     ', '█████████'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getSansFont() {
        return {
            A: ['    ▄    ', '   ▄▄▄   ', '  ▄   ▄  ', ' ▄     ▄ ', '▄▄▄▄▄▄▄▄▄', '▄       ▄', '▄       ▄'],
            B: ['▄▄▄▄▄▄▄▄ ', '▄       ▄', '▄▄▄▄▄▄▄▄ ', '▄       ▄', '▄       ▄', '▄       ▄', '▄▄▄▄▄▄▄▄ '],
            C: ['  ▄▄▄▄▄▄▄', '▄        ', '▄        ', '▄        ', '▄        ', '▄        ', '  ▄▄▄▄▄▄▄'],
            D: ['▄▄▄▄▄▄▄▄ ', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄▄▄▄▄▄▄▄ '],
            E: ['▄▄▄▄▄▄▄▄▄', '▄        ', '▄        ', '▄▄▄▄▄▄▄▄ ', '▄        ', '▄        ', '▄▄▄▄▄▄▄▄▄'],
            F: ['▄▄▄▄▄▄▄▄▄', '▄        ', '▄        ', '▄▄▄▄▄▄▄▄ ', '▄        ', '▄        ', '▄        '],
            G: ['  ▄▄▄▄▄▄▄', '▄        ', '▄        ', '▄   ▄▄▄▄▄', '▄       ▄', '▄       ▄', '  ▄▄▄▄▄▄▄'],
            H: ['▄       ▄', '▄       ▄', '▄       ▄', '▄▄▄▄▄▄▄▄▄', '▄       ▄', '▄       ▄', '▄       ▄'],
            I: ['▄▄▄▄▄▄▄▄▄', '    ▄    ', '    ▄    ', '    ▄    ', '    ▄    ', '    ▄    ', '▄▄▄▄▄▄▄▄▄'],
            J: ['▄▄▄▄▄▄▄▄▄', '        ▄', '        ▄', '        ▄', '▄       ▄', '▄       ▄', '  ▄▄▄▄▄▄▄'],
            K: ['▄      ▄', '▄     ▄ ', '▄    ▄  ', '▄   ▄   ', '▄  ▄    ', '▄ ▄     ', '▄▄      '],
            L: ['▄        ', '▄        ', '▄        ', '▄        ', '▄        ', '▄        ', '▄▄▄▄▄▄▄▄▄'],
            M: ['▄       ▄', '▄▄     ▄▄', '▄ ▄   ▄ ▄', '▄  ▄ ▄  ▄', '▄   ▄   ▄', '▄       ▄', '▄       ▄'],
            N: ['▄       ▄', '▄▄      ▄', '▄ ▄     ▄', '▄  ▄    ▄', '▄   ▄   ▄', '▄    ▄  ▄', '▄     ▄▄▄'],
            O: ['  ▄▄▄▄▄▄▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '  ▄▄▄▄▄▄▄'],
            P: ['▄▄▄▄▄▄▄▄ ', '▄       ▄', '▄       ▄', '▄▄▄▄▄▄▄▄ ', '▄        ', '▄        ', '▄        '],
            Q: ['  ▄▄▄▄▄▄▄', '▄       ▄', '▄       ▄', '▄    ▄  ▄', '▄     ▄ ▄', '▄      ▄▄', '  ▄▄▄▄▄▄▄'],
            R: ['▄▄▄▄▄▄▄▄ ', '▄       ▄', '▄       ▄', '▄▄▄▄▄▄▄▄ ', '▄  ▄     ', '▄   ▄    ', '▄    ▄   '],
            S: ['  ▄▄▄▄▄▄▄', '▄        ', '▄        ', '  ▄▄▄▄▄▄▄', '        ▄', '        ▄', '  ▄▄▄▄▄▄▄'],
            T: ['▄▄▄▄▄▄▄▄▄', '    ▄    ', '    ▄    ', '    ▄    ', '    ▄    ', '    ▄    ', '    ▄    '],
            U: ['▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '▄       ▄', '  ▄▄▄▄▄▄▄'],
            V: ['▄       ▄', '▄       ▄', ' ▄     ▄ ', '  ▄   ▄  ', '   ▄ ▄   ', '    ▄    ', '    ▄    '],
            W: ['▄       ▄', '▄       ▄', '▄   ▄   ▄', '▄  ▄ ▄  ▄', '▄ ▄   ▄ ▄', '▄▄     ▄▄', '▄       ▄'],
            X: ['▄       ▄', ' ▄     ▄ ', '  ▄   ▄  ', '   ▄ ▄   ', '  ▄   ▄  ', ' ▄     ▄ ', '▄       ▄'],
            Y: ['▄       ▄', ' ▄     ▄ ', '  ▄   ▄  ', '   ▄ ▄   ', '    ▄    ', '    ▄    ', '    ▄    '],
            Z: ['▄▄▄▄▄▄▄▄▄', '       ▄ ', '      ▄  ', '     ▄   ', '    ▄    ', '   ▄     ', '▄▄▄▄▄▄▄▄▄'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getDecorativeFont() {
        return {
            A: ['    ◊    ', '   ◊◊◊   ', '  ◊   ◊  ', ' ◊     ◊ ', '◊◊◊◊◊◊◊◊◊', '◊       ◊', '◊       ◊'],
            B: ['◊◊◊◊◊◊◊◊ ', '◊       ◊', '◊◊◊◊◊◊◊◊ ', '◊       ◊', '◊       ◊', '◊       ◊', '◊◊◊◊◊◊◊◊ '],
            C: ['  ◊◊◊◊◊◊◊', '◊        ', '◊        ', '◊        ', '◊        ', '◊        ', '  ◊◊◊◊◊◊◊'],
            D: ['◊◊◊◊◊◊◊◊ ', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊◊◊◊◊◊◊◊ '],
            E: ['◊◊◊◊◊◊◊◊◊', '◊        ', '◊        ', '◊◊◊◊◊◊◊◊ ', '◊        ', '◊        ', '◊◊◊◊◊◊◊◊◊'],
            F: ['◊◊◊◊◊◊◊◊◊', '◊        ', '◊        ', '◊◊◊◊◊◊◊◊ ', '◊        ', '◊        ', '◊        '],
            G: ['  ◊◊◊◊◊◊◊', '◊        ', '◊        ', '◊   ◊◊◊◊◊', '◊       ◊', '◊       ◊', '  ◊◊◊◊◊◊◊'],
            H: ['◊       ◊', '◊       ◊', '◊       ◊', '◊◊◊◊◊◊◊◊◊', '◊       ◊', '◊       ◊', '◊       ◊'],
            I: ['◊◊◊◊◊◊◊◊◊', '    ◊    ', '    ◊    ', '    ◊    ', '    ◊    ', '    ◊    ', '◊◊◊◊◊◊◊◊◊'],
            J: ['◊◊◊◊◊◊◊◊◊', '        ◊', '        ◊', '        ◊', '◊       ◊', '◊       ◊', '  ◊◊◊◊◊◊◊'],
            K: ['◊      ◊', '◊     ◊ ', '◊    ◊  ', '◊   ◊   ', '◊  ◊    ', '◊ ◊     ', '◊◊      '],
            L: ['◊        ', '◊        ', '◊        ', '◊        ', '◊        ', '◊        ', '◊◊◊◊◊◊◊◊◊'],
            M: ['◊       ◊', '◊◊     ◊◊', '◊ ◊   ◊ ◊', '◊  ◊ ◊  ◊', '◊   ◊   ◊', '◊       ◊', '◊       ◊'],
            N: ['◊       ◊', '◊◊      ◊', '◊ ◊     ◊', '◊  ◊    ◊', '◊   ◊   ◊', '◊    ◊  ◊', '◊     ◊◊◊'],
            O: ['  ◊◊◊◊◊◊◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '  ◊◊◊◊◊◊◊'],
            P: ['◊◊◊◊◊◊◊◊ ', '◊       ◊', '◊       ◊', '◊◊◊◊◊◊◊◊ ', '◊        ', '◊        ', '◊        '],
            Q: ['  ◊◊◊◊◊◊◊', '◊       ◊', '◊       ◊', '◊    ◊  ◊', '◊     ◊ ◊', '◊      ◊◊', '  ◊◊◊◊◊◊◊'],
            R: ['◊◊◊◊◊◊◊◊ ', '◊       ◊', '◊       ◊', '◊◊◊◊◊◊◊◊ ', '◊  ◊     ', '◊   ◊    ', '◊    ◊   '],
            S: ['  ◊◊◊◊◊◊◊', '◊        ', '◊        ', '  ◊◊◊◊◊◊◊', '        ◊', '        ◊', '  ◊◊◊◊◊◊◊'],
            T: ['◊◊◊◊◊◊◊◊◊', '    ◊    ', '    ◊    ', '    ◊    ', '    ◊    ', '    ◊    ', '    ◊    '],
            U: ['◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '◊       ◊', '  ◊◊◊◊◊◊◊'],
            V: ['◊       ◊', '◊       ◊', ' ◊     ◊ ', '  ◊   ◊  ', '   ◊ ◊   ', '    ◊    ', '    ◊    '],
            W: ['◊       ◊', '◊       ◊', '◊   ◊   ◊', '◊  ◊ ◊  ◊', '◊ ◊   ◊ ◊', '◊◊     ◊◊', '◊       ◊'],
            X: ['◊       ◊', ' ◊     ◊ ', '  ◊   ◊  ', '   ◊ ◊   ', '  ◊   ◊  ', ' ◊     ◊ ', '◊       ◊'],
            Y: ['◊       ◊', ' ◊     ◊ ', '  ◊   ◊  ', '   ◊ ◊   ', '    ◊    ', '    ◊    ', '    ◊    '],
            Z: ['◊◊◊◊◊◊◊◊◊', '       ◊ ', '      ◊  ', '     ◊   ', '    ◊    ', '   ◊     ', '◊◊◊◊◊◊◊◊◊'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    getArtisticFont() {
        return {
            A: ['    ◆    ', '   ◆◆◆   ', '  ◆   ◆  ', ' ◆     ◆ ', '◆◆◆◆◆◆◆◆◆', '◆       ◆', '◆       ◆'],
            B: ['◆◆◆◆◆◆◆◆ ', '◆       ◆', '◆◆◆◆◆◆◆◆ ', '◆       ◆', '◆       ◆', '◆       ◆', '◆◆◆◆◆◆◆◆ '],
            C: ['  ◆◆◆◆◆◆◆', '◆        ', '◆        ', '◆        ', '◆        ', '◆        ', '  ◆◆◆◆◆◆◆'],
            D: ['◆◆◆◆◆◆◆◆ ', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆◆◆◆◆◆◆◆ '],
            E: ['◆◆◆◆◆◆◆◆◆', '◆        ', '◆        ', '◆◆◆◆◆◆◆◆ ', '◆        ', '◆        ', '◆◆◆◆◆◆◆◆◆'],
            F: ['◆◆◆◆◆◆◆◆◆', '◆        ', '◆        ', '◆◆◆◆◆◆◆◆ ', '◆        ', '◆        ', '◆        '],
            G: ['  ◆◆◆◆◆◆◆', '◆        ', '◆        ', '◆   ◆◆◆◆◆', '◆       ◆', '◆       ◆', '  ◆◆◆◆◆◆◆'],
            H: ['◆       ◆', '◆       ◆', '◆       ◆', '◆◆◆◆◆◆◆◆◆', '◆       ◆', '◆       ◆', '◆       ◆'],
            I: ['◆◆◆◆◆◆◆◆◆', '    ◆    ', '    ◆    ', '    ◆    ', '    ◆    ', '    ◆    ', '◆◆◆◆◆◆◆◆◆'],
            J: ['◆◆◆◆◆◆◆◆◆', '        ◆', '        ◆', '        ◆', '◆       ◆', '◆       ◆', '  ◆◆◆◆◆◆◆'],
            K: ['◆      ◆', '◆     ◆ ', '◆    ◆  ', '◆   ◆   ', '◆  ◆    ', '◆ ◆     ', '◆◆      '],
            L: ['◆        ', '◆        ', '◆        ', '◆        ', '◆        ', '◆        ', '◆◆◆◆◆◆◆◆◆'],
            M: ['◆       ◆', '◆◆     ◆◆', '◆ ◆   ◆ ◆', '◆  ◆ ◆  ◆', '◆   ◆   ◆', '◆       ◆', '◆       ◆'],
            N: ['◆       ◆', '◆◆      ◆', '◆ ◆     ◆', '◆  ◆    ◆', '◆   ◆   ◆', '◆    ◆  ◆', '◆     ◆◆◆'],
            O: ['  ◆◆◆◆◆◆◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '  ◆◆◆◆◆◆◆'],
            P: ['◆◆◆◆◆◆◆◆ ', '◆       ◆', '◆       ◆', '◆◆◆◆◆◆◆◆ ', '◆        ', '◆        ', '◆        '],
            Q: ['  ◆◆◆◆◆◆◆', '◆       ◆', '◆       ◆', '◆    ◆  ◆', '◆     ◆ ◆', '◆      ◆◆', '  ◆◆◆◆◆◆◆'],
            R: ['◆◆◆◆◆◆◆◆ ', '◆       ◆', '◆       ◆', '◆◆◆◆◆◆◆◆ ', '◆  ◆     ', '◆   ◆    ', '◆    ◆   '],
            S: ['  ◆◆◆◆◆◆◆', '◆        ', '◆        ', '  ◆◆◆◆◆◆◆', '        ◆', '        ◆', '  ◆◆◆◆◆◆◆'],
            T: ['◆◆◆◆◆◆◆◆◆', '    ◆    ', '    ◆    ', '    ◆    ', '    ◆    ', '    ◆    ', '    ◆    '],
            U: ['◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '◆       ◆', '  ◆◆◆◆◆◆◆'],
            V: ['◆       ◆', '◆       ◆', ' ◆     ◆ ', '  ◆   ◆  ', '   ◆ ◆   ', '    ◆    ', '    ◆    '],
            W: ['◆       ◆', '◆       ◆', '◆   ◆   ◆', '◆  ◆ ◆  ◆', '◆ ◆   ◆ ◆', '◆◆     ◆◆', '◆       ◆'],
            X: ['◆       ◆', ' ◆     ◆ ', '  ◆   ◆  ', '   ◆ ◆   ', '  ◆   ◆  ', ' ◆     ◆ ', '◆       ◆'],
            Y: ['◆       ◆', ' ◆     ◆ ', '  ◆   ◆  ', '   ◆ ◆   ', '    ◆    ', '    ◆    ', '    ◆    '],
            Z: ['◆◆◆◆◆◆◆◆◆', '       ◆ ', '      ◆  ', '     ◆   ', '    ◆    ', '   ◆     ', '◆◆◆◆◆◆◆◆◆'],
            ' ': ['         ', '         ', '         ', '         ', '         ', '         ', '         ']
        };
    }

    // Additional Font Styles
    get3DFont() {
        return {
            A: ['  ___  ', ' / _ \\ ', '/ /_\\ \\', '|  _  |', '| | | |', '\\_| |_/'],
            B: ['______ ', '| ___ \\', '| |_/ /', '| ___ \\', '| |_/ /', '\\____/ '],
            C: [' _____ ', '/  __ \\', '| /  \\/', '| |    ', '| \\__/\\', ' \\____/'],
            D: ['______ ', '|  _  \\', '| | | |', '| | | |', '| |/ / ', '|___/  '],
            E: [' _____ ', '|  ___|', '| |__  ', '|  __| ', '| |___ ', '\\____/ '],
            F: [' _____ ', '|  ___|', '| |__  ', '|  __| ', '| |    ', '\\_|    '],
            G: [' _____ ', '|  __ \\', '| |  \\/','| | __ ', '| |_\\ \\', ' \\____/'],
            H: ['_   _ ', '| | | |', '| |_| |', '|  _  |', '| | | |', '\\_| |_/'],
            I: ['_____ ', '|_   _|', '  | |  ', '  | |  ', ' _| |_ ', ' \\___/ '],
            J: ['     _ ', '    | |', '    | |', '    | |', '/\\__/ /', '\\____/ '],
            K: ['_   __', '| | / /', '| |/ / ', '|    \\ ', '| |\\  \\', '\\_| \\_/'],
            L: ['_     ', '| |    ', '| |    ', '| |    ', '| |____', '\\_____/'],
            M: ['___  ___', '|  \\/  |', '| .  . |', '| |\\/| |', '| |  | |', '\\_|  |_/'],
            N: ['_   _ ', '| \\ | |', '|  \\| |', '| . ` |', '| |\\  |', '\\_| \\_/'],
            O: [' _____ ', '|  _  |', '| | | |', '| | | |', '\\ \\_/ /', ' \\___/ '],
            P: ['______ ', '| ___ \\', '| |_/ /', '|  __/ ', '| |    ', '\\_|    '],
            Q: [' _____ ', '|  _  |', '| | | |', '| | | |', '\\ \\/' \\/\\', ' \\_/\\_/'],
            R: ['______ ', '| ___ \\', '| |_/ /', '|    / ', '| |\\ \\ ', '\\_| \\_|'],
            S: [' _____ ', '/  ___|', '\\ `--. ', ' `--. \\', '/\\__/ /', '\\____/ '],
            T: ['_____ ', '|_   _|', '  | |  ', '  | |  ', '  | |  ', '  \\_/  '],
            U: ['_   _ ', '| | | |', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
            V: ['_   _ ', '| | | |', '| | | |', '| | | |', '\\ \\_/ /', ' \\___/ '],
            W: ['_    _ ', '| |  | |', '| |  | |', '| |/\\| |', '\\  /\\  /', ' \\/  \\/ '],
            X: ['__   __', '\\ \\ / /', ' \\ V / ', ' /   \\ ', '/ /^\\ \\', '\\/   \\/'],
            Y: ['__   __', '\\ \\ / /', ' \\ V / ', '  \\ /  ', '  | |  ', '  \\_/  '],
            Z: ['_____ ', '|___  |', '   / / ', '  / /  ', './ /___', '\\_____/'],
            ' ': ['       ', '       ', '       ', '       ', '       ', '       ']
        };
    }

    getStarFont() {
        return {
            A: ['  ★  ', ' ★ ★ ', '★   ★', '★★★★★', '★   ★', '★   ★'],
            B: ['★★★★ ', '★   ★', '★★★★ ', '★   ★', '★   ★', '★★★★ '],
            C: [' ★★★★', '★    ', '★    ', '★    ', '★    ', ' ★★★★'],
            D: ['★★★★ ', '★   ★', '★   ★', '★   ★', '★   ★', '★★★★ '],
            E: ['★★★★★', '★    ', '★★★★ ', '★    ', '★    ', '★★★★★'],
            F: ['★★★★★', '★    ', '★★★★ ', '★    ', '★    ', '★    '],
            G: [' ★★★★', '★    ', '★    ', '★  ★★', '★   ★', ' ★★★★'],
            H: ['★   ★', '★   ★', '★★★★★', '★   ★', '★   ★', '★   ★'],
            I: ['★★★★★', '  ★  ', '  ★  ', '  ★  ', '  ★  ', '★★★★★'],
            J: ['★★★★★', '    ★', '    ★', '    ★', '★   ★', ' ★★★ '],
            K: ['★   ★', '★  ★ ', '★★★  ', '★  ★ ', '★   ★', '★   ★'],
            L: ['★    ', '★    ', '★    ', '★    ', '★    ', '★★★★★'],
            M: ['★   ★', '★★ ★★', '★ ★ ★', '★   ★', '★   ★', '★   ★'],
            N: ['★   ★', '★★  ★', '★ ★ ★', '★  ★★', '★   ★', '★   ★'],
            O: [' ★★★ ', '★   ★', '★   ★', '★   ★', '★   ★', ' ★★★ '],
            P: ['★★★★ ', '★   ★', '★★★★ ', '★    ', '★    ', '★    '],
            Q: [' ★★★ ', '★   ★', '★   ★', '★ ★ ★', '★  ★★', ' ★★★★'],
            R: ['★★★★ ', '★   ★', '★★★★ ', '★  ★ ', '★   ★', '★   ★'],
            S: [' ★★★★', '★    ', ' ★★★★', '    ★', '    ★', ' ★★★★'],
            T: ['★★★★★', '  ★  ', '  ★  ', '  ★  ', '  ★  ', '  ★  '],
            U: ['★   ★', '★   ★', '★   ★', '★   ★', '★   ★', ' ★★★ '],
            V: ['★   ★', '★   ★', '★   ★', ' ★ ★ ', ' ★ ★ ', '  ★  '],
            W: ['★   ★', '★   ★', '★   ★', '★ ★ ★', '★★ ★★', '★   ★'],
            X: ['★   ★', ' ★ ★ ', '  ★  ', '  ★  ', ' ★ ★ ', '★   ★'],
            Y: ['★   ★', '★   ★', ' ★ ★ ', '  ★  ', '  ★  ', '  ★  '],
            Z: ['★★★★★', '    ★', '   ★ ', '  ★  ', ' ★   ', '★★★★★'],
            ' ': ['     ', '     ', '     ', '     ', '     ', '     ']
        };
    }

    getDotFont() {
        return {
            A: ['  •  ', ' • • ', '•   •', '•••••', '•   •', '•   •'],
            B: ['•••• ', '•   •', '•••• ', '•   •', '•   •', '•••• '],
            C: [' ••••', '•    ', '•    ', '•    ', '•    ', ' ••••'],
            D: ['•••• ', '•   •', '•   •', '•   •', '•   •', '•••• '],
            E: ['•••••', '•    ', '•••• ', '•    ', '•    ', '•••••'],
            F: ['•••••', '•    ', '•••• ', '•    ', '•    ', '•    '],
            G: [' ••••', '•    ', '•    ', '•  ••', '•   •', ' ••••'],
            H: ['•   •', '•   •', '•••••', '•   •', '•   •', '•   •'],
            I: ['•••••', '  •  ', '  •  ', '  •  ', '  •  ', '•••••'],
            J: ['•••••', '    •', '    •', '    •', '•   •', ' ••• '],
            K: ['•   •', '•  • ', '••   ', '•  • ', '•   •', '•   •'],
            L: ['•    ', '•    ', '•    ', '•    ', '•    ', '•••••'],
            M: ['•   •', '•• ••', '• • •', '•   •', '•   •', '•   •'],
            N: ['•   •', '••  •', '• • •', '•  ••', '•   •', '•   •'],
            O: [' ••• ', '•   •', '•   •', '•   •', '•   •', ' ••• '],
            P: ['•••• ', '•   •', '•••• ', '•    ', '•    ', '•    '],
            Q: [' ••• ', '•   •', '•   •', '• • •', '•  ••', ' ••••'],
            R: ['•••• ', '•   •', '•••• ', '•  • ', '•   •', '•   •'],
            S: [' ••••', '•    ', ' ••••', '    •', '    •', ' ••••'],
            T: ['•••••', '  •  ', '  •  ', '  •  ', '  •  ', '  •  '],
            U: ['•   •', '•   •', '•   •', '•   •', '•   •', ' ••• '],
            V: ['•   •', '•   •', '•   •', ' • • ', ' • • ', '  •  '],
            W: ['•   •', '•   •', '•   •', '• • •', '•• ••', '•   •'],
            X: ['•   •', ' • • ', '  •  ', '  •  ', ' • • ', '•   •'],
            Y: ['•   •', '•   •', ' • • ', '  •  ', '  •  ', '  •  '],
            Z: ['•••••', '    •', '   • ', '  •  ', ' •   ', '•••••'],
            ' ': ['     ', '     ', '     ', '     ', '     ', '     ']
        };
    }

    getWavyFont() {
        return {
            A: ['  ≈≈  ', ' ≈≈≈≈ ', '≈≈  ≈≈', '≈≈≈≈≈≈', '≈≈  ≈≈', '≈≈  ≈≈'],
            B: ['≈≈≈≈≈ ', '≈≈  ≈≈', '≈≈≈≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈≈≈≈ '],
            C: [' ≈≈≈≈≈', '≈≈    ', '≈≈    ', '≈≈    ', '≈≈    ', ' ≈≈≈≈≈'],
            D: ['≈≈≈≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈≈≈≈ '],
            E: ['≈≈≈≈≈≈', '≈≈    ', '≈≈≈≈≈ ', '≈≈    ', '≈≈    ', '≈≈≈≈≈≈'],
            F: ['≈≈≈≈≈≈', '≈≈    ', '≈≈≈≈≈ ', '≈≈    ', '≈≈    ', '≈≈    '],
            G: [' ≈≈≈≈≈', '≈≈    ', '≈≈    ', '≈≈ ≈≈≈', '≈≈  ≈≈', ' ≈≈≈≈≈'],
            H: ['≈≈  ≈≈', '≈≈  ≈≈', '≈≈≈≈≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈'],
            I: ['≈≈≈≈≈≈', '  ≈≈  ', '  ≈≈  ', '  ≈≈  ', '  ≈≈  ', '≈≈≈≈≈≈'],
            J: ['≈≈≈≈≈≈', '    ≈≈', '    ≈≈', '    ≈≈', '≈≈  ≈≈', ' ≈≈≈≈ '],
            K: ['≈≈  ≈≈', '≈≈ ≈≈ ', '≈≈≈≈  ', '≈≈ ≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈'],
            L: ['≈≈    ', '≈≈    ', '≈≈    ', '≈≈    ', '≈≈    ', '≈≈≈≈≈≈'],
            M: ['≈≈  ≈≈', '≈≈≈≈≈≈', '≈≈ ≈≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈'],
            N: ['≈≈  ≈≈', '≈≈≈ ≈≈', '≈≈≈≈≈≈', '≈≈ ≈≈≈', '≈≈  ≈≈', '≈≈  ≈≈'],
            O: [' ≈≈≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', ' ≈≈≈≈ '],
            P: ['≈≈≈≈≈ ', '≈≈  ≈≈', '≈≈≈≈≈ ', '≈≈    ', '≈≈    ', '≈≈    '],
            Q: [' ≈≈≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈ ≈≈≈', '≈≈  ≈≈', ' ≈≈≈≈ '],
            R: ['≈≈≈≈≈ ', '≈≈  ≈≈', '≈≈≈≈≈ ', '≈≈ ≈≈ ', '≈≈  ≈≈', '≈≈  ≈≈'],
            S: [' ≈≈≈≈≈', '≈≈    ', ' ≈≈≈≈≈', '    ≈≈', '    ≈≈', ' ≈≈≈≈≈'],
            T: ['≈≈≈≈≈≈', '  ≈≈  ', '  ≈≈  ', '  ≈≈  ', '  ≈≈  ', '  ≈≈  '],
            U: ['≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', ' ≈≈≈≈ '],
            V: ['≈≈  ≈≈', '≈≈  ≈≈', '≈≈  ≈≈', ' ≈≈≈≈ ', ' ≈≈≈≈ ', '  ≈≈  '],
            W: ['≈≈  ≈≈', '≈≈  ≈≈', '≈≈ ≈≈≈', '≈≈≈≈≈≈', '≈≈  ≈≈', '≈≈  ≈≈'],
            X: ['≈≈  ≈≈', ' ≈≈≈≈ ', '  ≈≈  ', '  ≈≈  ', ' ≈≈≈≈ ', '≈≈  ≈≈'],
            Y: ['≈≈  ≈≈', '≈≈  ≈≈', ' ≈≈≈≈ ', '  ≈≈  ', '  ≈≈  ', '  ≈≈  '],
            Z: ['≈≈≈≈≈≈', '    ≈≈', '   ≈≈ ', '  ≈≈  ', ' ≈≈   ', '≈≈≈≈≈≈'],
            ' ': ['      ', '      ', '      ', '      ', '      ', '      ']
        };
    }

    getPixelFont() {
        return {
            A: ['  ▓  ', ' ▓ ▓ ', '▓▓▓▓▓', '▓   ▓', '▓   ▓'],
            B: ['▓▓▓▓ ', '▓   ▓', '▓▓▓▓ ', '▓   ▓', '▓▓▓▓ '],
            C: [' ▓▓▓▓', '▓    ', '▓    ', '▓    ', ' ▓▓▓▓'],
            D: ['▓▓▓▓ ', '▓   ▓', '▓   ▓', '▓   ▓', '▓▓▓▓ '],
            E: ['▓▓▓▓▓', '▓    ', '▓▓▓▓ ', '▓    ', '▓▓▓▓▓'],
            F: ['▓▓▓▓▓', '▓    ', '▓▓▓▓ ', '▓    ', '▓    '],
            G: [' ▓▓▓▓', '▓    ', '▓  ▓▓', '▓   ▓', ' ▓▓▓▓'],
            H: ['▓   ▓', '▓   ▓', '▓▓▓▓▓', '▓   ▓', '▓   ▓'],
            I: ['▓▓▓▓▓', '  ▓  ', '  ▓  ', '  ▓  ', '▓▓▓▓▓'],
            J: ['▓▓▓▓▓', '    ▓', '    ▓', '▓   ▓', ' ▓▓▓ '],
            K: ['▓   ▓', '▓  ▓ ', '▓▓▓  ', '▓  ▓ ', '▓   ▓'],
            L: ['▓    ', '▓    ', '▓    ', '▓    ', '▓▓▓▓▓'],
            M: ['▓   ▓', '▓▓ ▓▓', '▓ ▓ ▓', '▓   ▓', '▓   ▓'],
            N: ['▓   ▓', '▓▓  ▓', '▓ ▓ ▓', '▓  ▓▓', '▓   ▓'],
            O: [' ▓▓▓ ', '▓   ▓', '▓   ▓', '▓   ▓', ' ▓▓▓ '],
            P: ['▓▓▓▓ ', '▓   ▓', '▓▓▓▓ ', '▓    ', '▓    '],
            Q: [' ▓▓▓ ', '▓   ▓', '▓   ▓', '▓  ▓▓', ' ▓▓▓▓'],
            R: ['▓▓▓▓ ', '▓   ▓', '▓▓▓▓ ', '▓  ▓ ', '▓   ▓'],
            S: [' ▓▓▓▓', '▓    ', ' ▓▓▓▓', '    ▓', ' ▓▓▓▓'],
            T: ['▓▓▓▓▓', '  ▓  ', '  ▓  ', '  ▓  ', '  ▓  '],
            U: ['▓   ▓', '▓   ▓', '▓   ▓', '▓   ▓', ' ▓▓▓ '],
            V: ['▓   ▓', '▓   ▓', '▓   ▓', ' ▓ ▓ ', '  ▓  '],
            W: ['▓   ▓', '▓   ▓', '▓ ▓ ▓', '▓▓ ▓▓', '▓   ▓'],
            X: ['▓   ▓', ' ▓ ▓ ', '  ▓  ', ' ▓ ▓ ', '▓   ▓'],
            Y: ['▓   ▓', ' ▓ ▓ ', '  ▓  ', '  ▓  ', '  ▓  '],
            Z: ['▓▓▓▓▓', '    ▓', '   ▓ ', '  ▓  ', '▓▓▓▓▓'],
            ' ': ['     ', '     ', '     ', '     ', '     ']
        };
    }
}

// Note: Initialization moved to app.js for better control and error handling
// The ASCIIArtGenerator class is defined here and instantiated by app.js
