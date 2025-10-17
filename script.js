// ASCII Art Generator - Main JavaScript File

class ASCIIArtGenerator {
    constructor() {
        this.currentTheme = 'dark';
        this.currentTitleIndex = 0;
        this.titleFonts = ['mini', 'small', 'bubble', 'lean'];
        this.keywords = new Set();
        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeAnimatedTitle();
        this.addAsciiDecorations();
        this.initializeKeywordSystem();
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Text generation
        document.getElementById('generate-text').addEventListener('click', () => this.generateTextASCII());
        
        // Image generation
        document.getElementById('generate-image').addEventListener('click', () => this.generateImageASCII());
        
        // Poetry generation
        document.getElementById('generate-poetry').addEventListener('click', () => this.generatePoetryASCII());
        
        // Image input
        document.getElementById('image-input').addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Width slider
        const widthSlider = document.getElementById('image-width');
        const widthValue = document.getElementById('width-value');
        widthSlider.addEventListener('input', (e) => {
            widthValue.textContent = e.target.value;
        });

        // Output controls
        document.getElementById('copy-btn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadASCII());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearOutput());

        // Theme toggle
        document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async generateTextASCII() {
        const text = document.getElementById('text-input').value.trim();
        if (!text) {
            this.showNotification('⚠️ Please enter some text first!');
            return;
        }

        const font = document.getElementById('font-select').value;
        const color = document.getElementById('color-select').value;
        const animation = document.getElementById('animation-select').value;

        try {
            this.showLoading();
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for effect
            const asciiArt = await this.convertTextToASCII(text, font);
            this.displayASCII(asciiArt, color, animation);
            this.showNotification('✨ ASCII art generated successfully!');
        } catch (error) {
            console.error('Error generating ASCII art:', error);
            this.showNotification('❌ Error generating ASCII art. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    showNotification(message) {
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
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
        }, 3000);
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
        const fileInput = document.getElementById('image-input');
        if (!fileInput.files[0]) {
            this.showNotification('⚠️ Please select an image first!');
            return;
        }

        const width = parseInt(document.getElementById('image-width').value);
        const charSet = document.getElementById('image-chars').value;
        const colorMode = document.getElementById('image-color').value;

        try {
            this.showLoading();
            const asciiArt = await this.convertImageToASCII(fileInput.files[0], width, charSet, colorMode);
            this.displayASCII(asciiArt, 'none', 'none');
            this.showNotification('✨ Image converted to ASCII art!');
        } catch (error) {
            console.error('Error generating ASCII art:', error);
            this.showNotification('❌ Error generating ASCII art. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async generatePoetryASCII() {
        const poem = document.getElementById('poem-input').value.trim();
        if (!poem) {
            this.showNotification('⚠️ Please enter a poem first!');
            return;
        }

        const font = document.getElementById('poetry-font-select').value;
        const layout = document.getElementById('poetry-layout').value;
        const color = document.getElementById('poetry-color-select').value;
        const animation = document.getElementById('poetry-animation-select').value;
        const decoration = document.getElementById('poetry-decoration').value;

        try {
            this.showLoading();
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for effect
            const asciiArt = await this.convertPoetryToASCII(poem, font, layout, decoration);
            this.displayPoetryASCII(asciiArt, color, animation, layout, decoration);
            this.showNotification('✨ Poetry art created beautifully!');
        } catch (error) {
            console.error('Error generating poetry ASCII art:', error);
            this.showNotification('❌ Error generating poetry ASCII art. Please try again.');
        } finally {
            this.hideLoading();
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
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Image preview could be added here
                console.log('Image loaded:', file.name);
            };
            reader.readAsDataURL(file);
        }
    }

    copyToClipboard() {
        const output = document.getElementById('ascii-output').textContent;
        if (!output.trim()) {
            this.showNotification('⚠️ No ASCII art to copy!');
            return;
        }

        navigator.clipboard.writeText(output).then(() => {
            this.showNotification('📋 Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showNotification('❌ Failed to copy to clipboard');
        });
    }

    downloadASCII() {
        const output = document.getElementById('ascii-output').textContent;
        if (!output.trim()) {
            this.showNotification('⚠️ No ASCII art to download!');
            return;
        }

        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('💾 Downloaded successfully!');
    }

    clearOutput() {
        document.getElementById('ascii-output').textContent = '';
        document.getElementById('ascii-output').className = 'ascii-output';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        const themeBtn = document.getElementById('theme-btn');
        themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    initializeAnimatedTitle() {
        this.animateTitle();
        // Change title every 3 seconds
        setInterval(() => this.animateTitle(), 3000);
    }

    animateTitle() {
        const titleElement = document.getElementById('ascii-title');
        if (!titleElement) return;

        const text = 'ASCII ART';
        const fontName = this.titleFonts[this.currentTitleIndex];
        const font = this.getFont(fontName);
        
        const asciiText = this.renderTextWithFont(text, font);
        titleElement.textContent = asciiText;
        
        this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titleFonts.length;
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
    }

    handleKeywordInput(e) {
        const value = e.target.value;
        if (value.includes(',')) {
            const keywords = value.split(',').map(k => k.trim()).filter(k => k);
            keywords.forEach(keyword => this.addKeyword(keyword));
            e.target.value = '';
        }
    }

    addKeywordFromInput() {
        const input = document.getElementById('keywords-input');
        const keyword = input.value.trim();
        if (keyword) {
            this.addKeyword(keyword);
            input.value = '';
        }
    }

    addKeyword(keyword) {
        if (!keyword || this.keywords.has(keyword.toLowerCase())) return;
        
        this.keywords.add(keyword.toLowerCase());
        this.renderKeywordChips();
    }

    removeKeyword(keyword) {
        this.keywords.delete(keyword.toLowerCase());
        this.renderKeywordChips();
    }

    renderKeywordChips() {
        const container = document.getElementById('keyword-chips');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.keywords.forEach(keyword => {
            const chip = document.createElement('div');
            chip.className = 'keyword-chip';
            chip.innerHTML = `
                <span>${keyword}</span>
                <span class="remove" data-keyword="${keyword}">×</span>
            `;
            
            chip.querySelector('.remove').addEventListener('click', () => {
                this.removeKeyword(keyword);
            });
            
            container.appendChild(chip);
        });
    }

    autoDetectKeywords() {
        const poem = document.getElementById('poem-input').value;
        if (!poem) {
            this.showNotification('⚠️ Please enter a poem first!');
            return;
        }

        // Common words to exclude
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'this', 'that', 'these', 'those']);

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
            .slice(0, 5);

        if (detectedKeywords.length === 0) {
            this.showNotification('ℹ️ No significant keywords detected. Try adding them manually!');
            return;
        }

        detectedKeywords.forEach(keyword => this.addKeyword(keyword));
        this.showNotification(`✨ Detected ${detectedKeywords.length} keywords!`);
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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ASCIIArtGenerator();
});
