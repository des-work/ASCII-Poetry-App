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
        console.log('📺 DisplayManager: Generation complete', {
            success: result.success,
            hasAscii: !!result.ascii,
            color: result.metadata?.color,
            animation: result.metadata?.animation
        });

        if (!result.success || !result.ascii) {
            console.warn('⚠️ DisplayManager: No ASCII to display');
            return;
        }

        this.currentOutput = result;

        // Display the ASCII art using OutputPanel
        const displayed = this.panel.display(result.ascii, {
            color: result.metadata?.color || 'none',
            animation: result.metadata?.animation || 'none'
        });

        if (displayed) {
            console.log('✅ DisplayManager: Output rendered successfully');
        } else {
            console.error('❌ DisplayManager: Failed to render output');
        }
    }

    /**
     * Handle generation errors
     */
    handleGenerationError(error) {
        console.error('❌ DisplayManager: Generation error', error);
        
        const message = typeof error === 'string' 
            ? error 
            : (error?.message || error?.error || 'Generation failed');
        
        this.showError(message);
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error('📺 DisplayManager: Error -', message);
        // Could emit notification event here if needed
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
