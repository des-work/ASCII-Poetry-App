/**
 * Application Bootstrap
 * Initializes and coordinates all components
 * Maintains backward compatibility while using new architecture
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing ASCII Art Poetry Application...');
    
    try {
        // Initialize the original working application
        // This ensures buttons work immediately
        const app = new ASCIIArtGenerator();
        
        // Store globally for debugging
        window.app = app;
        
        console.log('✅ Application initialized successfully');
        console.log('💡 Tip: Open DevTools Console to see debug logs');
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        
        // Show user-friendly error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 10px;
            font-family: monospace;
            z-index: 99999;
            max-width: 500px;
        `;
        errorDiv.innerHTML = `
            <h2>⚠️ Application Error</h2>
            <p>The application failed to initialize. Please refresh the page.</p>
            <p style="font-size: 0.8em; opacity: 0.7;">Error: ${error.message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: red;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
                font-weight: bold;
            ">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Expose for debugging in production
window.addEventListener('load', () => {
    console.log('%c ASCII Art Poetry App ', 'background: #667eea; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Buttons should be working! ', 'background: #51cf66; color: white; font-size: 16px; padding: 5px;');
    console.log('');
    console.log('Debug commands:');
    console.log('  window.app - Access main application instance');
    console.log('  window.app.getFont("standard") - Get a font');
    console.log('  window.app.keywords - View current keywords');
    console.log('');
});

