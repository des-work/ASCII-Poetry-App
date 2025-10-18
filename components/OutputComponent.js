class OutputComponent {
	constructor(outputElement, renderer) {
		this.output = outputElement;
		this.renderer = renderer;
	}

	render(data) {
		if (!this.output) {
			console.error('OutputComponent: missing output element');
			return;
		}
		try {
			// Delegate to OutputWriter-like routine to ensure visibility
			const { ascii, color = 'none', animation = 'none' } = data || {};
			if (!ascii) {
				console.warn('OutputComponent: no ascii to render');
				return;
			}
			this.output.textContent = ascii;
			this.output.className = 'ascii-output';
			this.output.style.color = color === 'none' ? '#ffffff' : '';
			this.output.style.background = '';
			this.output.style.webkitBackgroundClip = '';
			this.output.style.webkitTextFillColor = '';
			if (color !== 'none') this.applyColor(this.output, color);
			if (animation !== 'none') this.output.classList.add(`animation-${animation}`);
			console.log('🖨️ OutputComponent: rendered ascii', { length: ascii.length });
		} catch (err) {
			console.error('OutputComponent render error', err);
		}
	}

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
			for (let i = 0; i < text.length; i++) html += `<span style="color: ${colors[i % colors.length]}">${text[i]}</span>`;
			element.innerHTML = html;
		} else if (color === 'gradient') {
			element.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
			element.style.webkitBackgroundClip = 'text';
			element.style.webkitTextFillColor = 'transparent';
			element.style.backgroundClip = 'text';
		}
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = OutputComponent;
}
