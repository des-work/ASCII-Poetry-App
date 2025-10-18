/**
 * ButtonController - New Simplified Button System
 * Handles all button interactions with proper event delegation
 */

class ButtonController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🔘 ButtonController: Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachListeners());
        } else {
            this.attachListeners();
        }
        
        this.isInitialized = true;
        console.log('✅ ButtonController: Initialized');
    }

    attachListeners() {
        // Use event delegation on document body
        document.body.addEventListener('click', this.handleClick.bind(this));
        
        // Also attach to specific elements for reliability
        this.attachSpecificListeners();
        
        console.log('🔗 ButtonController: Event listeners attached');
    }

    attachSpecificListeners() {
        // Mode buttons
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = btn.dataset.mode;
                console.log('🖱️ Mode button clicked:', mode);
                if (mode) {
                    this.eventBus.emit('ui:mode:switch', { mode });
                }
            });
        });

        // Generate button
        const generateBtn = document.getElementById('generate-main');
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Generate button clicked');
                this.eventBus.emit('ui:generate:click');
            });
        }

        // Action buttons
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Copy button clicked');
                this.eventBus.emit('ui:copy:click');
            });
        }

        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Download button clicked');
                this.eventBus.emit('ui:download:click');
            });
        }

        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Clear button clicked');
                this.eventBus.emit('ui:clear:click');
            });
        }

        // Theme button
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Theme button clicked');
                this.eventBus.emit('ui:theme:toggle');
            });
        }
    }

    handleClick(event) {
        const target = event.target;
        
        // Mode switching
        if (target.closest('.mode-btn')) {
            const btn = target.closest('.mode-btn');
            const mode = btn.dataset.mode;
            if (mode) {
                console.log('🖱️ [Delegated] Mode button clicked:', mode);
                this.eventBus.emit('ui:mode:switch', { mode });
            }
            return;
        }

        // Generate button
        if (target.closest('#generate-main')) {
            console.log('🖱️ [Delegated] Generate button clicked');
            this.eventBus.emit('ui:generate:click');
            return;
        }

        // Action buttons
        if (target.closest('#copy-btn')) {
            console.log('🖱️ [Delegated] Copy button clicked');
            this.eventBus.emit('ui:copy:click');
            return;
        }

        if (target.closest('#download-btn')) {
            console.log('🖱️ [Delegated] Download button clicked');
            this.eventBus.emit('ui:download:click');
            return;
        }

        if (target.closest('#clear-btn')) {
            console.log('🖱️ [Delegated] Clear button clicked');
            this.eventBus.emit('ui:clear:click');
            return;
        }

        if (target.closest('#theme-btn')) {
            console.log('🖱️ [Delegated] Theme button clicked');
            this.eventBus.emit('ui:theme:toggle');
            return;
        }
    }

    // Test method to verify button connections
    testButtons() {
        console.log('🧪 ButtonController: Testing button connections...');
        
        const buttons = {
            'Mode buttons': document.querySelectorAll('.mode-btn'),
            'Generate button': document.getElementById('generate-main'),
            'Copy button': document.getElementById('copy-btn'),
            'Download button': document.getElementById('download-btn'),
            'Clear button': document.getElementById('clear-btn'),
            'Theme button': document.getElementById('theme-btn')
        };

        Object.entries(buttons).forEach(([name, element]) => {
            if (Array.isArray(element)) {
                console.log(`  ${name}: ${element.length} found`);
            } else {
                console.log(`  ${name}: ${element ? '✅ Found' : '❌ Missing'}`);
            }
        });

        return buttons;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonController;
}
