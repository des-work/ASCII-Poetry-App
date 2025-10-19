/**
 * New Application Bootstrapper
 * Integrates the rebuilt input→generate→output system
 */

console.log('🚀 Initializing NEW ASCII Art Poetry Application...');

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Step 1: Create core modules
        console.log('📦 Step 1: Creating core modules...');
        const eventBus = new EventBus();
        const fontManager = new FontManager();
        const asciiRenderer = new ASCIIRenderer();
        const inputValidator = new InputValidator(window.AppConfig?.validation || {});
        console.log('✅ Core modules created');

        // Step 2: Create new system components
        console.log('📦 Step 2: Creating new system components...');
        
        // Button system
        const buttonController = new ButtonController(eventBus);
        
        // Input system
        const inputManager = new InputManager(eventBus, inputValidator);
        
        // Generation system
        const generationService = new GenerationService(fontManager, asciiRenderer, inputValidator, eventBus);
        
        // Output system
        const outputManager = new OutputManager(eventBus, asciiRenderer);
        
        // UI Controller (legacy system integration)
        const uiController = new UIController(eventBus, window.AppConfig, fontManager, asciiRenderer, inputValidator);
        
        console.log('✅ New system components created');

        // Step 3: Test system connections
        console.log('📦 Step 3: Testing system connections...');
        
        // Test button connections
        const buttonTest = buttonController.testButtons();
        console.log('Button test results:', buttonTest);

        // Test DOM elements
        const testElements = {
            'Text input': document.getElementById('text-input'),
            'Image input': document.getElementById('image-input'),
            'Poem input': document.getElementById('poem-input'),
            'Output area': document.getElementById('ascii-output'),
            'Generate button': document.getElementById('generate-main')
        };

        Object.entries(testElements).forEach(([name, element]) => {
            console.log(`  ${name}: ${element ? '✅ Found' : '❌ Missing'}`);
        });

        console.log('✅ System connections tested');

        // Step 4: Initialize theme
        console.log('📦 Step 4: Initializing theme...');
        try {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) {
                themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
            }
        } catch (error) {
            console.warn('Theme initialization failed:', error);
        }
        console.log('✅ Theme initialized');

        // Step 5: Set initial mode
        console.log('📦 Step 5: Setting initial mode...');
        inputManager.switchMode('text');
        console.log('✅ Initial mode set to text');

        // Step 6: Expose components for debugging
        window.app = {
            eventBus,
            fontManager,
            asciiRenderer,
            inputValidator,
            buttonController,
            inputManager,
            generationService,
            outputManager,
            uiController
        };
        console.log('✅ Components exposed to window.app');

        // Step 7: Build badge
        try {
            const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
            const el = document.getElementById('build-id');
            if (el) el.textContent = buildId;
        } catch (_) {}

        // Step 8: Success message
        console.log('\n' + '='.repeat(60));
        console.log('✅ NEW APPLICATION INITIALIZED SUCCESSFULLY');
        console.log('='.repeat(60));
        console.log(`
  /\\_/\\  (
 ( ^.^ ) _)
  \\"/  (
 ( | | )
(__d b__)

ASCII Art Poetry App v3.0
NEW SYSTEM OPERATIONAL!

🔧 Debug Commands:
  window.app.eventBus - Access event bus
  window.app.inputManager - Input management
  window.app.generationService - Generation service
  window.app.outputManager - Output management
  window.app.buttonController - Button controller

📝 Quick Test:
  window.app.eventBus.emit('request:text:gen', {
    text: 'TEST',
    fontName: 'standard',
    color: 'rainbow',
    animation: 'glow'
  });
`);

        // Step 9: Auto-test the system
        console.log('📦 Step 9: Running auto-test...');
        setTimeout(() => {
            console.log('🧪 Auto-testing text generation...');
            window.app.eventBus.emit('request:text:gen', {
                text: 'HELLO',
                fontName: 'standard',
                color: 'rainbow',
                animation: 'none'
            });
        }, 1000);

        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Fatal error during application initialization:', error);
        
        if (window.errorHandler) {
            window.errorHandler.showErrorNotification({
                type: 'Initialization Failure',
                message: 'The application could not start. Please try refreshing the page.'
            });
        } else {
            alert('A fatal error occurred. Please refresh the page.');
        }
    }
});
