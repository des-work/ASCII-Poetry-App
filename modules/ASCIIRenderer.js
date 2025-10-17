/**
 * ASCII Renderer
 * Handles the logic of converting text into ASCII art using a given font.
 */
class ASCIIRenderer {
    constructor() {
        console.log('🎨 ASCIIRenderer initialized');
    }

    /**
     * Renders a string of text into ASCII art using the provided font data.
     * @param {string} text The text to render.
     * @param {Object} font The font object containing character patterns.
     * @returns {string} The rendered ASCII art.
     */
    renderTextWithFont(text, font) {
        if (!text || !font) {
            return '';
        }

        const lines = [];
        // Use a common character like 'A' to determine font height and width.
        const fontHeight = font.A ? font.A.length : 0;
        const charWidth = font.A && font.A[0] ? font.A[0].length : 6;

        if (fontHeight === 0) return text; // Fallback for invalid font

        for (let i = 0; i < fontHeight; i++) {
            let line = '';
            for (const char of text) {
                const upperChar = char.toUpperCase();
                if (font[upperChar] && font[upperChar][i]) {
                    line += font[upperChar][i];
                } else {
                    // Add a space placeholder for unsupported characters
                    line += ' '.repeat(charWidth);
                }
            }
            lines.push(line);
        }
        return lines.join('\n');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASCIIRenderer;
}