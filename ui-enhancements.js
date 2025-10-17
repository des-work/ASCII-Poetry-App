/**
 * UI Enhancements for Modern Layout
 * Connects new UI to existing functionality
 */

(function() {
    'use strict';
    
    console.log('🎨 Loading UI enhancements...');

    // Wait for app to be ready
    const initEnhancements = () => {
        if (!window.app) {
            setTimeout(initEnhancements, 100);
            return;
        }

        console.log('✅ Initializing UI enhancements');

        // Mode switching
        const modeBtns = document.querySelectorAll('.mode-btn');
        const modeContents = document.querySelectorAll('.mode-content');
        let currentMode = 'text';

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                switchMode(mode);
            });
        });

        function switchMode(mode) {
            currentMode = mode;
            
            // Update buttons
            modeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });

            // Update content
            modeContents.forEach(content => {
                const contentMode = content.id.replace('-mode', '');
                content.classList.toggle('active', contentMode === mode);
            });

            // Show/hide poetry-specific options
            const poetryOptions = document.querySelectorAll('.poetry-only');
            poetryOptions.forEach(opt => {
                opt.style.display = mode === 'poetry' ? 'flex' : 'none';
            });

            // Update font options based on mode
            updateFontOptions(mode);

            console.log('📑 Switched to mode:', mode);
        }

        function updateFontOptions(mode) {
            const fontSelect = document.getElementById('font-select');
            const fontOption = document.getElementById('font-option');
            
            if (mode === 'image') {
                fontOption.style.display = 'none';
            } else {
                fontOption.style.display = 'flex';
            }
        }

        // Main generate button handler
        const mainGenerateBtn = document.getElementById('generate-main');
        mainGenerateBtn.addEventListener('click', () => {
            console.log('🚀 Main generate button clicked, mode:', currentMode);
            
            // Sync values from new UI to old hidden elements
            syncValuesToHiddenElements();
            
            // Trigger appropriate generation
            switch(currentMode) {
                case 'text':
                    document.getElementById('generate-text')?.click();
                    break;
                case 'image':
                    document.getElementById('generate-image')?.click();
                    break;
                case 'poetry':
                    document.getElementById('generate-poetry')?.click();
                    break;
            }
        });

        // Sync values from new UI to hidden elements
        function syncValuesToHiddenElements() {
            // Poetry font
            const poetryFont = document.getElementById('generate-poetry') ? 
                document.getElementById('font-select').value : 'mini';
            const poetryFontSelect = document.getElementById('poetry-font-select');
            if (poetryFontSelect) {
                // Create option if it doesn't exist
                if (!poetryFontSelect.querySelector(`option[value="${poetryFont}"]`)) {
                    const option = document.createElement('option');
                    option.value = poetryFont;
                    poetryFontSelect.appendChild(option);
                }
                poetryFontSelect.value = poetryFont;
            }

            // Poetry color
            const colorValue = document.getElementById('color-select').value;
            const poetryColor = document.getElementById('poetry-color-select');
            if (poetryColor) {
                if (!poetryColor.querySelector(`option[value="${colorValue}"]`)) {
                    const option = document.createElement('option');
                    option.value = colorValue;
                    poetryColor.appendChild(option);
                }
                poetryColor.value = colorValue;
            }

            // Poetry animation
            const animValue = document.getElementById('animation-select').value;
            const poetryAnim = document.getElementById('poetry-animation-select');
            if (poetryAnim) {
                if (!poetryAnim.querySelector(`option[value="${animValue}"]`)) {
                    const option = document.createElement('option');
                    option.value = animValue;
                    poetryAnim.appendChild(option);
                }
                poetryAnim.value = animValue;
            }

            // Image color
            const imageColor = document.getElementById('image-color');
            if (imageColor) {
                imageColor.value = 'none';
            }
        }

        // File upload handling
        const imageInput = document.getElementById('image-input');
        const fileName = document.getElementById('file-name');
        
        if (imageInput && fileName) {
            imageInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileName.textContent = e.target.files[0].name;
                } else {
                    fileName.textContent = '';
                }
            });
        }

        // Width slider value display
        const widthSlider = document.getElementById('image-width');
        const widthValue = document.getElementById('width-value');
        
        if (widthSlider && widthValue) {
            widthSlider.addEventListener('input', (e) => {
                widthValue.textContent = e.target.value;
            });
        }

        // Output statistics
        function updateOutputStats() {
            const output = document.getElementById('ascii-output');
            const stats = document.getElementById('output-stats');
            
            if (output && stats && output.textContent.trim()) {
                const lines = output.textContent.split('\n').length;
                const chars = output.textContent.length;
                stats.textContent = `${lines} lines • ${chars} characters`;
            } else if (stats) {
                stats.textContent = '';
            }
        }

        // Watch for output changes
        const outputObserver = new MutationObserver(updateOutputStats);
        const outputElement = document.getElementById('ascii-output');
        if (outputElement) {
            outputObserver.observe(outputElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                mainGenerateBtn.click();
            }
            
            // Ctrl/Cmd + C to copy (when output is focused)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && 
                document.activeElement === outputElement) {
                document.getElementById('copy-btn')?.click();
            }
        });

        // Initialize in text mode
        switchMode('text');

        console.log('✅ UI enhancements loaded');
        console.log('💡 Keyboard shortcuts:');
        console.log('  - Ctrl+Enter: Generate');
        console.log('  - Ctrl+C: Copy (when output focused)');
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }
})();

