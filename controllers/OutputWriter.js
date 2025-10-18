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
		} catch (err) {
			console.error('OutputWriter: Render error', err);
		}
	}
}

// Export for CommonJS if needed
if (typeof module !== 'undefined' && module.exports) {
	module.exports = OutputWriter;
}


