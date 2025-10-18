/**
 * InputReader
 * Small helper focused on reading UI inputs and producing normalized
 * option objects for each generation mode. Keeps UIController lean.
 */
class InputReader {
	constructor(dom) {
		this.dom = dom;
		console.log('🧩 InputReader initialized');
	}

	/**
	 * Read options for Text → ASCII generation.
	 * Returns { ok, options, error }
	 */
	readTextOptions() {
		const text = this.dom?.textInput?.value ?? '';
		const fontName = this.dom?.fontSelect?.value ?? 'standard';
		const color = this.dom?.colorSelect?.value ?? 'none';
		const animation = this.dom?.animationSelect?.value ?? 'none';

		if (!text || !text.trim()) {
			return { ok: false, options: null, error: 'Please enter some text to generate.' };
		}

		return {
			ok: true,
			options: { text, fontName, color, animation }
		};
	}

	/**
	 * Read options for Image → ASCII generation.
	 */
	readImageOptions() {
		const file = this.dom?.imageInput?.files?.[0] ?? null;
		const width = parseInt(this.dom?.imageWidthSlider?.value ?? '80', 10);
		const charSet = this.dom?.imageCharsSelect?.value ?? 'standard';

		if (!file) {
			return { ok: false, options: null, error: 'Please select an image first.' };
		}

		return { ok: true, options: { file, width, charSet } };
	}

	/**
	 * Read options for Poetry generation.
	 */
	readPoetryOptions() {
		const poem = this.dom?.poemInput?.value ?? '';
		const fontName = this.dom?.fontSelect?.value ?? 'mini';
		const layout = this.dom?.poetryLayoutSelect?.value ?? 'centered';
		const decoration = this.dom?.poetryDecorationSelect?.value ?? 'none';
		const color = this.dom?.colorSelect?.value ?? 'none';
		const animation = this.dom?.animationSelect?.value ?? 'none';
		const keywords = []; // Placeholder until keyword management is added

		if (!poem || !poem.trim()) {
			return { ok: false, options: null, error: 'Please enter a poem to generate.' };
		}

		return {
			ok: true,
			options: { poem, fontName, layout, decoration, color, animation, keywords }
		};
	}
}

// Export for CommonJS if needed
if (typeof module !== 'undefined' && module.exports) {
	module.exports = InputReader;
}


