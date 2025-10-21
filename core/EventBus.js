/**
 * Event Bus
 * A simple publish/subscribe system for decoupled communication across the application.
 * This implementation uses a Singleton pattern to ensure only one instance exists.
 */
class EventBus {
    constructor() {
        if (EventBus.instance)
            // console.log('♻️ EventBus: Returning existing instance'); // This can be noisy
            return EventBus.instance;
        }
        this.events = {};
        this.subscriptions = new Map(); // Track subscriptions for cleanup
        EventBus.instance = this;
        // Temporarily re-enable for debugging
        // Uncomment the following lines

        // In constructor for new instance
        console.log('🚌 EventBus: New instance created');
    }

    /**
     * Subscribe to an event with automatic unsubscribe tracking
     * @param {string} event - The event name.
     * @param {Function} callback - The function to call when the event is emitted.
     * @returns {Function} A function to unsubscribe.
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Track subscription for cleanup
        const unsubscribe = () => this.off(event, callback);
        
        if (!this.subscriptions.has(event)) {
            this.subscriptions.set(event, []);
        }
        this.subscriptions.get(event).push(unsubscribe);
        
        if (window.DEBUG_MODE) {
            console.log(`👂 EventBus: Listener registered for "${event}" (total: ${this.events[event].length})`);
        }
        
        // Return an unsubscribe function
        return unsubscribe;
    }

    /**
     * Unsubscribe from an event.
     * @param {string} event - The event name.
     * @param {Function} [callback] - The specific callback to remove. If not provided, all callbacks for the event are removed.
     */
    off(event, callback) {
        if (!this.events[event]) {
            return;
        }
        if (callback) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        } else {
            delete this.events[event];
        }
    }

    /**
     * Clean up all subscriptions for a component
     * Call this when a component is destroyed
     */
    cleanup(event) {
        if (event) {
            // Clean specific event
            const listenerCount = this.events[event]?.length || 0;
            if (this.subscriptions.has(event)) {
                this.subscriptions.delete(event);
            }
            delete this.events[event];
            console.log(`🧹 EventBus: Cleaned up "${event}" (${listenerCount} listeners removed)`);
        } else {
            // Clean all events
            const totalListeners = Object.values(this.events).reduce((sum, listeners) => sum + listeners.length, 0);
            this.events = {};
            this.subscriptions.clear();
            console.log(`🧹 EventBus: Cleaned up all subscriptions (${totalListeners} listeners removed)`);
        }
    }

    /**
     * Get subscription statistics for monitoring
     */
    getSubscriptionStats() {
        const stats = {};
        for (const [event, callbacks] of Object.entries(this.events)) {
            stats[event] = callbacks.length;
        }
        return stats;
    }

    /**
     * Check for potential memory leaks
     */
    detectMemoryLeaks() {
        const warnings = [];

        // Check for events with too many listeners
        for (const [event, callbacks] of Object.entries(this.events)) {
            if (callbacks.length > 10) {
                warnings.push(`Event "${event}" has ${callbacks.length} listeners (potential leak)`);
            }
        }

        // Check for subscription tracking issues
        if (this.subscriptions.size !== Object.keys(this.events).length) {
            warnings.push('Subscription tracking inconsistency detected');
        }

        return warnings;
    }

    /**
     * Get subscription count for monitoring
     */
    getSubscriptionCount(event) {
        if (event) {
            return this.events[event]?.length || 0;
        }
        // Return total count
        return Object.keys(this.events).reduce((total, key) => total + (this.events[key]?.length || 0), 0);
    }

    /**
     * Debug helper to show all subscriptions
     */
    debugSubscriptions() {
        const stats = {};
        for (const [event, callbacks] of Object.entries(this.events)) {
            stats[event] = callbacks.length;
        }
        console.log('📊 EventBus Subscriptions:', stats);
        return stats;
    }

    /**
     * Emit an event to all its subscribers.
     * @param {string} event - The event name.
     * @param {*} [data] - The data to pass to the callbacks.
     */
    emit(event, data) {
        // Only log in debug mode for specific event types
        if (window.DEBUG_MODE) {
            console.log(`📢 EventBus.emit("${event}")`, { hasData: !!data });
        }
        
        if (!this.events[event]) {
            // Only warn in debug mode for expected event patterns
            if (window.DEBUG_MODE && /^(request:|ui:|text:gen:|image:gen:|poetry:gen:)/.test(event)) {
                console.warn(`⚠️ EventBus: No listeners for event "${event}"`);
            }
            return;
        }
        
        const listenerCount = this.events[event].length;
        
        // Use a slice to prevent issues if a callback unsubscribes during iteration
        this.events[event].slice().forEach((callback, index) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`❌ EventBus: Error in listener for "${event}":`, error.message);
                console.error('Stack:', error.stack);
            }
        });
    }

    /**
     * Subscribe to an event for one time only.
     * @param {string} event - The event name.
     * @param {Function} callback - The function to call.
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        return this.on(event, onceCallback);
    }
}

/**
 * Static list of application-wide events for consistency and type-safety.
 */
EventBus.Events = {
    // Notifications
    NOTIFICATION_SHOW: 'notification:show',

    // UI Requests to Services
    REQUEST_TEXT_GENERATION: 'request:text:gen',
    REQUEST_IMAGE_GENERATION: 'request:image:gen',
    REQUEST_POETRY_GENERATION: 'request:poetry:gen',

    // Text Generation Cycle
    TEXT_GENERATION_START: 'text:gen:start',
    TEXT_GENERATION_COMPLETE: 'text:gen:complete',
    TEXT_GENERATION_ERROR: 'text:gen:error',

    // Image Generation Cycle
    IMAGE_GENERATION_START: 'image:gen:start',
    IMAGE_GENERATION_COMPLETE: 'image:gen:complete',
    IMAGE_GENERATION_ERROR: 'image:gen:error',

    // Poetry Generation Cycle
    POETRY_GENERATION_START: 'poetry:gen:start',
    POETRY_GENERATION_COMPLETE: 'poetry:gen:complete',
    POETRY_GENERATION_ERROR: 'poetry:gen:error',
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}