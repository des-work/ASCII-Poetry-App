/**
 * Application Bootstrapper
 *
 * This script initializes the entire application in a controlled sequence,
 * ensuring all dependencies are ready and providing robust error handling
 * for a resilient startup process.
 */

console.log('🚀 Initializing ASCII Art Poetry Application...');

document.addEventListener('DOMContentLoaded', () => {
    // The global errorHandler is loaded first in index.html and is already active.

    try {
        // Step 1: Instantiate core modules and services.
        const eventBus = new EventBus();
        const fontManager = new FontManager();
        const asciiRenderer = new ASCIIRenderer();
        const inputValidator = new InputValidator(window.AppConfig?.validation || {});

        // The service layer contains the core business logic.
        const asciiGeneratorService = new ASCIIGeneratorService(
            fontManager,
            asciiRenderer,
            inputValidator,
            eventBus
        );

        // Step 2: Instantiate the UI Controller, which now manages the entire UI.
        const uiController = new UIController(eventBus, window.AppConfig, fontManager, asciiRenderer);

        // Step 3: Expose core components for debugging.
        window.app = { services: { asciiGeneratorService }, controllers: { uiController } };

        // Step 3: Log success message to the console.
        console.log('✅ Application initialized successfully.');
        console.log('💡 Tip: Open DevTools Console to see debug logs and use `window.app` to inspect the application state.');
        console.log(`
  /\\_/\\  (
 ( ^.^ ) _)
   \\"/  (
 ( | | )
(__d b__)
ASCII Art Poetry App
Buttons should be working!

Debug commands:
  window.app.controllers.ui - Access the UI Controller instance
  window.app.services.asciiGeneratorService - Access the generation service
  window.app.services.asciiGeneratorService.fontManager.getFont("standard") - Get a font
`);

    } catch (error) {
        // This catch block handles errors specifically from the ASCIIArtGenerator constructor.
        console.error('❌ A fatal error occurred during application initialization:', error);

        // Use the global error handler to display a user-friendly message.
        if (window.errorHandler) {
            window.errorHandler.showErrorNotification({
                type: 'Initialization Failure',
                message: 'The application could not start. Please try refreshing the page. If the problem persists, check the console for details.'
            });
        } else {
            // Fallback if the global error handler itself failed.
            alert('A fatal error occurred. Please refresh the page.');
        }
    }
});