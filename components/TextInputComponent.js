/**
 * TextInputComponent - Handles text input functionality
 * Manages text input, validation, and state
 */

class TextInputComponent {
    constructor(eventBus, inputValidator) {
        this.eventBus = eventBus;
        this.validator = inputValidator;
        this.dom = {};
        this.state = {
            currentText: '',
            isValid: false
        };
        this.init();
    }

    init() {
        console.log('Ì≥ù TextInputComponent: Initializing...');
        this.cacheDOM();
        this.attachEventListeners();
        this.updateState();
        console.log('‚úÖ TextInputComponent: Initialized');
    }

    cacheDOM() {
        this.dom.textInput = document.getElementById('text-input');
        if (!this.dom.textInput) {
            console.error('‚ùå TextInputComponent: Text input element not found');
        }
    }

    attachEventListeners() {
        if (!this.dom.textInput) return;

        // Input validation on change
        this.dom.textInput.addEventListener('input', () => {
            this.updateState();
            this.emitTextChange();
        });

        // Enter key handling
        this.dom.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.triggerGeneration();
            }
        });

        console.log('Ì¥ó TextInputComponent: Event listeners attached');
    }

    updateState() {
        if (!this.dom.textInput) return;

        const text = this.dom.textInput.value || '';
        const validation = this.validator.validateText(text);
        
        this.state.currentText = text;
        this.state.isValid = validation.valid;

        console.log('Ì≥ù TextInputComponent: State updated', {
            length: text.length,
            isValid: this.state.isValid
        });
    }

    emitTextChange() {
        this.eventBus.emit('text:input:changed', {
            text: this.state.currentText,
            isValid: this.state.isValid
        });
    }

    triggerGeneration() {
        if (this.state.isValid) {
            this.eventBus.emit('ui:generate:click');
        } else {
            this.showValidationError();
        }
    }

    showValidationError() {
        if (this.state.currentText.trim()) {
            this.eventBus.emit('ui:notification', {
                message: 'Please enter valid text to generate ASCII art',
                type: 'warning'
            });
        }
    }

    getText() {
        return this.state.currentText;
    }

    setText(text) {
        if (this.dom.textInput) {
            this.dom.textInput.value = text;
            this.updateState();
            this.emitTextChange();
        }
    }

    isValid() {
        return this.state.isValid;
    }

    focus() {
        if (this.dom.textInput) {
            this.dom.textInput.focus();
        }
    }

    clear() {
        this.setText('');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextInputComponent;
}
