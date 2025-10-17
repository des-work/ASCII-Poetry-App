/**
 * Global Error Handler
 * Provides resilient error handling and recovery
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.setupGlobalHandlers();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalHandlers() {
        // Handle unhandled errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'JavaScript Error',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
                timestamp: Date.now()
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || String(event.reason),
                error: event.reason,
                timestamp: Date.now()
            });
        });

        console.log('✅ Global error handlers initialized');
    }

    /**
     * Handle an error
     * @param {Object} errorInfo - Error information
     */
    handleError(errorInfo) {
        // Store error
        this.errors.push(errorInfo);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console
        console.error(`❌ ${errorInfo.type}:`, errorInfo);

        // Show user notification (if not in production)
        if (this.shouldShowErrorToUser(errorInfo)) {
            this.showErrorNotification(errorInfo);
        }

        // Send to analytics (if configured)
        this.reportError(errorInfo);
    }

    /**
     * Check if error should be shown to user
     * @param {Object} errorInfo - Error information
     * @returns {boolean}
     */
    shouldShowErrorToUser(errorInfo) {
        // Don't overwhelm user with error messages
        const recentErrors = this.errors.filter(e => 
            Date.now() - e.timestamp < 5000
        );
        return recentErrors.length <= 3;
    }

    /**
     * Show error notification to user
     * @param {Object} errorInfo - Error information
     */
    showErrorNotification(errorInfo) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(255, 0, 0, 0.95) 0%, rgba(200, 0, 0, 0.95) 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 99999;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <strong style="display: block; margin-bottom: 5px;">⚠️ ${errorInfo.type}</strong>
            <div style="font-size: 0.8em; opacity: 0.9;">${this.sanitizeMessage(errorInfo.message)}</div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
                font-size: 0.8em;
            ">Dismiss</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    }

    /**
     * Sanitize error message for display
     * @param {string} message - Error message
     * @returns {string}
     */
    sanitizeMessage(message) {
        if (!message) return 'An error occurred';
        // Remove file paths and technical details
        return message
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/file:\/\/[^\s]+/g, '')
            .substring(0, 150);
    }

    /**
     * Report error to analytics (if configured)
     * @param {Object} errorInfo - Error information
     */
    reportError(errorInfo) {
        // Placeholder for analytics integration
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('Error Occurred', {
                type: errorInfo.type,
                message: errorInfo.message,
                source: errorInfo.source
            });
        }
    }

    /**
     * Get recent errors
     * @param {number} limit - Number of errors to return
     * @returns {Array}
     */
    getRecentErrors(limit = 10) {
        return this.errors.slice(-limit);
    }

    /**
     * Clear error history
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Get error statistics
     * @returns {Object}
     */
    getStatistics() {
        const types = {};
        this.errors.forEach(error => {
            types[error.type] = (types[error.type] || 0) + 1;
        });

        return {
            total: this.errors.length,
            byType: types,
            recent: this.getRecentErrors(5)
        };
    }
}

// Create global error handler instance
const errorHandler = new ErrorHandler();

// Expose for debugging
window.errorHandler = errorHandler;

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}

