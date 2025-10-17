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
        console.log('📦 Step 1: Creating core modules...');
        const eventBus = new EventBus();
        const fontManager = new FontManager();
        const asciiRenderer = new ASCIIRenderer();
        const inputValidator = new InputValidator(window.AppConfig?.validation || {});
        console.log('✅ Core modules created');

        // The service layer contains the core business logic.
        console.log('📦 Step 2: Creating service layer...');
        const asciiGeneratorService = new ASCIIGeneratorService(
            fontManager,
            asciiRenderer,
            inputValidator,
            eventBus
        );
        console.log('✅ Service layer created');

        // Step 3: Instantiate the UI Controller with all its dependencies.
        console.log('📦 Step 3: Creating UI controller...');
        const uiController = new UIController(eventBus, window.AppConfig || {}, fontManager, asciiRenderer);
        console.log('✅ UI controller created');

        // Step 4: Finalize subscriptions after all components are created.
        // This ensures the UIController listens for events emitted by the service.
        // This is the critical fix to ensure the UI receives generation results.
        console.log('📦 Step 4: Finalizing event subscriptions...');
        uiController.subscribeToEvents();
        console.log('✅ Event subscriptions finalized');

        // Step 5: Expose core components for debugging.
        window.app = { 
            eventBus,
            fontManager,
            asciiRenderer,
            inputValidator,
            services: { asciiGeneratorService }, 
            controllers: { ui: uiController } 
        };
        console.log('✅ Components exposed to window.app');
        
        // Step 6: Test button connections
        console.log('🔧 Testing button connections...');
        const generateBtn = document.getElementById('generate-main');
        const copyBtn = document.getElementById('copy-btn');
        const downloadBtn = document.getElementById('download-btn');
        const clearBtn = document.getElementById('clear-btn');
        
        console.log('  Generate button:', generateBtn ? '✅ Found' : '❌ Missing');
        console.log('  Copy button:', copyBtn ? '✅ Found' : '❌ Missing');
        console.log('  Download button:', downloadBtn ? '✅ Found' : '❌ Missing');
        console.log('  Clear button:', clearBtn ? '✅ Found' : '❌ Missing');

        // Step 7: Log success message to the console.
        console.log('\n' + '='.repeat(60));
        console.log('✅ APPLICATION INITIALIZED SUCCESSFULLY');
        console.log('='.repeat(60));
        console.log(`
  /\\_/\\  (
 ( ^.^ ) _)
   \\"/  (
 ( | | )
(__d b__)

ASCII Art Poetry App v2.0
All systems operational!

🔧 Debug Commands:
  window.app.eventBus - Access event bus
  window.app.fontManager - Font management
  window.app.controllers.ui - UI controller
  window.app.services.asciiGeneratorService - Generation service

📝 Quick Test:
  window.app.eventBus.emit(EventBus.Events.REQUEST_TEXT_GENERATION, {
    text: 'TEST',
    fontName: 'standard',
    color: 'rainbow',
    animation: 'glow'
  });
`);
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        // This catch block handles any fatal errors during the application's startup sequence.
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