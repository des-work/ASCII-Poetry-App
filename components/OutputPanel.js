/**
 * OutputPanel Component
 * Dedicated component for managing the output display area
 * 
 * Responsibilities:
 * - Display ASCII art output
 * - Manage output visibility and styling
 * - Show placeholder/default state
 * - Update output statistics
 * - Clear output
 */

class OutputPanel {
    constructor() {
        this.outputElement = null;
        this.statsElement = null;
        this.initialize();
    }

    /**
     * Initialize output panel
     */
    initialize() {
        console.log('📺 OutputPanel: Initializing...');
        
        try {
            this.cacheElements();
            this.setDefaultState();
            console.log('✅ OutputPanel: Initialized');
        } catch (error) {
            console.error('❌ OutputPanel: Initialization error:', error);
        }
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.outputElement = document.getElementById('ascii-output');
        this.statsElement = document.getElementById('output-stats');

        if (!this.outputElement) {
            console.error('❌ OutputPanel: Output element not found');
            return;
        }

        console.log('📦 OutputPanel: DOM elements cached');
    }

    /**
     * Set default/empty state
     */
    setDefaultState() {
        if (!this.outputElement) return;

        this.outputElement.innerHTML = '';
        this.outputElement.textContent = '';
        this.outputElement.className = 'ascii-output';
        this.outputElement.setAttribute('data-state', 'empty');
        
        if (this.statsElement) {
            this.statsElement.textContent = '';
        }

        console.log('✨ OutputPanel: Set to default state');
    }

    /**
     * Display ASCII art
     */
    display(ascii, options = {}) {
        if (!this.outputElement) {
            console.error('❌ OutputPanel: Output element not available');
            return false;
        }

        if (!ascii || ascii.length === 0) {
            console.warn('⚠️ OutputPanel: No ASCII to display');
            this.setDefaultState();
            return false;
        }

        try {
            // Clear existing content
            this.outputElement.innerHTML = '';
            this.outputElement.textContent = '';

            // Set content
            this.outputElement.textContent = ascii;
            this.outputElement.className = 'ascii-output';
            this.outputElement.setAttribute('data-state', 'filled');

            // Apply styling
            const { color = 'none', animation = 'none' } = options;
            this.applyColor(color, ascii);
            this.applyAnimation(animation);

            // Update statistics
            this.updateStats(ascii);

            console.log('✅ OutputPanel: ASCII displayed', {
                length: ascii.length,
                color,
                animation
            });

            return true;
        } catch (error) {
            console.error('❌ OutputPanel: Error displaying:', error);
            return false;
        }
    }

    /**
     * Apply color to output
     */
    applyColor(color, ascii) {
        if (!this.outputElement) return;

        // Reset color styles
        this.outputElement.style.color = '';
        this.outputElement.style.background = '';
        this.outputElement.style.webkitBackgroundClip = '';
        this.outputElement.style.webkitTextFillColor = '';
        this.outputElement.style.backgroundClip = '';

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
            console.log(`🎨 Color applied: ${color}`);
        } else if (color === 'rainbow') {
            this.applyRainbow(ascii);
        } else if (color === 'gradient') {
            this.applyGradient();
        } else {
            // Default: white text
            this.outputElement.style.color = '#ffffff';
        }
    }

    /**
     * Apply rainbow effect
     */
    applyRainbow(text) {
        const colors = ['#ff6b6b', '#ff8c00', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8'];
        let html = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const color = colors[i % colors.length];

            if (char === '\n') {
                html += '\n';
            } else if (char === ' ') {
                html += ' ';
            } else {
                html += `<span style="color: ${color}">${this.escapeHtml(char)}</span>`;
            }
        }

        this.outputElement.innerHTML = html;
        console.log('🌈 Rainbow effect applied');
    }

    /**
     * Apply gradient effect
     */
    applyGradient() {
        this.outputElement.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        this.outputElement.style.webkitBackgroundClip = 'text';
        this.outputElement.style.webkitTextFillColor = 'transparent';
        this.outputElement.style.backgroundClip = 'text';
        console.log('🎨 Gradient effect applied');
    }

    /**
     * Apply animation
     */
    applyAnimation(animation) {
        if (!this.outputElement || !animation || animation === 'none') return;

        this.outputElement.classList.remove('animation-glow', 'animation-wave', 'animation-fade', 'animation-blink');
        this.outputElement.classList.add(`animation-${animation}`);
        console.log(`✨ Animation applied: ${animation}`);
    }

    /**
     * Update statistics
     */
    updateStats(ascii) {
        if (!this.statsElement || !ascii) return;

        const lines = ascii.split('\n');
        const width = Math.max(...lines.map(l => l.length));
        const height = lines.length;
        const chars = ascii.length;

        this.statsElement.textContent = `${width}×${height}, ${chars} chars`;
        console.log('📊 Stats updated:', { width, height, chars });
    }

    /**
     * Clear output
     */
    clear() {
        this.setDefaultState();
        console.log('🗑️ OutputPanel: Cleared');
    }

    /**
     * Get current output
     */
    getOutput() {
        return this.outputElement?.textContent || '';
    }

    /**
     * Check if output has content
     */
    hasContent() {
        return (this.outputElement?.textContent?.trim()?.length || 0) > 0;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Debug helper
     */
    debug() {
        if (!this.outputElement) {
            console.log('🔍 OutputPanel: Output element not found');
            return;
        }

        const computed = window.getComputedStyle(this.outputElement);
        console.log('🔍 OutputPanel Debug:', {
            element: this.outputElement,
            hasContent: this.hasContent(),
            contentLength: this.outputElement.textContent.length,
            contentPreview: this.outputElement.textContent.substring(0, 50),
            computedColor: computed.color,
            computedDisplay: computed.display,
            computedVisibility: computed.visibility,
            computedOpacity: computed.opacity,
            state: this.outputElement.getAttribute('data-state')
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutputPanel;
}
