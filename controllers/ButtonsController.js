/**
 * ButtonsController
 * Single delegated controller for all button interactions.
 * Emits high-level UI events via EventBus to decouple UI from actions.
 */
class ButtonsController {
	constructor(eventBus, root = document) {
		this.eventBus = eventBus;
		this.root = root;
		this.onClick = this.onClick.bind(this);
		this.attach();
		console.log('🧭 ButtonsController attached');
	}

	attach() {
		this.root.addEventListener('click', this.onClick, true);
	}

	detach() {
		this.root.removeEventListener('click', this.onClick, true);
	}

	onClick(e) {
		try {
			const target = e.target;
			// Mode switch
			const modeBtn = target.closest?.('.mode-btn');
			if (modeBtn) {
				const mode = modeBtn.dataset.mode;
				console.log('🖱️ [ButtonsController] Mode click', { mode });
				if (mode) this.eventBus.emit('ui:mode:switch', { mode });
				return;
			}

			// Generate
			if (target.closest?.('#generate-main')) {
				console.log('🖱️ [ButtonsController] Generate click');
				this.eventBus.emit('ui:generate:click');
				return;
			}

			// Secondary actions
			if (target.closest?.('#copy-btn')) {
				console.log('🖱️ [ButtonsController] Copy click');
				this.eventBus.emit('ui:copy:click');
				return;
			}
			if (target.closest?.('#download-btn')) {
				console.log('🖱️ [ButtonsController] Download click');
				this.eventBus.emit('ui:download:click');
				return;
			}
			if (target.closest?.('#clear-btn')) {
				console.log('🖱️ [ButtonsController] Clear click');
				this.eventBus.emit('ui:clear:click');
				return;
			}
		} catch (err) {
			console.error('[ButtonsController] click handling error', err);
		}
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = ButtonsController;
}


