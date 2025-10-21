/**
 * InputReader
 * Small helper focused on reading UI inputs and producing normalized
 * option objects for each generation mode. Keeps UIController lean.
 */
class InputReader {
	constructor(dom) {
		this.dom = dom;
		this.validateDOM();
		console.log('🧩 InputReader initialized');
	}

	/**
	 * Validate that required DOM elements exist
	 */
	validateDOM() {
		const required = {
			textInput: 'text-input',
			fontSelect: 'font-select',
			colorSelect: 'color-select',
			animationSelect: 'animation-select'
		};

		for (const [key, id] of Object.entries(required)) {
			if (!this.dom?.[key]) {
				console.warn(`⚠️ InputReader: DOM element "${key}" (#${id}) not found`);
				// Don't throw - just log. Some elements might be optional.
			}
		}
	}

	/**
	 * Read options for Text → ASCII generation.
	 * Returns { ok, options, error }
	 */
	readTextOptions() {
		// Validate DOM elements exist
		if (!this.dom?.textInput) {
			return {
				ok: false,
				options: null,
				error: '❌ Text input not found. Please refresh the page.'
			};
		}
		if (!this.dom?.fontSelect) {
			return {
				ok: false,
				options: null,
				error: '❌ Font selector not found. Please refresh the page.'
			};
		}
		if (!this.dom?.colorSelect) {
			return {
				ok: false,
				options: null,
				error: '❌ Color selector not found. Please refresh the page.'
			};
		}

		const text = this.dom.textInput.value ?? '';
		const fontName = this.dom.fontSelect.value ?? 'standard';
		const color = this.dom.colorSelect.value ?? 'none';
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
		// Validate input element exists
		if (!this.dom?.imageInput) {
			return { 
				ok: false, 
				options: null, 
				error: '❌ Image input not found. Please refresh the page.' 
			};
		}

		const file = this.dom.imageInput.files?.[0] ?? null;
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
		// Validate input element exists
		if (!this.dom?.poemInput) {
			return { 
				ok: false, 
				options: null, 
				error: '❌ Poem input not found. Please refresh the page.' 
			};
		}

		const poem = this.dom.poemInput.value ?? '';
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


