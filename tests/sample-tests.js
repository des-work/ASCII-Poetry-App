/**
 * Sample Unit Tests
 * Demonstrates testing approach for ASCII Art Poetry modules
 * 
 * Run these tests in browser console:
 * 1. Include test-helpers.js in index.html
 * 2. Open browser console
 * 3. Create test instance: const tests = new TestRunner('InputValidator Tests');
 * 4. Add and run tests
 */

// Sample tests for InputValidator
async function runInputValidatorTests() {
    const tester = new TestRunner('InputValidator');

    // Test 1: Valid text
    tester.test('Should accept valid text', async function() {
        const validator = new InputValidator();
        const result = validator.validateText('Hello World');
        tester.assertTrue(result.valid, 'Text validation failed');
        tester.assertEqual(result.value, 'hello world', 'Text not lowercased');
    });

    // Test 2: Empty text
    tester.test('Should reject empty text', async function() {
        const validator = new InputValidator();
        const result = validator.validateText('');
        tester.assertFalse(result.valid, 'Empty text should be invalid');
    });

    // Test 3: Text too long
    tester.test('Should reject text exceeding max length', async function() {
        const validator = new InputValidator({ MAX_TEXT_LENGTH: 10 });
        const result = validator.validateText('This is a very long text');
        tester.assertFalse(result.valid, 'Long text should be invalid');
    });

    // Test 4: Sanitization
    tester.test('Should sanitize dangerous characters', async function() {
        const validator = new InputValidator();
        const result = validator.validateText('<script>alert("xss")</script>');
        tester.assertTrue(result.valid, 'Sanitized text should be valid');
        tester.assertTrue(!result.value.includes('<'), 'HTML tags should be removed');
    });

    // Test 5: Image validation
    tester.test('Should validate image file', async function() {
        const validator = new InputValidator();
        const mockFile = {
            type: 'image/png',
            size: 1024 * 1024 // 1MB
        };
        const result = validator.validateImageFile(mockFile);
        tester.assertTrue(result.valid, 'Valid image should pass');
    });

    // Test 6: Reject non-image file
    tester.test('Should reject non-image file', async function() {
        const validator = new InputValidator();
        const mockFile = {
            type: 'text/plain',
            size: 1024
        };
        const result = validator.validateImageFile(mockFile);
        tester.assertFalse(result.valid, 'Non-image file should be invalid');
    });

    // Test 7: Reject oversized image
    tester.test('Should reject oversized image', async function() {
        const validator = new InputValidator({ MAX_IMAGE_SIZE: 1024 });
        const mockFile = {
            type: 'image/jpeg',
            size: 1024 * 1024 * 20 // 20MB
        };
        const result = validator.validateImageFile(mockFile);
        tester.assertFalse(result.valid, 'Oversized image should be invalid');
    });

    // Test 8: Number range validation
    tester.test('Should validate number ranges', async function() {
        const validator = new InputValidator();
        const result = validator.validateNumberRange(50, 1, 100);
        tester.assertTrue(result.valid, 'Value in range should be valid');
        tester.assertEqual(result.value, 50, 'Value should match');
    });

    // Test 9: Reject out of range number
    tester.test('Should reject number out of range', async function() {
        const validator = new InputValidator();
        const result = validator.validateNumberRange(150, 1, 100);
        tester.assertFalse(result.valid, 'Value out of range should be invalid');
    });

    // Test 10: HTML escaping
    tester.test('Should escape HTML characters', async function() {
        const validator = new InputValidator();
        const text = validator.escapeHtml('<script>alert("test")</script>');
        tester.assertTrue(text.includes('&lt;'), 'Should escape <');
        tester.assertTrue(text.includes('&gt;'), 'Should escape >');
    });

    await tester.run();
}

// Sample tests for PerformanceManager
async function runPerformanceManagerTests() {
    const tester = new TestRunner('PerformanceManager');

    // Test 1: Cache basic functionality
    tester.test('Should cache and retrieve results', async function() {
        const pm = new PerformanceManager({});
        pm.cacheResult('hello', 'standard', 'none', 'none', { ascii: 'HELLO' });
        const result = pm.getCachedResult('hello', 'standard', 'none', 'none');
        tester.assertTrue(result !== null, 'Should retrieve cached result');
    });

    // Test 2: Cache key uniqueness
    tester.test('Should generate unique cache keys', async function() {
        const pm = new PerformanceManager({});
        const key1 = pm.generateCacheKey('hello', 'standard', 'none', 'none');
        const key2 = pm.generateCacheKey('world', 'standard', 'none', 'none');
        tester.assertTrue(key1 !== key2, 'Different inputs should produce different keys');
    });

    // Test 3: Stats tracking
    tester.test('Should track cache statistics', async function() {
        const pm = new PerformanceManager({});
        pm.cacheResult('test', 'standard', 'none', 'none', { ascii: 'TEST' });
        pm.getCachedResult('test', 'standard', 'none', 'none'); // Hit
        pm.getCachedResult('other', 'standard', 'none', 'none'); // Miss
        
        const stats = pm.getStats();
        tester.assertEqual(stats.cacheHits, 1, 'Should track hits');
        tester.assertEqual(stats.cacheMisses, 1, 'Should track misses');
    });

    // Test 4: Stats reset
    tester.test('Should reset statistics', async function() {
        const pm = new PerformanceManager({});
        pm.cacheResult('test', 'standard', 'none', 'none', { ascii: 'TEST' });
        pm.resetStats();
        const stats = pm.getStats();
        tester.assertEqual(stats.totalRequests, 0, 'Stats should be reset');
    });

    // Test 5: Cache size management
    tester.test('Should manage cache size', async function() {
        const pm = new PerformanceManager({ performance: { maxCacheSize: 2 } });
        pm.cacheResult('item1', 'standard', 'none', 'none', { ascii: 'ITEM1' });
        pm.cacheResult('item2', 'standard', 'none', 'none', { ascii: 'ITEM2' });
        pm.cacheResult('item3', 'standard', 'none', 'none', { ascii: 'ITEM3' });
        
        const stats = pm.getStats();
        tester.assertTrue(stats.cacheSize <= 2, 'Cache should not exceed max size');
    });

    await tester.run();
}

// Run all tests
console.log('🧪 Unit Test Samples - Run in browser console:');
console.log('  await runInputValidatorTests()');
console.log('  await runPerformanceManagerTests()');
