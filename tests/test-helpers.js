/**
 * Test Helpers and Utilities
 * Basic testing framework for ASCII Art Poetry
 */

class TestRunner {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    /**
     * Add a test
     */
    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    /**
     * Assert equal
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
        }
    }

    /**
     * Assert true
     */
    assertTrue(value, message) {
        if (value !== true) {
            throw new Error(message || 'Assertion failed: value is not true');
        }
    }

    /**
     * Assert false
     */
    assertFalse(value, message) {
        if (value !== false) {
            throw new Error(message || 'Assertion failed: value is not false');
        }
    }

    /**
     * Assert throws
     */
    assertThrows(fn, message) {
        try {
            fn();
            throw new Error(message || 'Assertion failed: expected function to throw');
        } catch (error) {
            // Expected
        }
    }

    /**
     * Run all tests
     */
    async run() {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🧪 Running test suite: ${this.name}`);
        console.log(`${'='.repeat(60)}\n`);

        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${description}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${description}`);
                console.error(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        this.printSummary();
    }

    /**
     * Print summary
     */
    printSummary() {
        const total = this.passed + this.failed;
        const percentage = total > 0 ? ((this.passed / total) * 100).toFixed(1) : 0;

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 Test Results: ${this.name}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Success Rate: ${percentage}%`);
        console.log(`${'='.repeat(60)}\n`);

        return {
            passed: this.passed,
            failed: this.failed,
            total: total,
            percentage: parseFloat(percentage)
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestRunner };
}
