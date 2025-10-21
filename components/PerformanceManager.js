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
     */
    generateCacheKey(text, fontName, color, animation) {
        return `${text.toLowerCase()}|${fontName}|${color}|${animation}`;
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
     * Cache rendering result
     */
    cacheResult(text, fontName, color, animation, result) {
        const key = this.generateCacheKey(text, fontName, color, animation);
        
        // Manage cache size (LRU)
        if (this.renderCache.size >= this.maxCacheSize) {
            const firstKey = this.renderCache.keys().next().value;
            this.renderCache.delete(firstKey);
        }
        
        this.renderCache.set(key, result);
        console.log('⚡ PerformanceManager: Cached result for', key);
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
