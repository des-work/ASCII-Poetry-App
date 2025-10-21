# 🚀 Quick Reference - Launch Mechanism

## Console Commands (Copy & Paste)

### Check App Status
```javascript
console.log(window.app)
```

### Test Output Display
```javascript
window.app.testOutput('HELLO WORLD')
```

### Run Full Diagnostics
```javascript
window.app.diagnose()
```

### Debug Output Components
```javascript
window.app.debugOutput()
```

### Manual Generation via EventBus
```javascript
window.app.eventBus.emit('request:text:gen', {
    text: 'YOUR TEXT HERE',
    fontName: 'standard',
    color: 'rainbow',
    animation: 'glow'
});
```

## Available Components

```javascript
// Services
window.app.eventBus              // Central event system
window.app.generationService     // Generation engine
window.app.performanceManager    // Cache & performance

// UI
window.app.uiController          // Main UI controller
window.app.displayManager        // Display coordinator
window.app.outputPanel           // Output display

// Input
window.app.inputReader           // Read DOM inputs
window.app.inputManager          // Input management

// Font
window.app.fontManager           // Font management
window.app.fontSwitcher          // Font switching

// Utilities
window.app.DiagnosticHelper      // Diagnostic tools
```

## 7-Phase Initialization

```
Phase 1: Core Utilities
    ↓
Phase 2: Services & Managers
    ↓
Phase 3: UI Components
    ↓
Phase 4: Enhancements
    ↓
Phase 5: System Verification
    ↓
Phase 6: Public API Exposure
    ↓
Phase 7: Build Info & Complete
```

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App not initializing | Check console for Phase X error |
| Output not displaying | Run `window.app.testOutput('TEST')` |
| Events not firing | Check `window.app.eventBus` subscription |
| Font not changing | Run `window.app.diagnose()` |
| Need component access | Use `window.app.COMPONENT_NAME` |

## Event Names

```javascript
// Emit events
'request:text:gen'          // Request text generation
'request:image:gen'         // Request image generation
'request:poetry:gen'        // Request poetry generation

// Listen for events
'text:gen:complete'         // Text generation complete
'image:gen:complete'        // Image generation complete
'poetry:gen:complete'       // Poetry generation complete
'text:gen:error'            // Text generation error
'font:changed'              // Font changed
```

## DOM Elements Referenced

```javascript
document.getElementById('text-input')          // Text input
document.getElementById('image-input')         // Image input
document.getElementById('poem-input')          // Poetry input
document.getElementById('font-select')         // Font selector
document.getElementById('color-select')        // Color selector
document.getElementById('animation-select')    // Animation selector
document.getElementById('generate-main')       // Generate button
document.getElementById('ascii-output')        // Output display
document.getElementById('build-id')            // Build ID
```

## Performance Metrics

```javascript
// Check initialization time (approximate)
// Watch console timing: "Build: XXXXXXXXXX"

// Access cache stats
window.app.performanceManager.stats()
```

## Debug Flow

### Step 1: Verify Initialization
```javascript
console.log('App Ready:', !!window.app)
```

### Step 2: Test Output
```javascript
window.app.testOutput('TEST')
```

### Step 3: Check Input Reading
```javascript
const input = window.app.inputReader.readAll()
console.log('Input:', input)
```

### Step 4: Manual Generation
```javascript
window.app.eventBus.emit('request:text:gen', {
    text: input.text,
    fontName: input.font,
    color: 'none'
})
```

### Step 5: Check Output
```javascript
window.app.outputPanel.debug()
```

## Common Issues & Fixes

### "window.app is undefined"
- Wait for DOMContentLoaded
- Check browser console for errors
- Refresh page

### Output not visible
- Run: `window.app.testOutput('HELLO')`
- Check: `window.app.outputPanel.debug()`
- Verify: CSS is not hiding output

### Input not reading
- Check: `window.app.inputReader.readAll()`
- Verify: Input elements exist in DOM
- Test: `document.getElementById('text-input')`

### Font not changing
- Check: `window.app.fontManager`
- Verify: Font selected exists
- Try: Manual generation with specific font

## File References

| File | Purpose |
|------|---------|
| `app-new.js` | Main launcher |
| `index.html` | HTML with script loading order |
| `APP_LAUNCH_GUIDE.md` | Detailed guide |
| `LAUNCH_MECHANISM_UPDATE.md` | Technical docs |
| `ARCHITECTURE_DIAGRAM.md` | Visual diagrams |
| `LAUNCH_SUMMARY.md` | Executive summary |

## Environment Info

```javascript
// Get build info
document.getElementById('build-id').textContent

// Check app version
// Version: 3.0 (from console message)

// Check system ready status
console.log(window.app)
```

## Testing Checklist

- [ ] Console shows "APPLICATION INITIALIZED SUCCESSFULLY"
- [ ] `window.app` is defined
- [ ] `window.app.diagnose()` shows all systems OK
- [ ] `window.app.testOutput('TEST')` displays text
- [ ] Can select different fonts
- [ ] Can change colors
- [ ] Generation emits events correctly
- [ ] Output updates on new generation

## Next Steps

1. **Open DevTools** - Press F12
2. **Go to Console** - Click Console tab
3. **Run diagnostics** - Paste: `window.app.diagnose()`
4. **Test output** - Paste: `window.app.testOutput('HELLO')`
5. **Try generation** - Use the UI or paste event command

## Key Takeaways

✅ **7-phase initialization** ensures proper setup
✅ **System verification** catches errors early
✅ **Public API** makes debugging easy
✅ **Professional logging** shows progress
✅ **Comprehensive docs** support development

---

## Need Help?

1. Check console for error messages
2. Run `window.app.diagnose()` for detailed status
3. Review `APP_LAUNCH_GUIDE.md` for full documentation
4. Check `ARCHITECTURE_DIAGRAM.md` for visual overview
