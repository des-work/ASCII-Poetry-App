/**
 * Logger Module
 * Centralized logging with level control to reduce console spam
 */

class Logger {
    constructor() {
        this.level = this.LEVELS.INFO; // Default level
        this.enableConsole = true;
        this.history = [];
        this.maxHistory = 100;
        
        console.log('Ì≥ù Logger initialized');
    }

    // Log levels
    static get LEVELS() {
        return {
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            SILENT: 5
        };
    }

    get LEVELS() {
        return Logger.LEVELS;
    }

    /**
     * Set log level (higher = less verbose)
     */
    setLevel(level) {
        this.level = level;
        console.log(`Ì≥ù Logger: Set level to ${this.getLevelName(level)}`);
    }

    /**
     * Set console output
     */
    setConsoleOutput(enabled) {
        this.enableConsole = enabled;
        if (!enabled) console.log('Ì≥ù Logger: Console output disabled');
    }

    /**
     * Get level name
     */
    getLevelName(level) {
        for (const [name, value] of Object.entries(this.LEVELS)) {
            if (value === level) return name;
        }
        return 'UNKNOWN';
    }

    /**
     * Add to history
     */
    addToHistory(level, message, data) {
        this.history.push({
            timestamp: new Date().toISOString(),
            level: this.getLevelName(level),
            message,
            data
        });

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Debug log
     */
    debug(message, data = null) {
        if (this.level <= this.LEVELS.DEBUG) {
            if (this.enableConsole) console.log(`Ì¥ç ${message}`, data);
            this.addToHistory(this.LEVELS.DEBUG, message, data);
        }
    }

    /**
     * Info log
     */
    info(message, data = null) {
        if (this.level <= this.LEVELS.INFO) {
            if (this.enableConsole) console.info(`‚ÑπÔ∏è  ${message}`, data);
            this.addToHistory(this.LEVELS.INFO, message, data);
        }
    }

    /**
     * Warning log
     */
    warn(message, data = null) {
        if (this.level <= this.LEVELS.WARN) {
            if (this.enableConsole) console.warn(`‚ö†Ô∏è  ${message}`, data);
            this.addToHistory(this.LEVELS.WARN, message, data);
        }
    }

    /**
     * Error log
     */
    error(message, data = null) {
        if (this.level <= this.LEVELS.ERROR) {
            if (this.enableConsole) console.error(`‚ùå ${message}`, data);
            this.addToHistory(this.LEVELS.ERROR, message, data);
        }
    }

    /**
     * Get log history
     */
    getHistory(level = null) {
        if (level === null) {
            return this.history;
        }
        return this.history.filter(entry => entry.level === this.getLevelName(level));
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        console.log('Ì≥ù Logger: History cleared');
    }

    /**
     * Export history as JSON
     */
    exportHistory() {
        return JSON.stringify(this.history, null, 2);
    }

    /**
     * Debug info
     */
    debugInfo() {
        console.log('Ì≥ù Logger Status:', {
            level: this.getLevelName(this.level),
            consoleEnabled: this.enableConsole,
            historySize: this.history.length,
            maxHistory: this.maxHistory
        });
    }
}

// Global logger instance
window.logger = new Logger();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
}
