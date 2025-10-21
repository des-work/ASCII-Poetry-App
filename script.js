/**
 * Simple ASCII Art Generator - MVP Version
 * Clean, minimal implementation focusing on core functionality
 */

class SimpleASCIIArt {
    constructor() {
        this.fontManager = null;
        this.asciiRenderer = null;
        this.isGenerating = false;
        this.init();
    }

    async init() {
        console.log('íº€ Simple ASCII Art Generator - Initializing...');

        try {
            // Initialize core components
            this.fontManager = new FontManager();
            this.asciiRenderer = new ASCIIRenderer();

            // Cache DOM elements
            this.cacheDOM();

            // Set up event listeners
            this.attachEventListeners();

            // Set default font
            this.setDefaultFont();

            console.log('âœ… Simple ASCII Art Generator - Ready!');
            console.log('í²¡ Enter text and click "Generate ASCII Art" to begin');

        } catch (error) {
            console.error('âŒ Initialization failed:', error);
            this.showError('Failed to initialize application');
        }
    }

    cacheDOM() {
        this.textInput = document.getElementById('text-input');
        this.fontSelect = document.getElementById('font-select');
        this.generateBtn = document.getElementById('generate-main');
        this.output = document.getElementById('ascii-output');

        if (!this.textInput || !this.fontSelect || !this.generateBtn || !this.output) {
            throw new Error('Required DOM elements not found');
        }

        console.log('í³¦ DOM elements cached');
    }

    attachEventListeners() {
        // Generate button click
        this.generateBtn.addEventListener('click', () => {
            this.handleGenerate();
        });

        // Enter key in text input
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGenerate();
            }
        });

        // Font selection change
        this.fontSelect.addEventListener('change', () => {
            if (this.textInput.value.trim()) {
                this.handleGenerate(); // Auto-regenerate on font change
            }
        });

        console.log('í´— Event listeners attached');
    }

    setDefaultFont() {
        if (this.fontSelect) {
            this.fontSelect.value = 'standard';
        }
    }

    async handleGenerate() {
        if (this.isGenerating) {
            this.showNotification('â³ Please wait for current generation to complete', 'warning');
            return;
        }

        const text = this.textInput?.value?.trim();
        if (!text) {
            this.showNotification('âš ï¸ Please enter some text to generate ASCII art', 'warning');
            return;
        }

        try {
            this.isGenerating = true;
            this.updateButtonState();

            console.log('í¾¨ Generating ASCII art for:', text);

            // Get selected font
            const fontName = this.fontSelect?.value || 'standard';

            // Generate ASCII art
            const result = await this.generateASCII(text, fontName);

            // Display result
            this.displayASCII(result);

            console.log('âœ… Generation complete');

        } catch (error) {
            console.error('âŒ Generation failed:', error);
            this.showError(`Generation failed: ${error.message}`);
        } finally {
            this.isGenerating = false;
            this.updateButtonState();
        }
    }

    async generateASCII(text, fontName) {
        // Load font
        const font = this.fontManager.getFont(fontName);
        if (!font) {
            throw new Error(`Font "${fontName}" not available`);
        }

        // Render text
        const ascii = this.asciiRenderer.renderTextWithFont(text.toUpperCase(), font);

        return {
            ascii: ascii,
            font: fontName,
            text: text,
            timestamp: Date.now()
        };
    }

    displayASCII(result) {
        if (!this.output || !result.ascii) {
            throw new Error('Invalid result or output element');
        }

        // Clear output
        this.output.textContent = '';

        // Add ASCII art
        this.output.textContent = result.ascii;

        // Update styling
        this.output.className = 'ascii-output';
        this.output.setAttribute('data-font', result.font);

        console.log('í³º ASCII art displayed');
    }

    updateButtonState() {
        if (this.generateBtn) {
            this.generateBtn.disabled = this.isGenerating;
            this.generateBtn.classList.toggle('generating', this.isGenerating);

            if (this.isGenerating) {
                this.generateBtn.textContent = 'â³ Generating...';
            } else {
                this.generateBtn.textContent = 'âœ¨ Generate ASCII Art';
            }
        }
    }

    showNotification(message, type = 'info') {
        console.log(`í³¢ ${type.toUpperCase()}: ${message}`);

        // Simple notification - could be enhanced later
        if (type === 'error') {
            this.output.textContent = `âŒ ${message}`;
            this.output.className = 'ascii-output error';
        } else {
            // For non-error messages, just log to console for now
            console.log(`í³¢ Notification: ${message}`);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('í¾¯ Starting Simple ASCII Art Generator...');
    new SimpleASCIIArt();
});
