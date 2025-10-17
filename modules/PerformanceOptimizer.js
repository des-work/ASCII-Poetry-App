/**
 * Performance Optimizer
 * Provides memoization, caching, debouncing, and throttling utilities
 * 
 * Features:
 * - LRU cache with automatic size management
 * - Function memoization
 * - Debouncing for delayed execution
 * - Throttling for rate limiting
 * - Performance monitoring
 */
class PerformanceOptimizer {
    constructor(options = {}) {
        this.maxCacheSize = options.maxCacheSize || 100;
        this.cache = new Map();
        this.performanceMetrics = {
            cacheHits: 0,
            cacheMisses: 0,
            totalCalls: 0
        };
        console.log('⚡ PerformanceOptimizer initialized');
    }

    /**
     * Memoize a function with automatic caching
     * @param {Function} fn - Function to memoize
     * @param {Function} keyGenerator - Function to generate cache key from arguments
     * @returns {Function} Memoized function
     */
    memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
        return (...args) => {
            this.performanceMetrics.totalCalls++;
            
            const key = keyGenerator(...args);
            
            // Check cache
            if (this.cache.has(key)) {
                this.performanceMetrics.cacheHits++;
                return this.cache.get(key);
            }
            
            // Cache miss - compute result
            this.performanceMetrics.cacheMisses++;
            const result = fn(...args);
            
            // Manage cache size (LRU)
            if (this.cache.size >= this.maxCacheSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            
            this.cache.set(key, result);
            return result;
        };
    }

    /**
     * Debounce a function (delay execution until after wait time)
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(fn, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    /**
     * Throttle a function (limit execution rate)
     * @param {Function} fn - Function to throttle
     * @param {number} limit - Minimum time between calls in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(fn, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Create a cached version of an async function
     * @param {Function} asyncFn - Async function to cache
     * @param {number} ttl - Time to live in milliseconds (0 = forever)
     * @returns {Function} Cached async function
     */
    cacheAsync(asyncFn, ttl = 0) {
        const cache = new Map();
        
        return async (...args) => {
            const key = JSON.stringify(args);
            
            // Check if cached and not expired
            if (cache.has(key)) {
                const { value, timestamp } = cache.get(key);
                if (ttl === 0 || Date.now() - timestamp < ttl) {
                    return value;
                }
                cache.delete(key);
            }
            
            // Compute and cache
            const value = await asyncFn(...args);
            cache.set(key, {
                value,
                timestamp: Date.now()
            });
            
            return value;
        };
    }

    /**
     * Measure execution time of a function
     * @param {Function} fn - Function to measure
     * @param {string} label - Label for logging
     * @returns {Function} Wrapped function that logs execution time
     */
    measurePerformance(fn, label = 'Function') {
        return (...args) => {
            const start = performance.now();
            const result = fn(...args);
            const end = performance.now();
            console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    /**
     * Measure execution time of an async function
     * @param {Function} asyncFn - Async function to measure
     * @param {string} label - Label for logging
     * @returns {Function} Wrapped async function that logs execution time
     */
    measureAsyncPerformance(asyncFn, label = 'Async Function') {
        return async (...args) => {
            const start = performance.now();
            const result = await asyncFn(...args);
            const end = performance.now();
            console.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    /**
     * Clear the memoization cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ PerformanceOptimizer cache cleared');
    }

    /**
     * Get performance statistics
     * @returns {Object} Performance metrics
     */
    getMetrics() {
        const hitRate = this.performanceMetrics.totalCalls > 0
            ? (this.performanceMetrics.cacheHits / this.performanceMetrics.totalCalls * 100).toFixed(2)
            : 0;
            
        return {
            ...this.performanceMetrics,
            cacheSize: this.cache.size,
            maxCacheSize: this.maxCacheSize,
            hitRate: `${hitRate}%`
        };
    }

    /**
     * Reset performance metrics
     */
    resetMetrics() {
        this.performanceMetrics = {
            cacheHits: 0,
            cacheMisses: 0,
            totalCalls: 0
        };
    }

    /**
     * Batch multiple operations
     * @param {Function[]} operations - Array of functions to execute
     * @param {number} batchSize - Number of operations per batch
     * @param {number} delay - Delay between batches in ms
     * @returns {Promise<Array>} Results of all operations
     */
    async batch(operations, batchSize = 5, delay = 0) {
        const results = [];
        
        for (let i = 0; i < operations.length; i += batchSize) {
            const batch = operations.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(op => op()));
            results.push(...batchResults);
            
            if (delay > 0 && i + batchSize < operations.length) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        return results;
    }

    /**
     * Create a rate-limited queue processor
     * @param {number} maxPerSecond - Maximum operations per second
     * @returns {Function} Queue processor function
     */
    createRateLimiter(maxPerSecond) {
        const queue = [];
        const interval = 1000 / maxPerSecond;
        let processing = false;

        const processQueue = async () => {
            if (queue.length === 0) {
                processing = false;
                return;
            }

            processing = true;
            const { fn, resolve, reject } = queue.shift();

            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                reject(error);
            }

            setTimeout(processQueue, interval);
        };

        return (fn) => {
            return new Promise((resolve, reject) => {
                queue.push({ fn, resolve, reject });
                if (!processing) {
                    processQueue();
                }
            });
        };
    }

    /**
     * Lazy evaluation wrapper
     * @param {Function} fn - Function to wrap
     * @returns {Function} Function that returns a lazy evaluator
     */
    lazy(fn) {
        let evaluated = false;
        let result;

        return () => {
            if (!evaluated) {
                result = fn();
                evaluated = true;
            }
            return result;
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

