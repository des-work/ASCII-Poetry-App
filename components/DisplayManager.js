/**
 * Display Manager
 * Coordinates output rendering with event-driven architecture
 * Now uses the dedicated OutputPanel component
 */

class DisplayManager {
    constructor(eventBus, outputPanel) {
        this.eventBus = eventBus;
        this.panel = outputPanel;
        this.currentOutput = null;
        
        this.initialize();
    }

    /**
     * Initialize and subscribe to events
     */
    initialize() {
        // Subscribe to generation completion events
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => {
            this.handleGenerationComplete(result);
        });
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_COMPLETE, (result) => {
            this.handleGenerationComplete(result);
        });
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_COMPLETE, (result) => {
            this.handleGenerationComplete(result);
        });

        // Subscribe to generation errors
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_ERROR, (error) => {
            this.handleGenerationError(error);
        });
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_ERROR, (error) => {
            this.handleGenerationError(error);
        });
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_ERROR, (error) => {
            this.handleGenerationError(error);
        });

        console.log('✅ DisplayManager initialized');
    }

    /**
     * Handle successful generation
     */
    handleGenerationComplete(result) {
        try {
            console.log('📺 DisplayManager: Generation complete', {
                success: result.success,
                hasAscii: !!result.ascii,
                color: result.metadata?.color,
                animation: result.metadata?.animation
            });

            // Validate result structure
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid result object');
            }

            if (!result.success || !result.ascii) {
                console.warn('⚠️ DisplayManager: No ASCII to display');
                this.panel.setDefaultState();
                return;
            }

            this.currentOutput = result;

            // Display the ASCII art using OutputPanel with error handling
            const displayed = this.panel.display(result.ascii, {
                color: result.metadata?.color || 'none',
                animation: result.metadata?.animation || 'none'
            });

            if (displayed) {
                console.log('✅ DisplayManager: Output rendered successfully');
            } else {
                console.error('❌ DisplayManager: Failed to render output');
                this.showError('Failed to display output');
            }
        } catch (error) {
            console.error('❌ DisplayManager: Error displaying output:', error);
            this.panel.setDefaultState();
            this.showError(`Display error: ${error.message}`);
        }
    }

    /**
     * Handle generation errors
     */
    handleGenerationError(error) {
        try {
            console.error('❌ DisplayManager: Generation error', error);
            
            // Safely extract error message
            let message = 'Generation failed';
            if (typeof error === 'string') {
                message = error;
            } else if (error && typeof error === 'object') {
                message = error.message || error.error || error.toString();
            }
            
            // Ensure message is a string
            if (typeof message !== 'string') {
                message = 'An unknown error occurred';
            }
            
            this.panel.setDefaultState();
            this.showError(message);
        } catch (handlerError) {
            console.error('❌ DisplayManager: Error handling generation error:', handlerError);
            this.panel.setDefaultState();
            this.showError('An error occurred while processing your request');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        try {
            if (typeof message !== 'string') {
                message = 'An error occurred';
            }
            console.error('📺 DisplayManager: Error -', message);
            // Emit notification event for user feedback
            this.eventBus.emit(EventBus.Events.NOTIFICATION_SHOW, {
                message: `❌ ${message}`,
                type: 'error'
            });
        } catch (error) {
            console.error('❌ DisplayManager: Error showing error message:', error);
        }
    }

    /**
     * Clear output
     */
    clear() {
        this.panel.clear();
        this.currentOutput = null;
        console.log('🗑️ DisplayManager: Cleared output');
    }

    /**
     * Get current output
     */
    getOutput() {
        return this.currentOutput;
    }

    /**
     * Debug helper
     */
    debug() {
        console.log('🔍 DisplayManager Debug:', {
            hasCurrentOutput: !!this.currentOutput,
            panelHasContent: this.panel.hasContent(),
            panelOutput: this.panel.getOutput().substring(0, 100)
        });
        this.panel.debug();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayManager;
}
