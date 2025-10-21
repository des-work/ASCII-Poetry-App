/**
 * ASCII ART POETRY APPLICATION LAUNCHER
 * ======================================
 * 
 * Clean, organized bootstrapper for the ASCII Art Poetry Generator
 * Uses modern component architecture with clear separation of concerns
 * 
 * Component Loading Order:
 * 1. Core utilities (EventBus, FontManager, ASCIIRenderer)
 * 2. Services (GenerationService, PerformanceManager)
 * 3. UI Components (UIController, DisplayManager, OutputPanel)
 * 4. Utilities (FontSwitcher, DiagnosticHelper)
 */

console.log('🚀 ASCII ART POETRY - Initializing Application...\n');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting application initialization...');
        // ============================================================
        // PHASE 1: CORE UTILITIES
        // ============================================================
        console.log('📦 PHASE 1: Initializing core utilities...');

        // Check AppConfig availability
        if (!window.AppConfig) {
            console.error('❌ AppConfig not found! Make sure config/app.config.js is loaded before app-new.js');
            throw new Error('AppConfig not available');
        }

        const eventBus = new EventBus();
        const fontManager = new FontManager();
        const asciiRenderer = new ASCIIRenderer();
        const inputValidator = new InputValidator(window.AppConfig.validation || {});

        console.log('✅ Core utilities ready\n');

        // ============================================================
        // PHASE 2: SERVICES & MANAGERS
        // ============================================================
        console.log('📦 PHASE 2: Initializing services...');

        const performanceManager = new PerformanceManager(window.AppConfig);
        const generationService = new GenerationService(
            fontManager,
            asciiRenderer,
            inputValidator,
            eventBus,
            performanceManager
        );

        console.log('✅ Services initialized\n');

        // ============================================================
        // PHASE 3: UI COMPONENTS
        // ============================================================
        console.log('📦 PHASE 3: Initializing UI components...');

        // Output display system (clean, dedicated architecture)
        const outputPanel = new OutputPanel();
        const displayManager = new DisplayManager(eventBus, outputPanel);

        // Input reading system
        console.log('📦 Initializing input system...');

        // Wait a bit to ensure all DOM elements are loaded
        await new Promise(resolve => setTimeout(resolve, 100));

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

        // Check for critical DOM elements
        const criticalElements = ['textInput', 'fontSelect', 'colorSelect'];
        const missingElements = criticalElements.filter(key => !domCache[key]);

        if (missingElements.length > 0) {
            console.error('❌ Critical DOM elements missing:', missingElements);
            throw new Error(`Missing critical DOM elements: ${missingElements.join(', ')}`);
        }

        const inputReader = new InputReader(domCache);
        console.log('✅ Input system ready');
        
        // Main UI controller (clean, single-responsibility design)
        const uiController = new UIController(eventBus, window.AppConfig, inputReader, inputValidator, outputPanel);
        
        // Button interactions
        const buttonController = new ButtonController(eventBus);
        
        console.log('✅ UI components ready\n');

        // ============================================================
        // PHASE 4: ENHANCEMENTS
        // ============================================================
        console.log('📦 PHASE 4: Initializing enhancements...');
        
        const fontSwitcher = new FontSwitcher(eventBus, fontManager, window.AppConfig);
        const inputManager = new InputManager(eventBus, inputValidator);
        
        console.log('✅ Enhancements loaded\n');

        // ============================================================
        // PHASE 5: SYSTEM VERIFICATION
        // ============================================================
        console.log('📦 PHASE 5: Verifying system...');
        
        const systemCheck = {
            eventBus: !!eventBus,
            fontManager: !!fontManager,
            asciiRenderer: !!asciiRenderer,
            generationService: !!generationService,
            displayManager: !!displayManager,
            outputPanel: !!outputPanel,
            uiController: !!uiController,
            buttonController: !!buttonController
        };
        
        const allSystemsOK = Object.values(systemCheck).every(v => v);
        
        if (allSystemsOK) {
            console.log('✅ All systems verified\n');
        } else {
            console.warn('⚠️ Some systems failed verification:', systemCheck, '\n');
        }

        // ============================================================
        // PHASE 6: EXPOSE API
        // ============================================================
        console.log('📦 PHASE 6: Exposing public API...');
        
        window.app = {
            // Core services
            eventBus,
            fontManager,
            asciiRenderer,
            inputValidator,
            performanceManager,
            
            // UI components
            uiController,
            buttonController,
            inputManager,
            fontSwitcher,
            
            // Generation
            generationService,
            
            // Output
            displayManager,
            outputPanel,
            inputReader,
            
            // Utilities
            DiagnosticHelper,
            
            // Debug helpers
            debugOutput: () => {
                displayManager.debug();
                outputPanel.debug();
            },
            
            testOutput: (text = 'HELLO WORLD') => {
                outputPanel.display(text, { color: 'none', animation: 'none' });
            },
            
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
        
        console.log('✅ Public API ready\n');

        // ============================================================
        // PHASE 7: BUILD INFO
        // ============================================================
        console.log('📦 PHASE 7: Setting build info...');
        
        try {
            const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
            const el = document.getElementById('build-id');
            if (el) el.textContent = buildId;
            console.log(`Build: ${buildId}\n`);
        } catch (_) {}

        // ============================================================
        // STARTUP COMPLETE
        // ============================================================
        console.log('='.repeat(60));
        console.log('✅ APPLICATION INITIALIZED SUCCESSFULLY');
        console.log('='.repeat(60));
        
        console.log(`
  /\_/\  (
 ( ^.^ ) _)
  \"/  (
 ( | | )
(__d b__)

ASCII Art Poetry Application v3.0
CLEAN ARCHITECTURE READY

🔧 Available Commands:
  window.app.diagnose()           - Run comprehensive diagnostics
  window.app.testOutput('TEXT')   - Test output display
  window.app.debugOutput()        - Debug output components
  
📊 Components:
  window.app.uiController         - Main UI controller
  window.app.generationService    - Generation engine
  window.app.displayManager       - Display coordinator
  window.app.outputPanel          - Output display
  window.app.eventBus             - Event system

📝 Quick Test:
  window.app.testOutput('HELLO')
  window.app.eventBus.emit('request:text:gen', {
    text: 'TEST',
    fontName: 'standard',
    color: 'rainbow',
    animation: 'glow'
  });
        `);
        
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ FATAL ERROR - Application initialization failed');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        
        // Show user-friendly error message
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
