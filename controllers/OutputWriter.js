/**
 * OutputWriter
 * Focused helper for rendering ASCII output and applying visual effects.
 * Thin wrapper around renderer with added safety checks and logs.
 */
class OutputWriter {
	constructor(renderer, outputElement) {
		this.renderer = renderer;
		this.output = outputElement;
		console.log('🧩 OutputWriter initialized');
	}

	/**
	 * Render ASCII data safely to the output element.
 	* data: { ascii, color, animation }
	 */
	render(data) {
		if (!this.output) {
			console.error('OutputWriter: No output element available');
			return;
		}
		if (!data || !data.ascii) {
			console.error('OutputWriter: No ASCII content to render');
			return;
		}
		try {
			this.renderer.renderToElement(this.output, data);
			console.log('🖨️ OutputWriter: Render complete', { length: data.ascii.length });
		} catch (error) {
			console.error('OutputWriter: Render error', error);
		}
	}

	/**
	 * Renders ASCII art directly to a DOM element with specified options.
	 * @param {HTMLElement} element - The DOM element to render into.
	 * @param {Object} data - The data to render.
	 */
	renderToElement(element, data) {
		const { ascii, color = 'none', animation = 'none' } = data;

		// Reset element state
		element.textContent = ascii;
		element.className = 'ascii-output'; // Reset classes
		element.style.color = ''; // Reset inline color
		element.style.background = ''; // Reset background for gradients
		element.style.webkitBackgroundClip = '';
		element.style.webkitTextFillColor = '';

		// Apply color and animation
		if (color !== 'none') {
			this.applyColor(element, color);
		}
		if (animation !== 'none') {
			element.classList.add(`animation-${animation}`);
		}
	}

	/**
	 * Applies a color scheme to a DOM element.
	 * @param {HTMLElement} element - The element to apply color to.
	 * @param {string} color - The name of the color scheme.
	 */
	applyColor(element, color) {
		const colorMap = {
			red: '#ff6b6b', green: '#51cf66', blue: '#4dabf7',
			yellow: '#ffd43b', purple: '#cc5de8', cyan: '#22b8cf',
			magenta: '#ff6b9d', gold: '#ffd700', silver: '#c0c0c0'
		};

		if (colorMap[color]) {
			element.style.color = colorMap[color];
		} else if (color === 'rainbow') {
			const text = element.textContent;
			const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff6b9d'];
			let html = '';
			for (let i = 0; i < text.length; i++) {
				html += `<span style="color: ${colors[i % colors.length]}">${text[i]}</span>`;
			}
			element.innerHTML = html;
		} else if (color === 'gradient') {
			element.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
			element.style.webkitBackgroundClip = 'text';
			element.style.webkitTextFillColor = 'transparent';
			element.style.backgroundClip = 'text';
		}
	}
}

// Export for CommonJS if needed
if (typeof module !== 'undefined' && module.exports) {
	module.exports = OutputWriter;
}