/**
 * Event Bus
 * A simple publish/subscribe system for decoupled communication across the application.
 * This implementation uses a Singleton pattern to ensure only one instance exists.
 */
class EventBus {
    constructor() {
        if (EventBus.instance) {
            // console.log('♻️ EventBus: Returning existing instance'); // This can be noisy
            return EventBus.instance;
        }
        this.events = {};
        EventBus.instance = this;
        // Temporarily re-enable for debugging
        // Uncomment the following lines

        // In constructor for new instance
        console.log('🚌 EventBus: New instance created');
    }

    /**
     * Subscribe to an event.
     * @param {string} event - The event name.
     * @param {Function} callback - The function to call when the event is emitted.
     * @returns {Function} A function to unsubscribe.
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        // Temporarily re-enable for debugging
        // Uncomment the following lines

        // In on method
        console.log(`👂 EventBus: Listener registered for "${event}" (total: ${this.events[event].length})`);
        // Return an unsubscribe function
        return () => this.off(event, callback);
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
     * Emit an event to all its subscribers.
     * @param {string} event - The event name.
     * @param {*} [data] - The data to pass to the callbacks.
     */
    emit(event, data) {
        // Trace every emit to aid debugging
        try {
            console.log(`📢 EventBus.emit("${event}")`, { hasData: !!data });
        } catch (_) {}
        if (!this.events[event]) {
            // It's common for some events to have no listeners, so a warning can be noisy.
            // console.warn(`⚠️ EventBus: No listeners for event "${event}"`);
            // Temporarily re-enable for debugging
            // Uncomment the following lines

            // In emit method
            console.warn(`⚠️ No listeners registered for event: "${event}"`);
            console.log('📋 Available events:', Object.keys(this.events));
            return;
        }
        
        const listenerCount = this.events[event].length;
        // console.log(`📢 EventBus: Emitting "${event}" to ${listenerCount} listener(s)`);
        
        // Use a slice to prevent issues if a callback unsubscribes during iteration
        this.events[event].slice().forEach((callback, index) => {
            try {
                callback(data);
                // Temporarily re-enable for debugging
                // Uncomment the following lines

                // In emit method
                console.log(`✅ Listener #${index + 1} completed`);
            } catch (error) {
                console.error(`  ❌ Error in listener #${index + 1} for "${event}":`, error);
                console.error('  Stack:', error.stack);
            }
        });
        // Temporarily re-enable for debugging
        // Uncomment the following lines

        // In emit method
        console.log(`✅ Event "${event}" processing complete`);
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