// ASCII Art Generator - Main JavaScript File

class ASCIIArtGenerator {
    constructor() {
        this.currentTheme = 'dark';
        this.initializeEventListeners();
        this.initializeTheme();
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
            alert('Please enter some text first!');
            return;
        }

        const font = document.getElementById('font-select').value;
        const color = document.getElementById('color-select').value;
        const animation = document.getElementById('animation-select').value;

        try {
            const asciiArt = await this.convertTextToASCII(text, font);
            this.displayASCII(asciiArt, color, animation);
        } catch (error) {
            console.error('Error generating ASCII art:', error);
            alert('Error generating ASCII art. Please try again.');
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
        const fileInput = document.getElementById('image-input');
        if (!fileInput.files[0]) {
            alert('Please select an image first!');
            return;
        }

        const width = parseInt(document.getElementById('image-width').value);
        const charSet = document.getElementById('image-chars').value;
        const colorMode = document.getElementById('image-color').value;

        try {
            const asciiArt = await this.convertImageToASCII(fileInput.files[0], width, charSet, colorMode);
            this.displayASCII(asciiArt, 'none', 'none');
        } catch (error) {
            console.error('Error generating ASCII art:', error);
            alert('Error generating ASCII art. Please try again.');
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
            alert('No ASCII art to copy!');
            return;
        }

        navigator.clipboard.writeText(output).then(() => {
            const btn = document.getElementById('copy-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    }

    downloadASCII() {
        const output = document.getElementById('ascii-output').textContent;
        if (!output.trim()) {
            alert('No ASCII art to download!');
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
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ASCIIArtGenerator();
});
