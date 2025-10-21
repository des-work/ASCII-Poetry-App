/**
 * InputPanelComponent - Coordinates all input-related components
 * Manages the interaction between TextInput, GenerateButton, and FontSelector
 */

class InputPanelComponent {
    constructor(eventBus, fontManager, inputValidator) {
        this.eventBus = eventBus;
        this.fontManager = fontManager;
        this.validator = inputValidator;
        this.components = {};
        this.init();
    }

    init() {
        console.log('��� InputPanelComponent: Initializing...');
        
        // Initialize sub-components
        this.components.textInput = new TextInputComponent(this.eventBus, this.validator);
        this.components.generateButton = new GenerateButtonComponent(this.eventBus, this.components.textInput);
        this.components.fontSelector = new FontSelectorComponent(this.eventBus, this.fontManager);

        this.subscribeToEvents();
        this.setupComponentCommunication();
        
        console.log('✅ InputPanelComponent: Initialized');
    }

    subscribeToEvents() {
        // Listen for font changes to trigger regeneration
        this.eventBus.on('font:changed', (data) => {
            if (this.components.textInput.isValid()) {
                // Auto-regenerate with new font if text is valid
                this.eventBus.emit('ui:generate:click');
            }
        });

        // Listen for state changes to maintain synchronization
        this.eventBus.on('ui:mode:switch', (data) => {
            this.syncComponentStates();
        });

        // Listen for generation state changes
        this.eventBus.on('text:gen:start', () => {
            this.components.generateButton.setGenerating(true);
        });

        this.eventBus.on('text:gen:complete', () => {
            this.components.generateButton.setGenerating(false);
        });

        this.eventBus.on('text:gen:error', () => {
            this.components.generateButton.setGenerating(false);
        });

        console.log('🔗 InputPanelComponent: Event subscriptions complete');
    }

    setupComponentCommunication() {
        // Set up communication between components
        this.components.textInput.focus(); // Focus text input on load
        this.updateGenerateButtonState();
    }

    updateGenerateButtonState() {
        const canGenerate = this.components.textInput.isValid();
        if (canGenerate) {
            this.components.generateButton.enable();
        } else {
            this.components.generateButton.disable();
        }
    }

    syncComponentStates() {
        // Synchronize component states when mode changes
        this.updateGenerateButtonState();

        // Ensure text input validation is current
        this.components.textInput.updateState();

        // Update font selector if needed
        this.components.fontSelector.updateLoadingState();

        console.log('🔄 InputPanelComponent: Component states synchronized');
    }

    // Public API for external access
    getTextInputComponent() {
        return this.components.textInput;
    }

    getGenerateButtonComponent() {
        return this.components.generateButton;
    }

    getFontSelectorComponent() {
        return this.components.fontSelector;
    }

    getCurrentText() {
        return this.components.textInput.getText();
    }

    getCurrentFont() {
        return this.components.fontSelector.getCurrentFont();
    }

    setText(text) {
        this.components.textInput.setText(text);
    }

    clearAll() {
        this.components.textInput.clear();
        this.components.generateButton.setGenerating(false);
    }

    refresh() {
        this.components.fontSelector.refreshFonts();
        this.updateGenerateButtonState();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputPanelComponent;
}
