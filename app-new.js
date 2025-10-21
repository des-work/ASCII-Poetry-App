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
        
        // Performance system
        const performanceManager = new PerformanceManager(window.AppConfig);
        
        // Button system
        const buttonController = new ButtonController(eventBus);
        
        // Input system
        const inputManager = new InputManager(eventBus, inputValidator);
        
        // Font switching system
        const fontSwitcher = new FontSwitcher(eventBus, fontManager, window.AppConfig);
        
        // Generation system
        const generationService = new GenerationService(fontManager, asciiRenderer, inputValidator, eventBus, performanceManager);
        
        // Output display system (NEW SIMPLIFIED)
        const outputRenderer = new OutputRenderer();
        const outputPanel = new OutputPanel();
        const displayManager = new DisplayManager(eventBus, outputPanel);
        
        // Output system (legacy)
        const outputManager = new OutputManager(eventBus, asciiRenderer);
        
        // UI Controller (NEW CLEAN DESIGN)
        // First, we need to cache DOM elements for InputReader
        const domCache = {
            textInput: document.getElementById('text-input'),
            imageInput: document.getElementById('image-input'),
            poemInput: document.getElementById('poem-input'),
            fontSelect: document.getElementById('font-select'),
            colorSelect: document.getElementById('color-select'),
            animationSelect: document.getElementById('animation-select'),
            imageWidthSlider: document.getElementById('image-width'),
            imageCharsSelect: document.getElementById('image-chars'),
            poetryLayoutSelect: document.getElementById('poetry-layout'),
            poetryDecorationSelect: document.getElementById('poetry-decoration')
        };
        
        const inputReader = new InputReader(domCache);
        const uiController = new UIController(eventBus, window.AppConfig, inputReader, inputValidator);
        
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

        // Step 5: Preload common fonts for better performance
        console.log('📦 Step 5: Preloading common fonts...');
        await performanceManager.preloadFonts(fontManager, ['standard', 'block', 'bubble', 'mini']);
        console.log('✅ Common fonts preloaded');

        // Step 6: Set initial mode
        console.log('📦 Step 6: Setting initial mode...');
        inputManager.switchMode('text');
        console.log('✅ Initial mode set to text');

        // Step 7: Expose components for debugging
        window.app = {
            eventBus,
            fontManager,
            asciiRenderer,
            inputValidator,
            performanceManager,
            buttonController,
            inputManager,
            fontSwitcher,
            generationService,
            displayManager,
            outputRenderer,
            outputPanel,
            outputManager,
            uiController,
            inputReader,
            // Debug helpers
            debugOutput: () => {
                displayManager.debug();
                outputRenderer.debug();
            },
            testOutput: (text = 'HELLO WORLD') => {
                outputRenderer.display(text, { color: 'none', animation: 'none' });
            },
            // Diagnostic helpers
            DiagnosticHelper,
            diagnose: () => {
                console.log('\n=== COMPREHENSIVE DIAGNOSTICS ===\n');
                DiagnosticHelper.traceCompleteFlow();
                console.log('\n');
                DiagnosticHelper.checkInputReading();
                console.log('\n');
                DiagnosticHelper.testRenderingSpeed();
                console.log('\n');
                DiagnosticHelper.checkEventSubscriptions();
                console.log('\n=== END DIAGNOSTICS ===\n');
            }
        };
        console.log('✅ Components exposed to window.app');

        // Step 8: Build badge
        try {
            const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
            const el = document.getElementById('build-id');
            if (el) el.textContent = buildId;
        } catch (_) {}

        // Step 9: Success message
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
  window.app.fontSwitcher - Font switching system
  window.app.performanceManager - Performance optimization
  window.app.performanceManager.getStats() - View cache statistics
  window.app.debugOutput() - Debug output element visibility
  window.app.testOutput('HELLO') - Test output with sample text
  window.app.diagnose() - Run comprehensive diagnostics
  window.app.DiagnosticHelper.checkInputReading() - Check text input
  window.app.DiagnosticHelper.checkOutputVisibility() - Check output element
  window.app.DiagnosticHelper.testRenderingSpeed() - Test render performance
  window.app.DiagnosticHelper.testGeneration('TEXT') - Manual generation test

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
