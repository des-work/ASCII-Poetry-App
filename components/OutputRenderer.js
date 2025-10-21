/**
 * Output Renderer - Simplified ASCII Art Display
 * Single responsibility: Display generated ASCII art with proper styling
 */

class OutputRenderer {
    constructor() {
        this.outputElement = null;
        this.outputContainer = null;
        this.initialize();
    }

    /**
     * Initialize and cache DOM elements
     */
    initialize() {
        this.outputElement = document.getElementById('ascii-output');
        this.outputContainer = document.querySelector('.output-container');
        
        if (!this.outputElement) {
            console.error('❌ OutputRenderer: #ascii-output element not found');
            return;
        }
        
        console.log('✅ OutputRenderer initialized');
    }

    /**
     * Display ASCII art with color and animation
     */
    display(ascii, options = {}) {
        if (!this.outputElement) {
            console.error('❌ OutputRenderer: output element not available');
            return false;
        }

        const { color = 'none', animation = 'none' } = options;

        try {
            // 1. Clear element
            this.outputElement.innerHTML = '';
            this.outputElement.textContent = '';

            // 2. Remove all style overrides
            this.outputElement.style.cssText = '';
            this.outputElement.className = 'ascii-output';

            // 3. Set text content
            this.outputElement.textContent = ascii;

            // 4. Apply color
            if (color && color !== 'none') {
                this.applyColor(color, ascii);
            } else {
                // Default: white text
                this.outputElement.style.color = '#ffffff';
            }

            // 5. Apply animation
            if (animation && animation !== 'none') {
                this.outputElement.classList.add(`animation-${animation}`);
            }

            // Force visibility
            this.outputElement.style.display = 'block';
            this.outputElement.style.visibility = 'visible';
            this.outputElement.style.opacity = '1';

            console.log('✅ OutputRenderer: ASCII displayed', {
                length: ascii.length,
                color: color,
                animation: animation,
                textContent: this.outputElement.textContent.substring(0, 50) + '...'
            });

            return true;
        } catch (error) {
            console.error('❌ OutputRenderer: Error displaying ASCII', error);
            return false;
        }
    }

    /**
     * Apply color styling
     */
    applyColor(color, ascii) {
        const colorMap = {
            red: '#ff6b6b',
            green: '#51cf66',
            blue: '#4dabf7',
            yellow: '#ffd43b',
            purple: '#cc5de8',
            cyan: '#22b8cf',
            magenta: '#ff6b9d',
            gold: '#ffd700',
            silver: '#c0c0c0'
        };

        if (colorMap[color]) {
            this.outputElement.style.color = colorMap[color];
            console.log(`🎨 Applied color: ${color}`);
        } else if (color === 'rainbow') {
            this.applyRainbow(ascii);
        } else if (color === 'gradient') {
            this.applyGradient();
        }
    }

    /**
     * Apply rainbow color effect
     */
    applyRainbow(text) {
        const colors = ['#ff6b6b', '#ff8c00', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8'];
        let html = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const colorIndex = i % colors.length;
            const color = colors[colorIndex];
            
            if (char === '\n') {
                html += '\n';
            } else if (char === ' ') {
                html += ' ';
            } else {
                html += `<span style="color: ${color}">${char}</span>`;
            }
        }
        
        this.outputElement.innerHTML = html;
        console.log('🌈 Applied rainbow effect');
    }

    /**
     * Apply gradient effect
     */
    applyGradient() {
        this.outputElement.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        this.outputElement.style.webkitBackgroundClip = 'text';
        this.outputElement.style.webkitTextFillColor = 'transparent';
        this.outputElement.style.backgroundClip = 'text';
        console.log('🎨 Applied gradient effect');
    }

    /**
     * Clear output
     */
    clear() {
        if (this.outputElement) {
            this.outputElement.innerHTML = '';
            this.outputElement.textContent = '';
            this.outputElement.className = 'ascii-output';
            console.log('🗑️ OutputRenderer: cleared');
        }
    }

    /**
     * Get current output
     */
    getOutput() {
        return this.outputElement?.textContent || '';
    }

    /**
     * Debug helper
     */
    debug() {
        if (!this.outputElement) {
            console.log('🔍 OutputRenderer: No output element');
            return;
        }

        const computed = window.getComputedStyle(this.outputElement);
        console.log('🔍 OutputRenderer Debug:', {
            element: this.outputElement,
            hasContent: this.outputElement.textContent.length > 0,
            textLength: this.outputElement.textContent.length,
            textPreview: this.outputElement.textContent.substring(0, 100),
            computedColor: computed.color,
            computedDisplay: computed.display,
            computedVisibility: computed.visibility,
            computedOpacity: computed.opacity,
            backgroundColor: computed.backgroundColor
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutputRenderer;
}
