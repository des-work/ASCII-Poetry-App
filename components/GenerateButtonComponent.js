/**
 * GenerateButtonComponent - Handles generate button functionality
 * Manages button state, validation, and generation triggering
 */

class GenerateButtonComponent {
    constructor(eventBus, textInputComponent) {
        this.eventBus = eventBus;
        this.textInputComponent = textInputComponent;
        this.dom = {};
        this.state = {
            isEnabled: false,
            isGenerating: false,
            canGenerate: false
        };
        this.init();
    }

    init() {
        console.log('Ì¥ò GenerateButtonComponent: Initializing...');
        this.cacheDOM();
        this.attachEventListeners();
        this.subscribeToEvents();
        this.updateState();
        console.log('‚úÖ GenerateButtonComponent: Initialized');
    }

    cacheDOM() {
        this.dom.generateBtn = document.getElementById('generate-main');
        if (!this.dom.generateBtn) {
            console.error('‚ùå GenerateButtonComponent: Generate button element not found');
        }
    }

    attachEventListeners() {
        if (!this.dom.generateBtn) return;

        // Handle button clicks (backup to event delegation)
        this.dom.generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClick();
        });

        console.log('Ì¥ó GenerateButtonComponent: Event listeners attached');
    }

    subscribeToEvents() {
        // Listen for text input changes
        this.eventBus.on('text:input:changed', (data) => {
            this.state.canGenerate = data.isValid;
            this.updateState();
        });

        // Listen for generation state changes
        this.eventBus.on('text:gen:start', () => {
            this.state.isGenerating = true;
            this.updateState();
        });

        this.eventBus.on('text:gen:complete', () => {
            this.state.isGenerating = false;
            this.updateState();
        });

        this.eventBus.on('text:gen:error', () => {
            this.state.isGenerating = false;
            this.updateState();
        });

        console.log('Ì¥ó GenerateButtonComponent: Event subscriptions complete');
    }

    handleClick() {
        if (this.state.isGenerating) {
            this.eventBus.emit('ui:notification', {
                message: '‚è≥ Please wait for current generation to complete',
                type: 'warning'
            });
            return;
        }

        if (!this.state.canGenerate) {
            this.eventBus.emit('ui:notification', {
                message: '‚ö†Ô∏è Please enter text to generate ASCII art',
                type: 'warning'
            });
            return;
        }

        // Trigger generation
        this.eventBus.emit('ui:generate:click');
    }

    updateState() {
        if (!this.dom.generateBtn) return;

        this.state.isEnabled = this.state.canGenerate && !this.state.isGenerating;

        // Update button appearance
        this.dom.generateBtn.disabled = !this.state.isEnabled;
        this.dom.generateBtn.classList.toggle('disabled', !this.state.isEnabled);
        this.dom.generateBtn.classList.toggle('generating', this.state.isGenerating);

        console.log('Ì¥ò GenerateButtonComponent: State updated', {
            isEnabled: this.state.isEnabled,
            isGenerating: this.state.isGenerating,
            canGenerate: this.state.canGenerate
        });
    }

    enable() {
        this.state.canGenerate = true;
        this.state.isGenerating = false;
        this.updateState();
    }

    disable() {
        this.state.canGenerate = false;
        this.updateState();
    }

    setGenerating(isGenerating) {
        this.state.isGenerating = isGenerating;
        this.updateState();
    }

    isEnabled() {
        return this.state.isEnabled;
    }

    isGenerating() {
        return this.state.isGenerating;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GenerateButtonComponent;
}
