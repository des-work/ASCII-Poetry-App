/**
 * ASCII Renderer
 * Handles the logic of converting text into ASCII art using a given font.
 * 
 * Enhanced Features:
 * - Text rendering with multiple fonts
 * - Text alignment (left, center, right)
 * - Text wrapping
 * - Border addition
 * - Color application
 * - Size optimization
 */
class ASCIIRenderer {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = 50;
        console.log('🎨 ASCIIRenderer initialized with caching');
    }

    /**
     * Renders a string of text into ASCII art using the provided font data
     * @param {string} text - The text to render
     * @param {Object} font - The font object containing character patterns
     * @param {Object} [options] - Rendering options
     * @param {boolean} [options.cached=true] - Whether to use caching
     * @returns {string} The rendered ASCII art
     */
    renderTextWithFont(text, font, options = {}) {
        if (!text || !font) {
            return '';
        }

        // Check cache if enabled
        const { cached = true } = options;
        if (cached) {
            const cacheKey = `${text}_${font.A ? font.A[0] : 'unknown'}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
        }

        const lines = [];
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
                    line += ' '.repeat(charWidth);
                }
            }
            lines.push(line);
        }

        const result = lines.join('\n');

        // Cache result
        if (cached) {
            this.cacheResult(`${text}_${font.A ? font.A[0] : 'unknown'}`, result);
        }

        return result;
    }

    /**
     * Wrap text to fit within a maximum width
     * @param {string} text - Text to wrap
     * @param {number} maxWidth - Maximum line width
     * @returns {string[]} Array of wrapped lines
     */
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (testLine.length <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    /**
     * Align text within a given width
     * @param {string} text - Text to align
     * @param {string} alignment - 'left', 'center', or 'right'
     * @param {number} width - Total width
     * @returns {string} Aligned text
     */
    alignText(text, alignment = 'left', width) {
        const lines = text.split('\n');
        return lines.map(line => {
            const trimmed = line.trimEnd();
            const padding = Math.max(0, width - trimmed.length);

            switch (alignment) {
                case 'center':
                    const leftPad = Math.floor(padding / 2);
                    const rightPad = padding - leftPad;
                    return ' '.repeat(leftPad) + trimmed + ' '.repeat(rightPad);
                case 'right':
                    return ' '.repeat(padding) + trimmed;
                default:
                    return trimmed;
            }
        }).join('\n');
    }

    /**
     * Add a border around ASCII art
     * @param {string} text - Text to border
     * @param {string} style - Border style: 'single', 'double', 'rounded', 'heavy'
     * @returns {string} Bordered text
     */
    addBorder(text, style = 'single') {
        const borders = {
            single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
            double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
            rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
            heavy: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' }
        };

        const border = borders[style] || borders.single;
        const lines = text.split('\n');
        const maxWidth = Math.max(...lines.map(line => line.length));

        const top = border.tl + border.h.repeat(maxWidth + 2) + border.tr;
        const bottom = border.bl + border.h.repeat(maxWidth + 2) + border.br;
        const middle = lines.map(line => 
            border.v + ' ' + line.padEnd(maxWidth) + ' ' + border.v
        );

        return [top, ...middle, bottom].join('\n');
    }

    /**
     * Creates a single line for a border (top or bottom).
     * @param {'top'|'bottom'} position - The position of the border line.
     * @param {number} width - The inner width of the border.
     * @param {string} style - Border style: 'single', 'double', 'rounded', 'heavy'.
     * @returns {string} The border line string.
     */
    createBorderLine(position, width, style = 'single') {
        const borders = {
            single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─' },
            double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═' },
            rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─' },
            heavy: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━' }
        };
        const border = borders[style] || borders.single;
        const [start, end, char] = position === 'top' ? [border.tl, border.tr, border.h] : [border.bl, border.br, border.h];
        return start + char.repeat(width) + end;
    }

    /**
     * Get dimensions of ASCII art
     * @param {string} text - ASCII art text
     * @returns {Object} Width and height
     */
    getDimensions(text) {
        const lines = text.split('\n');
        return {
            width: Math.max(...lines.map(line => line.length)),
            height: lines.length
        };
    }

    /**
     * Cache a rendering result
     * @param {string} key - Cache key
     * @param {string} value - Value to cache
     */
    cacheResult(key, value) {
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    /**
     * Clear the rendering cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ ASCIIRenderer cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASCIIRenderer;
}