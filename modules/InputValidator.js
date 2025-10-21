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
     * Sanitize text input by removing dangerous characters while preserving ASCII art
     * Prevents XSS and other injection attacks
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        // Remove HTML/XML tags and dangerous control characters
        // But preserve ASCII art friendly characters
        let sanitized = input
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control chars except tabs/newlines
        
        // Also remove < and > to prevent HTML injection
        sanitized = sanitized.replace(/[<>]/g, '');
        
        return sanitized;
    }

    /**
     * Escape HTML special characters for safe display
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (typeof text !== 'string') {
            return '';
        }
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, (char) => map[char]);
    }

    /**
     * Validate and sanitize text input with comprehensive checks
     * @param {string} text - Text to validate
     * @returns {Object} validation result with sanitized value
     */
    validateText(text) {
        // Type check
        if (text === null || text === undefined) {
            return { valid: false, error: 'Text input is required' };
        }

        if (typeof text !== 'string') {
            return { valid: false, error: 'Text must be a string value' };
        }

        // Empty check
        const trimmed = text.trim();
        if (!trimmed) {
            return { valid: false, error: 'Please enter some text to generate ASCII art' };
        }

        // Length check
        if (trimmed.length > (this.config?.MAX_TEXT_LENGTH || 5000)) {
            return {
                valid: false,
                error: `Text too long! Maximum ${(this.config?.MAX_TEXT_LENGTH || 5000)} characters allowed (current: ${trimmed.length})`
            };
        }

        // Content validation
        if (trimmed.length < (this.config?.MIN_TEXT_LENGTH || 1)) {
            return {
                valid: false,
                error: `Text too short! Minimum ${(this.config?.MIN_TEXT_LENGTH || 1)} character(s) required`
            };
        }

        // Sanitize input
        const sanitized = this.sanitizeInput(trimmed);

        // Check if sanitization removed all content
        if (!sanitized || !sanitized.trim()) {
            return {
                valid: false,
                error: 'Text contains only invalid characters'
            };
        }

        // Check for suspicious patterns
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /onload=/i,
            /onerror=/i
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(text)) {
                return {
                    valid: false,
                    error: 'Text contains potentially unsafe content'
                };
            }
        }

        return {
            valid: true,
            value: sanitized,
            originalLength: text.length,
            sanitizedLength: sanitized.length
        };
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

