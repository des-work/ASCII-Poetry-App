# 🤖 AI ASCII Art Generator - Setup Guide

## Overview

The AI ASCII Art feature uses **OpenWebUI** as the LLM provider and a **Python proxy server** to handle API requests with CORS support.

## Architecture

```
Browser (localhost:8000)
    ↓
Proxy Server (localhost:8001)
    ↓
OpenWebUI API (localhost:8000 or remote)
```

## Prerequisites

- Python 3.7+
- Docker (for OpenWebUI)
- A text editor or IDE

## Quick Start

### Step 1: Start OpenWebUI

**Option A: Local Docker (Recommended)**
```bash
docker run -d \
  --name open-webui \
  -p 8000:8000 \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:latest
```

**Option B: Remote Server**
- Use any existing OpenWebUI instance
- Example: `http://your-server.com:8080`

Then access OpenWebUI at `http://localhost:8000`

### Step 2: Create API Key

1. Go to **OpenWebUI** (http://localhost:8000)
2. **Sign up** or **log in**
3. Click your profile icon (top-right)
4. Go to **Settings**
5. Click **API Keys**
6. Click **+ Create New API Key**
7. Copy the key (you'll need this)

### Step 3: Start Proxy Server

Open a new terminal in your project directory:

```bash
python proxy.py
```

You should see:
```
🚀 CORS Proxy running on http://localhost:8001
📍 API endpoint: POST /api/proxy
📝 Ready to forward requests to OpenWebUI
```

### Step 4: Configure in App

1. Open the app in browser: http://localhost:8000
2. Click ⚙️ **Settings** button (top-right)
3. Go to **API** tab
4. Enter:
   - **API URL**: `http://localhost:8000` (or your remote URL)
   - **API Key**: Paste the key from Step 2
   - **Model Name**: `mistral` (or your preferred model)
   - **Temperature**: `0.7` (0=focused, 1=creative)
   - **Max Tokens**: `1000`
5. Click **🧪 Test Connection**
6. You should see: ✅ "API connection successful!"

### Step 5: Generate ASCII Art

1. Click **🤖 AI Art** mode button
2. Type a description: "A dragon breathing fire"
3. Click **✨ Generate**
4. Wait for AI-generated ASCII art!

## Troubleshooting

### ❌ "Cannot reach proxy server"
- Make sure `proxy.py` is running
- Check it's on port 8001: `python proxy.py`
- Look for: `🚀 CORS Proxy running on http://localhost:8001`

### ❌ "API connection failed"
- Verify OpenWebUI is running
- Check API URL is correct
- Verify API key is valid (create a new one if needed)
- Look at terminal output from `proxy.py` for details

### ❌ "Cannot reach API server"
- OpenWebUI might be down
- Try: `http://localhost:8000` in your browser
- Check Docker logs: `docker logs open-webui`

### ❌ Slow generation
- This is normal - LLMs take time
- Temperature affects speed (higher = slower)
- Max tokens affects output length
- Try with shorter prompts first

### ⚠️ CORS Errors (shouldn't happen)
- The proxy handles CORS
- If you see CORS errors, restart proxy: `python proxy.py`

## Running Everything

You'll need **3 terminal windows**:

**Terminal 1: OpenWebUI**
```bash
docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest
```
(or use existing instance)

**Terminal 2: Proxy Server**
```bash
cd ~/AI\ Programs/ASCII\ ART\ Poetry
python proxy.py
```

**Terminal 3: Web Server** (if needed)
```bash
cd ~/AI\ Programs/ASCII\ ART\ Poetry
python -m http.server 8000
```

Wait 2-3 seconds between starting services for proper initialization.

## Configuration Reference

### Settings (stored in browser)

| Setting | Description | Default |
|---------|-------------|---------|
| API URL | OpenWebUI endpoint | `http://localhost:8000` |
| API Key | Your OpenWebUI API key | (empty) |
| Model | LLM model to use | `mistral` |
| Temperature | Creativity level (0.0-1.0) | 0.7 |
| Max Tokens | Max response length | 1000 |

### Supported Models in OpenWebUI

- `mistral` - Fast, creative
- `llama2` - Balanced
- `neural-chat` - Conversational
- `orca-mini` - Lightweight
- Any installed model in your OpenWebUI instance

## API Request Flow

1. **Browser** sends prompt to proxy
2. **Proxy** validates request, adds CORS headers
3. **Proxy** forwards to OpenWebUI with API key
4. **OpenWebUI** generates ASCII art via LLM
5. **Proxy** returns response to browser
6. **Browser** displays in output panel

## Security Notes

- ✅ API keys stored in browser localStorage only
- ✅ Never sent to external servers
- ✅ Proxy validates all requests
- ✅ CORS headers prevent abuse

## Advanced Usage

### Change Proxy Port
Edit `proxy.py` last line:
```python
if __name__ == '__main__':
    run_proxy(8001)  # Change 8001 to your port
```

Then update `script.js`:
```javascript
const response = await fetch('http://localhost:YOUR_PORT/api/proxy', {
```

### Use Remote OpenWebUI
In settings, change API URL to:
```
https://your-openwebui-server.com:8000
```

### Custom LLM Prompts
Edit `script.js` `generateAI()` method:
```javascript
content: `Your custom prompt here: ${prompt}`
```

## Tips & Tricks

🎨 **Better ASCII Art:**
- Be descriptive: "A detailed medieval castle with towers and moat"
- Include style: "ASCII art with high contrast using block characters"
- Specify size: "Create a 40-line ASCII art"

⚡ **Faster Generation:**
- Lower temperature (0.3-0.5)
- Reduce max tokens (500)
- Use simpler prompts

🎯 **Better Results:**
- Start with examples
- Refine prompts based on results
- Try different models

## Support

Issues? Check:
1. Proxy running? (port 8001)
2. OpenWebUI running? (port 8000)
3. API key valid?
4. Try test connection button
5. Check browser console for errors

## License & Credits

- **OpenWebUI**: https://openwebui.com
- **Proxy**: Custom implementation
- **ASCII Generator**: Built-in fonts and rendering
