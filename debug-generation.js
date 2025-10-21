/**
 * Debug Generation Script
 * Run this in browser console to diagnose generation issues
 */

window.debugGeneration = {
    // Test 1: Check if app is loaded
    checkApp: function() {
        console.log('í´ Checking if app is loaded...');
        if (window.app) {
            console.log('âœ… window.app available');
            return true;
        } else {
            console.error('âŒ window.app not available');
            return false;
        }
    },

    // Test 2: Check components
    checkComponents: function() {
        console.log('í´ Checking core components...');
        const components = ['eventBus', 'uiController', 'generationService', 'displayManager', 'fontManager'];
        let allGood = true;
        
        components.forEach(comp => {
            if (window.app[comp]) {
                console.log(`âœ… ${comp} available`);
            } else {
                console.error(`âŒ ${comp} missing`);
                allGood = false;
            }
        });
        
        return allGood;
    },

    // Test 3: Check DOM elements
    checkDOM: function() {
        console.log('í´ Checking DOM elements...');
        const elements = ['text-input', 'generate-main', 'font-select', 'color-select', 'ascii-output'];
        let allGood = true;
        
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                console.log(`âœ… #${id} found`);
            } else {
                console.error(`âŒ #${id} missing`);
                allGood = false;
            }
        });
        
        return allGood;
    },

    // Test 4: Check event subscriptions
    checkEvents: function() {
        console.log('í´ Checking event subscriptions...');
        if (window.app?.eventBus?.debugSubscriptions) {
            const stats = window.app.eventBus.debugSubscriptions();
            console.log('í³Š Event subscriptions:', stats);
            return Object.keys(stats).length > 0;
        } else {
            console.error('âŒ EventBus not available for checking');
            return false;
        }
    },

    // Test 5: Test button click
    testButtonClick: function() {
        console.log('í´ Testing button click...');
        const btn = document.getElementById('generate-main');
        if (!btn) {
            console.error('âŒ Generate button not found');
            return false;
        }

        // Listen for button event
        window.app.eventBus.on('ui:generate:click', () => {
            console.log('âœ… Button click event received');
        });

        // Click the button
        btn.click();
        console.log('í¶±ï¸ Button clicked');
        
        // Clean up after 1 second
        setTimeout(() => {
            window.app.eventBus.off('ui:generate:click');
        }, 1000);
        
        return true;
    },

    // Test 6: Test direct generation
    testDirectGeneration: async function() {
        console.log('í´ Testing direct generation...');
        
        if (!window.app?.generationService) {
            console.error('âŒ GenerationService not available');
            return false;
        }

        try {
            // Listen for generation events
            window.app.eventBus.on('text:gen:start', () => {
                console.log('âœ… Generation started');
            });
            
            window.app.eventBus.on('text:gen:complete', (result) => {
                console.log('âœ… Generation completed:', result.ascii?.length || 0, 'characters');
            });
            
            window.app.eventBus.on('text:gen:error', (error) => {
                console.error('âŒ Generation error:', error);
            });

            // Generate directly
            const result = await window.app.generationService.generateText({
                text: 'DEBUG',
                fontName: 'standard',
                color: 'none',
                animation: 'none'
            });

            // Clean up
            setTimeout(() => {
                window.app.eventBus.off('text:gen:start');
                window.app.eventBus.off('text:gen:complete');
                window.app.eventBus.off('text:gen:error');
            }, 2000);

            return !!result;
            
        } catch (error) {
            console.error('âŒ Direct generation failed:', error.message);
            return false;
        }
    },

    // Test 7: Check font loading
    checkFonts: function() {
        console.log('í´ Checking font loading...');
        
        if (!window.app?.fontManager) {
            console.error('âŒ FontManager not available');
            return false;
        }

        try {
            const font = window.app.fontManager.getFont('standard');
            if (font && font.A) {
                console.log(`âœ… Font loaded: ${font.A.length} lines for 'A'`);
                return true;
            } else {
                console.error('âŒ Font not loaded properly');
                return false;
            }
        } catch (error) {
            console.error('âŒ Font loading error:', error.message);
            return false;
        }
    },

    // Test 8: Check UI state
    checkUIState: function() {
        console.log('í´ Checking UI state...');
        
        if (!window.app?.uiController?.state) {
            console.error('âŒ UIController state not available');
            return false;
        }

        const state = window.app.uiController.state;
        console.log('í¾® UI State:', state);
        
        const btn = document.getElementById('generate-main');
        if (btn) {
            console.log(`í´˜ Generate button: disabled=${btn.disabled}`);
        }
        
        return true;
    },

    // Run all tests
    runAllTests: async function() {
        console.log('íº€ Running comprehensive diagnostic...\n');

        const results = {
            app: this.checkApp(),
            components: this.checkComponents(),
            dom: this.checkDOM(),
            events: this.checkEvents(),
            fonts: this.checkFonts(),
            uiState: this.checkUIState(),
            buttonClick: this.testButtonClick()
        };

        console.log('\ní³Š Test Results:');
        Object.entries(results).forEach(([test, result]) => {
            console.log(`${result ? 'âœ…' : 'âŒ'} ${test}`);
        });

        // Try direct generation if other tests pass
        if (results.app && results.components && results.fonts) {
            console.log('\ní¾¨ Testing direct generation...');
            await this.testDirectGeneration();
        }

        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        console.log(`\ní³ˆ Overall: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests < totalTests) {
            console.log('âŒ Some tests failed. Check the errors above.');
        } else {
            console.log('âœ… All tests passed! The issue might be elsewhere.');
        }
    }
};

// Auto-run the comprehensive test
console.log('í´§ Debug tools loaded. Run: debugGeneration.runAllTests()');
