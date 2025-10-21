/**
 * Diagnostic Helper
 * Comprehensive debugging tool to verify all aspects of the generation flow
 */

class DiagnosticHelper {
    /**
     * Check if text input is being read correctly
     */
    static checkInputReading() {
        const textInput = document.getElementById('text-input');
        const fontSelect = document.getElementById('font-select');
        const colorSelect = document.getElementById('color-select');
        
        console.log('🔍 INPUT READING DIAGNOSTIC:');
        console.log('  Text Input Element:', textInput ? '✅ Found' : '❌ Missing');
        console.log('  Text Input Value:', textInput?.value || '(empty)');
        console.log('  Text Input Trimmed:', textInput?.value?.trim() || '(empty)');
        console.log('  Font Select:', fontSelect ? '✅ Found' : '❌ Missing');
        console.log('  Font Select Value:', fontSelect?.value || 'standard');
        console.log('  Color Select:', colorSelect ? '✅ Found' : '❌ Missing');
        console.log('  Color Select Value:', colorSelect?.value || 'none');
    }

    /**
     * Check output element visibility
     */
    static checkOutputVisibility() {
        const output = document.getElementById('ascii-output');
        
        if (!output) {
            console.log('🔍 OUTPUT VISIBILITY: ❌ Element not found');
            return;
        }

        const computed = window.getComputedStyle(output);
        const hasContent = output.textContent.trim().length > 0;

        console.log('🔍 OUTPUT VISIBILITY DIAGNOSTIC:');
        console.log('  Element Found:', '✅');
        console.log('  Has Content:', hasContent ? '✅' : '❌');
        console.log('  Content Length:', output.textContent.length);
        console.log('  Computed Display:', computed.display);
        console.log('  Computed Visibility:', computed.visibility);
        console.log('  Computed Opacity:', computed.opacity);
        console.log('  Computed Color:', computed.color);
        console.log('  Computed Background Color:', computed.backgroundColor);
        console.log('  Class:', output.className);
        console.log('  Content Preview:', output.textContent.substring(0, 100));
    }

    /**
     * Test rendering performance
     */
    static testRenderingSpeed() {
        console.log('🔍 RENDERING SPEED DIAGNOSTIC:');
        
        const renderer = window.app?.asciiRenderer;
        if (!renderer) {
            console.log('  ❌ ASCIIRenderer not available');
            return;
        }

        const fontManager = window.app?.fontManager;
        if (!fontManager) {
            console.log('  ❌ FontManager not available');
            return;
        }

        const testText = 'HELLO';
        const font = fontManager.getFont('standard');

        const start = performance.now();
        const result = renderer.renderTextWithFont(testText, font);
        const end = performance.now();

        console.log('  Test Text:', testText);
        console.log('  Font:', 'standard');
        console.log('  Render Time:', (end - start).toFixed(2) + 'ms');
        console.log('  Result Length:', result.length);
        console.log('  Result Preview:', result.substring(0, 50));
    }

    /**
     * Trace complete flow
     */
    static traceCompleteFlow() {
        console.log('🔍 COMPLETE FLOW TRACE:');
        
        const textInput = document.getElementById('text-input');
        const button = document.getElementById('generate-main');
        
        console.log('\n1️⃣ INPUT CHECK:');
        console.log('   Text:', textInput?.value || '(empty)');
        
        console.log('\n2️⃣ BUTTON CHECK:');
        console.log('   Button Found:', button ? '✅' : '❌');
        console.log('   Button Disabled:', button?.disabled ? 'Yes' : 'No');
        
        console.log('\n3️⃣ OUTPUT CHECK:');
        this.checkOutputVisibility();
        
        console.log('\n4️⃣ SERVICES CHECK:');
        console.log('   EventBus:', window.app?.eventBus ? '✅' : '❌');
        console.log('   GenerationService:', window.app?.generationService ? '✅' : '❌');
        console.log('   DisplayManager:', window.app?.displayManager ? '✅' : '❌');
        console.log('   FontManager:', window.app?.fontManager ? '✅' : '❌');
    }

    /**
     * Test full generation manually
     */
    static async testGeneration(testText = 'TEST') {
        console.log('🔍 MANUAL GENERATION TEST:');
        console.log('  Input Text:', testText);
        
        const app = window.app;
        if (!app || !app.generationService) {
            console.log('  ❌ GenerationService not available');
            return;
        }

        try {
            const start = performance.now();
            
            await app.generationService.generateText({
                text: testText,
                fontName: 'standard',
                color: 'none',
                animation: 'none'
            });
            
            const end = performance.now();
            console.log('  Generation Time:', (end - start).toFixed(2) + 'ms');
            
            // Check output
            setTimeout(() => {
                this.checkOutputVisibility();
            }, 100);
            
        } catch (error) {
            console.error('  ❌ Generation Error:', error);
        }
    }

    /**
     * Verify all event subscriptions
     */
    static checkEventSubscriptions() {
        console.log('🔍 EVENT SUBSCRIPTIONS CHECK:');
        
        const eventBus = window.app?.eventBus;
        if (!eventBus) {
            console.log('  ❌ EventBus not available');
            return;
        }

        console.log('  EventBus.Events.TEXT_GENERATION_COMPLETE:', 'text:gen:complete');
        console.log('  EventBus.Events.TEXT_GENERATION_START:', 'text:gen:start');
        console.log('  EventBus.Events.REQUEST_TEXT_GENERATION:', 'request:text:gen');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiagnosticHelper;
}
