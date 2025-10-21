# � ASCII Art Generator - MVP Version

A simplified, working version of the ASCII Art Poetry application focusing on core functionality.

## ✨ Features (MVP)

### � Text to ASCII
- **Text Input**: Simple textarea for entering text
- **Font Selection**: Choose from 6 basic fonts (Standard, Block, Mini, Small, Bubble, 3D)
- **One-Click Generation**: Simple generate button
- **Live Output**: ASCII art displayed in real-time

## � Quick Start

### 1. Start the Server
```bash
# In your terminal:
python -m http.server 8000
```

### 2. Open in Browser
```
http://localhost:8000
```

### 3. Use the App
1. **Enter text** in the textarea (e.g., "HELLO")
2. **Choose a font** from the dropdown
3. **Click "Generate ASCII Art"**
4. **View the result** in the output area

## �️ Architecture

### **Simple & Clean Design:**
```
index.html (Simple layout)
├── Text Input (textarea)
├── Font Selector (dropdown)  
├── Generate Button
└── Output Display (pre element)

script.js (Core logic)
├── FontManager (Font loading)
├── ASCIIRenderer (Text rendering)
└── SimpleASCIIArt (Main app class)
```

### **No Complex Dependencies:**
- ✅ No complex component frameworks
- ✅ No event bus complexity  
- ✅ No state management overhead
- ✅ Direct DOM manipulation for simplicity

## � Testing

### **Basic Test:**
```bash
# 1. Start server: python -m http.server 8000
# 2. Open: http://localhost:8000
# 3. Enter "TEST" and click generate
# 4. Should see ASCII art output
```

### **Console Verification:**
Open browser console (F12) and check for:
```
� Simple ASCII Art Generator - Initializing...
✅ Simple ASCII Art Generator - Ready!
� DOM elements cached
� Event listeners attached
� Generating ASCII art for: [your text]
✅ Generation complete
� ASCII art displayed
```

## � Troubleshooting

### **Common Issues:**

**❌ "This site can't be reached"**
- Make sure server is running: `python -m http.server 8000`
- Check port 8000 is available
- Try `http://127.0.0.1:8000` if localhost doesn't work

**❌ "App not working"**
- Hard refresh: `Ctrl+Shift+R`
- Check browser console for errors
- Ensure JavaScript is enabled

**❌ "No output appears"**
- Check console for error messages
- Verify text input is not empty
- Try different fonts

### **Debug Tools:**
- Open browser console (F12)
- Check for initialization messages
- Look for any error messages

## � File Structure (MVP)

```
/
├── index.html          # Simple UI
├── script.js           # Core application logic
├── styles.css          # Clean styling
├── modules/
│   ├── FontManager.js     # Font definitions & loading
│   ├── ASCIIRenderer.js   # Text to ASCII conversion
│   └── InputValidator.js  # Basic input validation
└── config/
    └── app.config.js      # Configuration settings
```

## � Future Enhancements

Once the MVP is stable, we can add:
- Color options
- Animation effects
- Export functionality
- Image to ASCII
- Poetry mode
- Theme switching

## � Success Criteria

✅ **Server starts without errors**  
✅ **Page loads without JavaScript errors**  
✅ **Text input accepts input**  
✅ **Font selector works**  
✅ **Generate button triggers generation**  
✅ **ASCII art appears in output**  
✅ **No console errors**  

---

**� Ready for testing! The MVP provides a solid foundation for incremental improvements.**
