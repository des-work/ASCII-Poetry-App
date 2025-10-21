# 🚀 Quick Start - AI ASCII Art

## 3-Step Setup

### 1️⃣ Start OpenWebUI
```bash
docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest
```

### 2️⃣ Start Proxy (new terminal)
```bash
python proxy.py
```

### 3️⃣ Configure App
- Open browser: `http://localhost:8000`
- Click ⚙️ Settings → API tab
- Get API key from OpenWebUI (Settings → API Keys)
- Enter URL: `http://localhost:8000`
- Paste API Key
- Click 🧪 Test Connection

## Use It

1. Click 🤖 **AI Art** button
2. Describe ASCII art: "A dragon breathing fire"
3. Click ✨ **Generate**

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot reach proxy" | Run `python proxy.py` in terminal |
| "API connection failed" | Check OpenWebUI is running at localhost:8000 |
| "No ASCII generated" | Check browser console for errors |
| Slow generation | This is normal - LLMs take time |

## Ports Used

- `8000` - Web app + OpenWebUI
- `8001` - Proxy server

## Full Details

See `SETUP_AI.md` for complete guide.
