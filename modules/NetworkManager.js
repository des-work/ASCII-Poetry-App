/**
 * Network Manager
 * Provides utilities for handling network operations with timeout and error detection
 */

class NetworkManager {
    constructor(defaultTimeout = 10000) {
        this.defaultTimeout = defaultTimeout;
        this.pendingRequests = new Map();
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());
        
        this.isOnline = navigator.onLine;
        console.log(`��� NetworkManager initialized (Online: ${this.isOnline})`);
    }

    /**
     * Check if network is available
     */
    isNetworkAvailable() {
        return navigator.onLine;
    }

    /**
     * Fetch with timeout protection
     */
    async fetchWithTimeout(url, options = {}, timeout = this.defaultTimeout) {
        if (!this.isOnline) {
            throw new Error('No internet connection. Please check your network.');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Network error: ${response.status} ${response.statusText}`);
            }

            return response;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms. Please try again.`);
            }

            if (!this.isOnline) {
                throw new Error('Connection lost. Please check your network.');
            }

            throw error;
        }
    }

    /**
     * Load resource with timeout
     */
    async loadResource(url, timeout = this.defaultTimeout) {
        if (!this.isOnline) {
            console.warn('⚠️ NetworkManager: Offline - cannot load resource:', url);
            throw new Error('No internet connection');
        }

        try {
            const response = await this.fetchWithTimeout(url, {}, timeout);
            return await response.text();
        } catch (error) {
            console.error('❌ NetworkManager: Failed to load resource:', url, error.message);
            throw error;
        }
    }

    /**
     * Handle online event
     */
    onOnline() {
        this.isOnline = true;
        console.log('✅ NetworkManager: Connection restored');
        
        // Emit event for app notification
        if (window.eventBus) {
            window.eventBus.emit('network:online');
        }
    }

    /**
     * Handle offline event
     */
    onOffline() {
        this.isOnline = false;
        console.warn('⚠️ NetworkManager: Connection lost');
        
        // Emit event for app notification
        if (window.eventBus) {
            window.eventBus.emit('network:offline');
        }
    }

    /**
     * Get network status
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            effectiveType: navigator.connection?.effectiveType || 'unknown',
            saveData: navigator.connection?.saveData || false,
            rtt: navigator.connection?.rtt || 0
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkManager;
}
