/**
 * Event Bus - Centralized event management system
 * Implements the Observer/Publish-Subscribe pattern for decoupled communication
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to execute
     * @param {Object} context - Context for callback (optional)
     * @returns {Function} Unsubscribe function
     */
    on(eventName, callback, context = null) {
        if (!eventName || typeof callback !== 'function') {
            console.error('Invalid event subscription:', eventName);
            return () => {};
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const subscription = { callback, context };
        this.events.get(eventName).push(subscription);

        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    /**
     * Subscribe to an event (one-time only)
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to execute
     * @param {Object} context - Context for callback (optional)
     * @returns {Function} Unsubscribe function
     */
    once(eventName, callback, context = null) {
        const wrappedCallback = (...args) => {
            this.off(eventName, wrappedCallback);
            callback.apply(context, args);
        };

        return this.on(eventName, wrappedCallback, context);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function to remove
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) {
            return;
        }

        const subscribers = this.events.get(eventName);
        const index = subscribers.findIndex(sub => sub.callback === callback);

        if (index !== -1) {
            subscribers.splice(index, 1);
        }

        // Clean up empty event arrays
        if (subscribers.length === 0) {
            this.events.delete(eventName);
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to subscribers
     */
    emit(eventName, data = null) {
        // Record event in history
        this.recordEvent(eventName, data);

        if (!this.events.has(eventName)) {
            return;
        }

        const subscribers = this.events.get(eventName);
        
        subscribers.forEach(({ callback, context }) => {
            try {
                callback.call(context, data);
            } catch (error) {
                console.error(`Error in event handler for "${eventName}":`, error);
            }
        });
    }

    /**
     * Emit an event asynchronously
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to subscribers
     * @returns {Promise}
     */
    async emitAsync(eventName, data = null) {
        this.recordEvent(eventName, data);

        if (!this.events.has(eventName)) {
            return;
        }

        const subscribers = this.events.get(eventName);
        const promises = subscribers.map(({ callback, context }) => {
            return Promise.resolve(callback.call(context, data)).catch(error => {
                console.error(`Error in async event handler for "${eventName}":`, error);
            });
        });

        await Promise.all(promises);
    }

    /**
     * Remove all subscribers for an event
     * @param {string} eventName - Name of the event
     */
    clear(eventName) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }

    /**
     * Get list of all event names
     * @returns {Array<string>}
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get subscriber count for an event
     * @param {string} eventName - Name of the event
     * @returns {number}
     */
    getSubscriberCount(eventName) {
        return this.events.has(eventName) ? this.events.get(eventName).length : 0;
    }

    /**
     * Record event in history
     * @param {string} eventName - Name of the event
     * @param {*} data - Event data
     * @private
     */
    recordEvent(eventName, data) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now()
        };

        this.eventHistory.push(event);

        // Limit history size
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }

    /**
     * Get event history
     * @param {number} limit - Number of recent events to return
     * @returns {Array}
     */
    getHistory(limit = 10) {
        return this.eventHistory.slice(-limit);
    }

    /**
     * Debug: Log current state
     */
    debug() {
        console.group('EventBus Debug Info');
        console.log('Registered Events:', this.getEventNames());
        this.events.forEach((subscribers, eventName) => {
            console.log(`  ${eventName}: ${subscribers.length} subscribers`);
        });
        console.log('Recent Events:', this.getHistory(5));
        console.groupEnd();
    }
}

// Event name constants for type safety
EventBus.Events = {
    // Generation events
    TEXT_GENERATION_START: 'text:generation:start',
    TEXT_GENERATION_COMPLETE: 'text:generation:complete',
    TEXT_GENERATION_ERROR: 'text:generation:error',
    
    IMAGE_GENERATION_START: 'image:generation:start',
    IMAGE_GENERATION_COMPLETE: 'image:generation:complete',
    IMAGE_GENERATION_ERROR: 'image:generation:error',
    
    POETRY_GENERATION_START: 'poetry:generation:start',
    POETRY_GENERATION_COMPLETE: 'poetry:generation:complete',
    POETRY_GENERATION_ERROR: 'poetry:generation:error',
    
    // UI events
    TAB_CHANGED: 'ui:tab:changed',
    THEME_CHANGED: 'ui:theme:changed',
    LOADING_START: 'ui:loading:start',
    LOADING_END: 'ui:loading:end',
    NOTIFICATION_SHOW: 'ui:notification:show',
    
    // Output events
    OUTPUT_UPDATED: 'output:updated',
    OUTPUT_COPIED: 'output:copied',
    OUTPUT_DOWNLOADED: 'output:downloaded',
    OUTPUT_CLEARED: 'output:cleared',
    
    // Keyword events
    KEYWORD_ADDED: 'keyword:added',
    KEYWORD_REMOVED: 'keyword:removed',
    KEYWORDS_DETECTED: 'keywords:detected',
    KEYWORDS_CLEARED: 'keywords:cleared',
    
    // Image events
    IMAGE_UPLOADED: 'image:uploaded',
    IMAGE_PROCESSED: 'image:processed',
    
    // Error events
    ERROR_OCCURRED: 'error:occurred',
    VALIDATION_FAILED: 'validation:failed',
    
    // State events
    STATE_CHANGED: 'state:changed',
    CONFIG_UPDATED: 'config:updated'
};

// Freeze event constants
Object.freeze(EventBus.Events);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}

