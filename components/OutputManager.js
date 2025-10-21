/**
 * OutputManager - New Output System
 * Handles all output display, rendering, and user actions
 */

class OutputManager {
    constructor(eventBus, renderer) {
        this.eventBus = eventBus;
        this.renderer = renderer;
        this.dom = {};
        this.currentOutput = null;
        this.init();
    }

    init() {
        console.log('📤 OutputManager: Initializing...');
        this.cacheElements();
        this.subscribeToEvents();
        console.log('✅ OutputManager: Initialized');
    }

    cacheElements() {
        this.dom = {
            output: document.getElementById('ascii-output'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            clearBtn: document.getElementById('clear-btn'),
            themeBtn: document.getElementById('theme-btn'),
            notification: document.getElementById('notification'),
            outputStats: document.getElementById('output-stats')
        };

        console.log('📤 OutputManager: DOM elements cached', {
            hasOutput: !!this.dom.output,
            hasCopyBtn: !!this.dom.copyBtn,
            hasDownloadBtn: !!this.dom.downloadBtn,
            hasClearBtn: !!this.dom.clearBtn
        });
    }

    subscribeToEvents() {
        // Generation events
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_START, () => this.showLoading('text'));
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_COMPLETE, (result) => this.displayOutput(result));
        this.eventBus.on(EventBus.Events.TEXT_GENERATION_ERROR, (error) => this.showError(error));

        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_START, () => this.showLoading('image'));
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_COMPLETE, (result) => this.displayOutput(result));
        this.eventBus.on(EventBus.Events.IMAGE_GENERATION_ERROR, (error) => this.showError(error));

        this.eventBus.on(EventBus.Events.POETRY_GENERATION_START, () => this.showLoading('poetry'));
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_COMPLETE, (result) => this.displayOutput(result));
        this.eventBus.on(EventBus.Events.POETRY_GENERATION_ERROR, (error) => this.showError(error));

        // UI action events
        this.eventBus.on('ui:copy:click', () => this.copyToClipboard());
        this.eventBus.on('ui:download:click', () => this.downloadOutput());
        this.eventBus.on('ui:clear:click', () => this.clearOutput());
        this.eventBus.on('ui:theme:toggle', () => this.toggleTheme());

        // Notification events
        this.eventBus.on('ui:notification', (data) => this.showNotification(data.message, data.type));

        console.log('📤 OutputManager: Event subscriptions complete');
    }

    showLoading(type) {
        console.log('📤 OutputManager: Showing loading for', type);
        
        if (this.dom.output) {
            this.dom.output.textContent = `Generating ${type} ASCII art...`;
            this.dom.output.className = 'ascii-output loading';
        }

        // Disable action buttons during generation
        [this.dom.copyBtn, this.dom.downloadBtn, this.dom.clearBtn].forEach(btn => {
            if (btn) btn.disabled = true;
        });
    }

    displayOutput(result) {
        console.log('📤 OutputManager: Displaying output', { 
            success: result.success, 
            hasAscii: !!result.ascii,
            asciiLength: result.ascii?.length 
        });

        if (!result.success || !result.ascii) {
            this.showError({ error: 'No output to display' });
            return;
        }

        try {
            this.currentOutput = result;

            // Clear loading state
            if (this.dom.output) {
                this.dom.output.textContent = result.ascii;
                this.dom.output.className = 'ascii-output';
                
                // Apply styling
                this.applyStyling(result.metadata);
            }

            // Update statistics
            this.updateStats(result.ascii);

            // Re-enable action buttons
            [this.dom.copyBtn, this.dom.downloadBtn, this.dom.clearBtn].forEach(btn => {
                if (btn) btn.disabled = false;
            });

            // Show success notification
            this.showNotification(`${result.metadata?.type || 'ASCII art'} generated successfully!`, 'success');

        } catch (error) {
            console.error('📤 OutputManager: Error displaying output:', error);
            this.showError({ error: error.message });
        }
    }

    applyStyling(metadata) {
        if (!this.dom.output || !metadata) return;

        const { color = 'none', animation = 'none' } = metadata;

        // Reset styles
        this.dom.output.style.color = '';
        this.dom.output.style.background = '';
        this.dom.output.style.webkitBackgroundClip = '';
        this.dom.output.style.webkitTextFillColor = '';

        // Apply color
        if (color !== 'none') {
            this.applyColor(color);
        } else {
            this.dom.output.style.color = '#ffffff'; // Default white text
        }

        // Apply animation
        if (animation !== 'none') {
            this.dom.output.classList.add(`animation-${animation}`);
        }
    }

    applyColor(color) {
        if (!this.dom.output) return;

        const colorMap = {
            red: '#ff6b6b',
            green: '#51cf66',
            blue: '#4dabf7',
            yellow: '#ffd43b',
            purple: '#cc5de8',
            cyan: '#22b8cf',
            magenta: '#ff6b9d',
            gold: '#ffd700',
            silver: '#c0c0c0'
        };

        if (colorMap[color]) {
            this.dom.output.style.color = colorMap[color];
        } else if (color === 'rainbow') {
            this.applyRainbowEffect();
        } else if (color === 'gradient') {
            this.applyGradientEffect();
        }
    }

    applyRainbowEffect() {
        if (!this.dom.output) return;

        const text = this.dom.output.textContent;
        const colors = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff6b9d'];
        let html = '';

        for (let i = 0; i < text.length; i++) {
            html += `<span style="color: ${colors[i % colors.length]}">${text[i]}</span>`;
        }

        this.dom.output.innerHTML = html;
    }

    applyGradientEffect() {
        if (!this.dom.output) return;

        this.dom.output.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
        this.dom.output.style.webkitBackgroundClip = 'text';
        this.dom.output.style.webkitTextFillColor = 'transparent';
        this.dom.output.style.backgroundClip = 'text';
    }

    updateStats(ascii) {
        if (!this.dom.outputStats || !ascii) return;

        try {
            const lines = ascii.split('\n');
            const width = Math.max(...lines.map(l => l.length));
            const height = lines.length;
            const charCount = ascii.length;

            this.dom.outputStats.textContent = `${width}×${height}, ${charCount} chars`;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    showError(error) {
        console.error('📤 OutputManager: Showing error:', error);
        
        const message = error.error || error.message || 'An unknown error occurred';
        
        if (this.dom.output) {
            this.dom.output.textContent = `Error: ${message}`;
            this.dom.output.className = 'ascii-output error';
        }

        // Re-enable action buttons
        [this.dom.copyBtn, this.dom.downloadBtn, this.dom.clearBtn].forEach(btn => {
            if (btn) btn.disabled = false;
        });

        this.showNotification(`Error: ${message}`, 'error');
    }

    async copyToClipboard() {
        if (!this.currentOutput || !this.currentOutput.ascii) {
            this.showNotification('No ASCII art to copy!', 'warning');
            return;
        }

        try {
            const text = this.currentOutput.ascii;
            
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            this.showNotification('Copied to clipboard!', 'success');
            console.log('📤 OutputManager: Copied to clipboard');

        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('Failed to copy', 'error');
        }
    }

    downloadOutput() {
        if (!this.currentOutput || !this.currentOutput.ascii) {
            this.showNotification('No ASCII art to download!', 'warning');
            return;
        }

        try {
            const text = this.currentOutput.ascii;
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `ascii-art-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            this.showNotification('Downloaded successfully!', 'success');
            console.log('📤 OutputManager: Downloaded output');

        } catch (error) {
            console.error('Error downloading output:', error);
            this.showNotification('Failed to download', 'error');
        }
    }

    clearOutput() {
        try {
            if (this.dom.output) {
                this.dom.output.textContent = '';
                this.dom.output.className = 'ascii-output';
            }

            if (this.dom.outputStats) {
                this.dom.outputStats.textContent = '';
            }

            this.currentOutput = null;

            // Disable action buttons when no output
            [this.dom.copyBtn, this.dom.downloadBtn].forEach(btn => {
                if (btn) btn.disabled = true;
            });

            this.showNotification('Output cleared', 'info');
            console.log('📤 OutputManager: Output cleared');

        } catch (error) {
            console.error('Error clearing output:', error);
        }
    }

    toggleTheme() {
        try {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            
            if (this.dom.themeBtn) {
                this.dom.themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            }

            // Save to localStorage
            try {
                localStorage.setItem('theme', newTheme);
            } catch (storageError) {
                console.warn('Failed to save theme preference:', storageError);
            }

            this.showNotification(`Switched to ${newTheme} theme`, 'info');
            console.log('📤 OutputManager: Theme toggled to', newTheme);

        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    showNotification(message, type = 'info') {
        try {
            let notification = this.dom.notification;
            
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, rgba(18, 18, 26, 0.95) 0%, rgba(26, 26, 40, 0.95) 100%);
                    color: var(--text-primary);
                    padding: 12px 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateY(-10px);
                `;
                document.body.appendChild(notification);
                this.dom.notification = notification;
            }

            // Set type-specific styling
            const typeColors = {
                success: '#51cf66',
                error: '#ff6b6b',
                warning: '#ffd43b',
                info: '#4dabf7'
            };

            notification.style.borderColor = `rgba(${typeColors[type] || '102, 126, 234'}, 0.3)`;
            notification.textContent = message;
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';

            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (notification) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-10px)';
                }
            }, 3000);

        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    getCurrentOutput() {
        return this.currentOutput;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutputManager;
}
