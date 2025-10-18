/**
 * InputManager - New Input System
 * Handles all input reading, validation, and state management
 */

class InputManager {
    constructor(eventBus, validator) {
        this.eventBus = eventBus;
        this.validator = validator;
        this.dom = {};
        this.state = {
            currentMode: 'text',
            keywords: new Set()
        };
        this.init();
    }

    init() {
        console.log('📥 InputManager: Initializing...');
        this.cacheElements();
        this.attachInputListeners();
        console.log('✅ InputManager: Initialized');
    }

    cacheElements() {
        this.dom = {
            // Mode buttons
            modeButtons: document.querySelectorAll('.mode-btn'),
            modeContents: document.querySelectorAll('.mode-content'),

            // Input fields
            textInput: document.getElementById('text-input'),
            imageInput: document.getElementById('image-input'),
            poemInput: document.getElementById('poem-input'),

            // Options
            fontSelect: document.getElementById('font-select'),
            colorSelect: document.getElementById('color-select'),
            animationSelect: document.getElementById('animation-select'),
            imageWidthSlider: document.getElementById('image-width'),
            imageWidthValue: document.getElementById('width-value'),
            imageCharsSelect: document.getElementById('image-chars'),
            poetryLayoutSelect: document.getElementById('poetry-layout'),
            poetryDecorationSelect: document.getElementById('poetry-decoration'),

            // Keywords
            keywordsInput: document.getElementById('keywords-input'),
            autoDetectBtn: document.getElementById('auto-detect-btn'),
            keywordChipsContainer: document.getElementById('keyword-chips'),

            // Generate button
            generateBtn: document.getElementById('generate-main')
        };

        console.log('📥 InputManager: DOM elements cached', {
            modeButtons: this.dom.modeButtons?.length,
            hasTextInput: !!this.dom.textInput,
            hasImageInput: !!this.dom.imageInput,
            hasPoemInput: !!this.dom.poemInput,
            hasGenerateBtn: !!this.dom.generateBtn
        });
    }

    attachInputListeners() {
        // Listen for mode switches
        this.eventBus.on('ui:mode:switch', (data) => this.switchMode(data.mode));

        // Listen for generate requests
        this.eventBus.on('ui:generate:click', () => this.handleGenerateRequest());

        // Input change listeners for real-time validation
        this.dom.textInput?.addEventListener('input', () => this.updateGenerateButton());
        this.dom.poemInput?.addEventListener('input', () => this.updateGenerateButton());
        this.dom.imageInput?.addEventListener('change', () => this.updateGenerateButton());

        // Image width slider
        this.dom.imageWidthSlider?.addEventListener('input', (e) => {
            if (this.dom.imageWidthValue) {
                this.dom.imageWidthValue.textContent = e.target.value;
            }
            this.updateGenerateButton();
        });

        // Keyword management
        this.dom.keywordsInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.dom.keywordsInput.value) {
                e.preventDefault();
                this.addKeyword(this.dom.keywordsInput.value.trim());
                this.dom.keywordsInput.value = '';
                this.updateGenerateButton();
            }
        });

        this.dom.autoDetectBtn?.addEventListener('click', () => this.autoDetectKeywords());
        this.dom.keywordChipsContainer?.addEventListener('click', (e) => this.handleChipClick(e));

        console.log('📥 InputManager: Event listeners attached');
    }

    switchMode(mode) {
        if (this.state.currentMode === mode) return;
        
        console.log('📥 InputManager: Switching mode from', this.state.currentMode, 'to', mode);
        this.state.currentMode = mode;

        // Update button states
        this.dom.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update content visibility
        this.dom.modeContents.forEach(content => {
            content.classList.toggle('active', content.id === `${mode}-mode`);
        });

        // Show/hide poetry-specific options
        const poetryOptions = document.querySelectorAll('.poetry-only');
        poetryOptions.forEach(opt => {
            opt.style.display = mode === 'poetry' ? 'flex' : 'none';
        });

        // Update font options based on mode
        this.updateFontOptions(mode);

        // Focus appropriate input
        setTimeout(() => {
            if (mode === 'text') this.dom.textInput?.focus();
            if (mode === 'image') this.dom.imageInput?.focus();
            if (mode === 'poetry') this.dom.poemInput?.focus();
        }, 0);

        this.updateGenerateButton();
    }

    updateFontOptions(mode) {
        const fontOption = this.dom.fontSelect?.closest('.compact-option');
        if (fontOption) {
            fontOption.style.display = (mode === 'image') ? 'none' : 'flex';
        }
    }

    handleGenerateRequest() {
        console.log('📥 InputManager: Generate request received for mode:', this.state.currentMode);

        let options = null;
        let error = null;

        try {
            switch (this.state.currentMode) {
                case 'text':
                    options = this.readTextOptions();
                    break;
                case 'image':
                    options = this.readImageOptions();
                    break;
                case 'poetry':
                    options = this.readPoetryOptions();
                    break;
                default:
                    error = `Unknown mode: ${this.state.currentMode}`;
            }

            if (error) {
                this.eventBus.emit('ui:notification', { message: error, type: 'error' });
                return;
            }

            if (!options) {
                this.eventBus.emit('ui:notification', { message: 'Failed to read input options', type: 'error' });
                return;
            }

            console.log('📥 InputManager: Emitting generation request:', options);
            
            // Emit the appropriate generation request
            switch (this.state.currentMode) {
                case 'text':
                    this.eventBus.emit('request:text:gen', options);
                    break;
                case 'image':
                    this.eventBus.emit('request:image:gen', options);
                    break;
                case 'poetry':
                    this.eventBus.emit('request:poetry:gen', options);
                    break;
            }

        } catch (err) {
            console.error('📥 InputManager: Error handling generate request:', err);
            this.eventBus.emit('ui:notification', { message: `Input error: ${err.message}`, type: 'error' });
        }
    }

    readTextOptions() {
        const text = this.dom.textInput?.value?.trim() || '';
        const fontName = this.dom.fontSelect?.value || 'standard';
        const color = this.dom.colorSelect?.value || 'none';
        const animation = this.dom.animationSelect?.value || 'none';

        if (!text) {
            throw new Error('Please enter some text');
        }

        return { text, fontName, color, animation };
    }

    readImageOptions() {
        const file = this.dom.imageInput?.files?.[0];
        const width = parseInt(this.dom.imageWidthSlider?.value || '80', 10);
        const charSet = this.dom.imageCharsSelect?.value || 'standard';

        if (!file) {
            throw new Error('Please select an image file');
        }

        return { file, width, charSet };
    }

    readPoetryOptions() {
        const poem = this.dom.poemInput?.value?.trim() || '';
        const fontName = this.dom.fontSelect?.value || 'mini';
        const layout = this.dom.poetryLayoutSelect?.value || 'centered';
        const decoration = this.dom.poetryDecorationSelect?.value || 'none';
        const color = this.dom.colorSelect?.value || 'none';
        const animation = this.dom.animationSelect?.value || 'none';
        const keywords = Array.from(this.state.keywords);

        if (!poem) {
            throw new Error('Please enter a poem');
        }

        return { poem, fontName, layout, decoration, color, animation, keywords };
    }

    updateGenerateButton() {
        if (!this.dom.generateBtn) return;

        let enabled = false;
        switch (this.state.currentMode) {
            case 'text':
                enabled = !!(this.dom.textInput?.value?.trim());
                break;
            case 'image':
                enabled = !!(this.dom.imageInput?.files?.[0]);
                break;
            case 'poetry':
                enabled = !!(this.dom.poemInput?.value?.trim());
                break;
        }

        this.dom.generateBtn.disabled = !enabled;
        this.dom.generateBtn.classList.toggle('disabled', !enabled);
    }

    // Keyword management methods
    addKeyword(keyword) {
        if (!keyword || this.state.keywords.has(keyword)) return;
        
        this.state.keywords.add(keyword);
        this.renderKeywordChips();
        console.log('📥 InputManager: Added keyword:', keyword);
    }

    removeKeyword(keyword) {
        this.state.keywords.delete(keyword);
        this.renderKeywordChips();
        console.log('📥 InputManager: Removed keyword:', keyword);
    }

    renderKeywordChips() {
        if (!this.dom.keywordChipsContainer) return;

        this.dom.keywordChipsContainer.innerHTML = '';
        this.state.keywords.forEach(keyword => {
            const chip = document.createElement('div');
            chip.className = 'keyword-chip';
            chip.textContent = keyword;
            chip.dataset.keyword = keyword;
            this.dom.keywordChipsContainer.appendChild(chip);
        });
    }

    handleChipClick(event) {
        const keyword = event.target.dataset.keyword;
        if (keyword) {
            this.removeKeyword(keyword);
        }
    }

    autoDetectKeywords() {
        const poem = this.dom.poemInput?.value;
        if (!poem || !poem.trim()) {
            this.eventBus.emit('ui:notification', { message: 'Please enter a poem first!', type: 'warning' });
            return;
        }

        try {
            // Simple keyword detection
            const words = poem.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
            const wordCount = {};
            
            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });

            const detectedKeywords = Object.keys(wordCount)
                .sort((a, b) => wordCount[b] - wordCount[a])
                .slice(0, 5)
                .filter(word => !this.state.keywords.has(word));

            detectedKeywords.forEach(keyword => {
                if (this.state.keywords.size < 10) {
                    this.addKeyword(keyword);
                }
            });

            if (detectedKeywords.length > 0) {
                this.eventBus.emit('ui:notification', { 
                    message: `Detected ${detectedKeywords.length} keywords!`, 
                    type: 'success' 
                });
            } else {
                this.eventBus.emit('ui:notification', { 
                    message: 'No new keywords detected', 
                    type: 'info' 
                });
            }

        } catch (error) {
            console.error('Error auto-detecting keywords:', error);
            this.eventBus.emit('ui:notification', { message: 'Error detecting keywords', type: 'error' });
        }
    }

    getCurrentMode() {
        return this.state.currentMode;
    }

    getKeywords() {
        return Array.from(this.state.keywords);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
