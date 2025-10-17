// Input Validator Module - Centralized validation logic

class InputValidator {
    constructor(config = {}) {
        this.config = {
            MAX_TEXT_LENGTH: config.MAX_TEXT_LENGTH || 5000,
            MAX_KEYWORDS: config.MAX_KEYWORDS || 20,
            MAX_IMAGE_SIZE: config.MAX_IMAGE_SIZE || 10 * 1024 * 1024, // 10MB
            SUPPORTED_IMAGE_TYPES: config.SUPPORTED_IMAGE_TYPES || [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp'
            ]
        };
    }

    /**
     * Sanitize text input by removing dangerous characters
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        // Remove potentially dangerous characters but keep ASCII art friendly ones
        return input.replace(/[<>]/g, '');
    }

    /**
     * Validate text input
     * @param {string} text - Text to validate
     * @returns {Object} validation result
     */
    validateText(text) {
        if (!text || typeof text !== 'string') {
            return { valid: false, error: 'Please enter some text' };
        }

        const sanitized = this.sanitizeInput(text.trim());
        
        if (!sanitized) {
            return { valid: false, error: 'Please enter some text' };
        }

        if (sanitized.length > this.config.MAX_TEXT_LENGTH) {
            return {
                valid: false,
                error: `Text too long! Maximum ${this.config.MAX_TEXT_LENGTH} characters allowed`
            };
        }

        return { valid: true, value: sanitized };
    }

    /**
     * Validate image file
     * @param {File} file - File to validate
     * @returns {Object} validation result
     */
    validateImageFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (!this.config.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Unsupported file type. Please use: ${this.config.SUPPORTED_IMAGE_TYPES.join(', ')}`
            };
        }

        if (file.size > this.config.MAX_IMAGE_SIZE) {
            const sizeMB = (this.config.MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(0);
            return {
                valid: false,
                error: `File too large. Maximum size: ${sizeMB}MB`
            };
        }

        return { valid: true, value: file };
    }

    /**
     * Validate keyword
     * @param {string} keyword - Keyword to validate
     * @param {number} currentCount - Current keyword count
     * @returns {Object} validation result
     */
    validateKeyword(keyword, currentCount = 0) {
        if (!keyword || typeof keyword !== 'string') {
            return { valid: false, error: 'Invalid keyword' };
        }

        const sanitized = this.sanitizeInput(keyword.trim());

        if (!sanitized) {
            return { valid: false, error: 'Keyword cannot be empty' };
        }

        if (currentCount >= this.config.MAX_KEYWORDS) {
            return {
                valid: false,
                error: `Maximum ${this.config.MAX_KEYWORDS} keywords allowed`
            };
        }

        return { valid: true, value: sanitized.toLowerCase() };
    }

    /**
     * Validate number within range
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {Object} validation result
     */
    validateNumberRange(value, min, max) {
        const num = parseInt(value);
        
        if (isNaN(num)) {
            return { valid: false, error: 'Invalid number' };
        }

        if (num < min || num > max) {
            return {
                valid: false,
                error: `Value must be between ${min} and ${max}`
            };
        }

        return { valid: true, value: num };
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
}

