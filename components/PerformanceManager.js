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
