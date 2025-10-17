// ASCII Renderer Module - Handles rendering text to ASCII art

class ASCIIRenderer {
    constructor(fontManager) {
        this.fontManager = fontManager;
    }

    /**
     * Render text with specified font
     * @param {string} text - Text to render
     * @param {Object} font - Font object
     * @returns {string} ASCII art
     */
    renderTextWithFont(text, font) {
        try {
            if (!font || !font.A) {
                throw new Error('Invalid font object');
            }

            const lines = [];
            const height = font.A.length;
            
            for (let i = 0; i < height; i++) {
                let line = '';
                for (const char of text) {
                    if (font[char] && font[char][i]) {
                        line += font[char][i];
                    } else if (char === ' ' && font[' ']) {
                        line += font[' '][i] || ' '.repeat(font.A[i].length);
                    } else {
                        // For unsupported characters, use spaces
                        line += ' '.repeat(font.A[i].length);
                    }
                }
                lines.push(line);
            }
            
            return lines.join('\n');
        } catch (error) {
            console.error('Error rendering text:', error);
            throw new Error('Failed to render text with font');
        }
    }

    /**
     * Render small ASCII for keywords
     * @param {string} word - Word to render
     * @param {Object} font - Font object
     * @returns {string} ASCII art
     */
    renderSmallASCII(word, font) {
        try {
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
        } catch (error) {
            console.error('Error rendering small ASCII:', error);
            return word; // Fallback to original word
        }
    }

    /**
     * Apply color to output element
     * @param {HTMLElement} element - Output element
     * @param {string} color - Color name
     */
    applyColor(element, color) {
        try {
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
                element.style.color = colorMap[color];
            } else if (color === 'rainbow') {
                this.applyRainbowEffect(element);
            } else if (color === 'gradient') {
                this.applyGradientEffect(element);
            }
        } catch (error) {
            console.error('Error applying color:', error);
        }
    }

    /**
     * Apply rainbow effect to element
     * @param {HTMLElement} element - Element to apply effect to
     */
    applyRainbowEffect(element) {
        try {
            const text = element.textContent;
            const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff6b9d'];
            let html = '';
            
            for (let i = 0; i < text.length; i++) {
                const color = colors[i % colors.length];
                html += `<span style="color: ${color}">${text[i]}</span>`;
            }
            
            element.innerHTML = html;
        } catch (error) {
            console.error('Error applying rainbow effect:', error);
        }
    }

    /**
     * Apply gradient effect to element
     * @param {HTMLElement} element - Element to apply effect to
     */
    applyGradientEffect(element) {
        try {
            element.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
            element.style.webkitBackgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
            element.style.backgroundClip = 'text';
        } catch (error) {
            console.error('Error applying gradient effect:', error);
        }
    }

    /**
     * Create decorative border
     * @param {string} type - Border type (top/bottom)
     * @param {number} width - Border width
     * @returns {string} Border string
     */
    createBorder(type, width = 40) {
        try {
            if (type === 'top') {
                return '┌' + '─'.repeat(width) + '┐';
            } else if (type === 'bottom') {
                return '└' + '─'.repeat(width) + '┘';
            }
            return '';
        } catch (error) {
            console.error('Error creating border:', error);
            return '';
        }
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASCIIRenderer;
}

