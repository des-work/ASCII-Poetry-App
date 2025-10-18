class InputComponent {
	constructor(dom) {
		this.dom = dom;
	}

	readText() {
		const text = this.dom?.textInput?.value ?? '';
		const fontName = this.dom?.fontSelect?.value ?? 'standard';
		const color = this.dom?.colorSelect?.value ?? 'none';
		const animation = this.dom?.animationSelect?.value ?? 'none';
		return { text, fontName, color, animation };
	}

	readImage() {
		const file = this.dom?.imageInput?.files?.[0] ?? null;
		const width = parseInt(this.dom?.imageWidthSlider?.value ?? '80', 10);
		const charSet = this.dom?.imageCharsSelect?.value ?? 'standard';
		return { file, width, charSet };
	}

	readPoetry(keywords = []) {
		const poem = this.dom?.poemInput?.value ?? '';
		const fontName = this.dom?.fontSelect?.value ?? 'mini';
		const layout = this.dom?.poetryLayoutSelect?.value ?? 'centered';
		const decoration = this.dom?.poetryDecorationSelect?.value ?? 'none';
		const color = this.dom?.colorSelect?.value ?? 'none';
		const animation = this.dom?.animationSelect?.value ?? 'none';
		return { poem, fontName, layout, decoration, color, animation, keywords };
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = InputComponent;
}
