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
			
			// Clear any existing content and styles
			this.output.innerHTML = '';
			this.output.className = 'ascii-output';
			
			// Reset all styles
			this.output.style.color = '';
			this.output.style.background = '';
			this.output.style.webkitBackgroundClip = '';
			this.output.style.webkitTextFillColor = '';
			this.output.style.backgroundClip = '';
			
			// Set the ASCII content
			this.output.textContent = ascii;
			
			// Apply color styling
			if (color !== 'none') {
				this.applyColor(this.output, color);
			} else {
				// Ensure default white text is visible
				this.output.style.color = '#ffffff';
			}
			
			// Apply animation
			if (animation !== 'none') {
				this.output.classList.add(`animation-${animation}`);
			}
			
			console.log('🖨️ OutputComponent: rendered ascii', { 
				length: ascii.length, 
				color: color,
				hasContent: this.output.textContent.length > 0,
				computedColor: window.getComputedStyle(this.output).color
			});
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
			console.log(`🎨 Applied color: ${color} -> ${colorMap[color]}`);
		} else if (color === 'rainbow') {
			const text = element.textContent;
			const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff6b9d'];
			let html = '';
			for (let i = 0; i < text.length; i++) html += `<span style="color: ${colors[i % colors.length]}">${text[i]}</span>`;
			element.innerHTML = html;
			console.log('🌈 Applied rainbow effect');
		} else if (color === 'gradient') {
			element.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
			element.style.webkitBackgroundClip = 'text';
			element.style.webkitTextFillColor = 'transparent';
			element.style.backgroundClip = 'text';
			console.log('🎨 Applied gradient effect');
		}
	}

	// Debug method to inspect output element
	debug() {
		if (!this.output) {
			console.log('🔍 OutputComponent: No output element');
			return;
		}
		
		const computedStyle = window.getComputedStyle(this.output);
		console.log('🔍 OutputComponent Debug:', {
			element: this.output,
			textContent: this.output.textContent,
			textLength: this.output.textContent.length,
			innerHTML: this.output.innerHTML,
			className: this.output.className,
			computedColor: computedStyle.color,
			computedBackground: computedStyle.backgroundColor,
			computedOpacity: computedStyle.opacity,
			computedDisplay: computedStyle.display,
			computedVisibility: computedStyle.visibility,
			isEmpty: this.output.textContent.trim() === '',
			hasContent: this.output.textContent.length > 0
		});
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = OutputComponent;
}
