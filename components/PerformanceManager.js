/**
 * Performance Manager Component
 * Handles caching, memoization, and performance optimization
 */

class PerformanceManager {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.renderCache = new Map();
        this.maxCacheSize = config?.performance?.maxCacheSize || 50;
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            totalRequests: 0
        };
        
        console.log('⚡ PerformanceManager initialized');
    }

    /**
     * Generate cache key for text rendering
     * Uses JSON.stringify to safely handle all input combinations
     */
    generateCacheKey(text, fontName, color, animation) {
        // Use JSON.stringify to ensure no collisions between different parameter combinations
        return JSON.stringify({
            text: (text || '').toLowerCase(),
            font: (fontName || '').toLowerCase(),
            color: (color || '').toLowerCase(),
            animation: (animation || '').toLowerCase()
        });
    }

    /**
     * Check if result is cached
     */
    getCachedResult(text, fontName, color, animation) {
        const key = this.generateCacheKey(text, fontName, color, animation);
        this.stats.totalRequests++;
        
        if (this.renderCache.has(key)) {
            this.stats.cacheHits++;
            console.log('⚡ PerformanceManager: Cache hit for', key);
            return this.renderCache.get(key);
        }
        
        this.stats.cacheMisses++;
        return null;
    }

    /**
     * Cache rendering result with proper LRU eviction
     */
    cacheResult(text, fontName, color, animation, result) {
        const key = this.generateCacheKey(text, fontName, color, animation);
        
        // If key already exists, delete it to move to end (most recently used)
        if (this.renderCache.has(key)) {
            this.renderCache.delete(key);
        }
        
        // If cache is at max size, evict the least recently used (first item)
        if (this.renderCache.size >= this.maxCacheSize) {
            // Get first key (oldest/LRU entry)
            const firstKey = this.renderCache.keys().next().value;
            this.renderCache.delete(firstKey);
            console.log('⚡ PerformanceManager: Evicted LRU cache entry');
        }
        
        // Add new result (becomes most recently used)
        this.renderCache.set(key, result);
        console.log('⚡ PerformanceManager: Cached result', {
            keyLength: key.length,
            cacheSize: this.renderCache.size,
            maxSize: this.maxCacheSize
        });
    }

    /**
     * Clear all caches
     */
    clearCache() {
        this.renderCache.clear();
        this.cache.clear();
        console.log('⚡ PerformanceManager: All caches cleared');
    }

    /**
     * Get performance statistics
     */
    getStats() {
        const hitRate = this.stats.totalRequests > 0 
            ? (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(1)
            : 0;
            
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            cacheSize: this.renderCache.size,
            maxCacheSize: this.maxCacheSize
        };
    }

    /**
     * Reset statistics (useful for session tracking)
     */
    resetStats() {
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            totalRequests: 0
        };
        console.log('⚡ PerformanceManager: Statistics reset');
        return this.stats;
    }

    /**
     * Get stats and reset them for next interval
     * Useful for monitoring and reporting
     */
    getStatsAndReset() {
        const stats = this.getStats();
        this.resetStats();
        return stats;
    }

    /**
     * Configure cache size with memory management
     */
    setMaxCacheSize(newSize) {
        if (newSize < 1) {
            console.error('⚡ PerformanceManager: Cache size must be at least 1');
            return false;
        }

        const oldSize = this.maxCacheSize;
        this.maxCacheSize = newSize;

        // If shrinking cache, evict excess items
        if (this.renderCache.size > newSize) {
            const itemsToRemove = this.renderCache.size - newSize;
            let removed = 0;

            while (removed < itemsToRemove && this.renderCache.size > 0) {
                const firstKey = this.renderCache.keys().next().value;
                if (firstKey) {
                    this.renderCache.delete(firstKey);
                    removed++;
                } else {
                    break;
                }
            }

            console.log(`⚡ PerformanceManager: Evicted ${removed} items, cache now ${this.renderCache.size}/${newSize}`);
        }

        // If growing cache, log the change
        if (newSize > oldSize) {
            console.log(`⚡ PerformanceManager: Cache expanded from ${oldSize} to ${newSize}`);
        }

        return true;
    }

    /**
     * Clean up old cache entries based on age
     */
    cleanupOldEntries(maxAgeMs = 300000) { // 5 minutes default
        const now = Date.now();
        let cleaned = 0;

        for (const [key, value] of this.renderCache.entries()) {
            if (value.timestamp && (now - value.timestamp) > maxAgeMs) {
                this.renderCache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`⚡ PerformanceManager: Cleaned up ${cleaned} old cache entries`);
        }

        return cleaned;
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        const entries = Array.from(this.renderCache.entries());
        const totalSize = entries.reduce((sum, [key, value]) => {
            return sum + (JSON.stringify(value).length || 0);
        }, 0);

        return {
            size: this.renderCache.size,
            maxSize: this.maxCacheSize,
            totalSizeBytes: totalSize,
            hitRate: this.stats.totalRequests > 0 ?
                (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(1) + '%' : '0.0%'
        };
    }

    /**
     * Force cache refresh for specific text
     */
    invalidateCache(text, fontName, color, animation) {
        const key = this.generateCacheKey(text, fontName, color, animation);
        const deleted = this.renderCache.delete(key);

        if (deleted) {
            console.log(`⚡ PerformanceManager: Invalidated cache for "${text}"`);
        }

        return deleted;
    }

    /**
     * Preload common fonts
     */
    async preloadFonts(fontManager, commonFonts = ['standard', 'block', 'bubble']) {
        console.log('⚡ PerformanceManager: Preloading common fonts...');
        
        for (const fontName of commonFonts) {
            try {
                fontManager.getFont(fontName);
                console.log(`⚡ Preloaded font: ${fontName}`);
            } catch (error) {
                console.warn(`⚡ Failed to preload font: ${fontName}`, error);
            }
        }
    }

    /**
     * Debounce function calls
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}
