# ✅ Fixed Setup - Port Configuration

## The Problem We Solved

**Port Conflict:** Both the web app and OpenWebUI were trying to use port 8000, causing them to fight for the same port.

## The Solution

We use **3 different ports** to avoid conflicts:

```
🌐 Web App (Your ASCII Generator):     http://localhost:3000
🔌 Proxy Server (API Forwarder):       http://localhost:8001  
🤖 OpenWebUI (LLM Interface):          http://localhost:8000
```

## 🚀 Quick Start (Windows)

### Option 1: Automatic (Easiest) ⭐
```batch
double-click start_all.bat
```
This starts all three services automatically!

### Option 2: Manual Setup

**Terminal 1: OpenWebUI**
```bash
docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest
```

**Terminal 2: Proxy**
```bash
cd C:\Users\desmo\AI\ Programs\ASCII\ ART\ Poetry
python proxy.py
```

**Terminal 3: Web App**
```bash
cd C:\Users\desmo\AI\ Programs\ASCII\ ART\ Poetry
python -m http.server 3000
```

## 🚀 Quick Start (Mac/Linux)

```bash
bash start_all.sh
```

This starts all three services automatically!

## ✅ Verify Everything Works

1. **Check OpenWebUI**: Visit `http://localhost:8000`
   - Should load the interface
   - Sign in with your account

2. **Check Web App**: Visit `http://localhost:3000`
   - Should see the ASCII generator UI
   - Settings button visible in top-right

3. **Check Proxy**: Run in terminal:
   ```bash
   curl -X OPTIONS http://localhost:8001/api/proxy
   ```
   - Should return 200 OK

## 📋 Service Status Table

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Web App | 3000 | http://localhost:3000 | ✅ Your app |
| Proxy | 8001 | http://localhost:8001 | ✅ Forwarder |
| OpenWebUI | 8000 | http://localhost:8000 | ✅ LLM Interface |

## 🔑 Getting API Key

1. Open `http://localhost:8000` in browser
2. Sign in with your account
3. Click profile icon → **Settings**
4. Click **API Keys** → **+ Create New**
5. Copy the full API key

## 🎮 Configuration in App

1. Open `http://localhost:3000`
2. Click ⚙️ **Settings** → **API** tab
3. Leave **API URL** as: `http://localhost:8000`
4. Paste your **API Key**
5. Click 💾 **Save Settings**
6. Click 🧪 **Test Connection**

## 🎨 Using AI Art Generation

1. Click 🤖 **AI Art** button
2. Type your prompt: "A dragon breathing fire"
3. Click ✨ **Generate**
4. Wait 10-30 seconds
5. See your AI-generated ASCII art!

## 🐛 Troubleshooting

### "Cannot reach OpenWebUI"
- Check: Is `http://localhost:8000` working?
- Fix: Restart Docker container

### "Proxy Disconnected"
- Check: Is proxy running? 
- Fix: Run `python proxy.py`

### "API Error"
- Check: Is API key correct?
- Fix: Create new key in OpenWebUI, save in settings

### Port Already in Use
```bash
# Find what's using a port
lsof -i :8000   # OpenWebUI
lsof -i :8001   # Proxy
lsof -i :3000   # Web App

# Stop conflicting service
kill -9 <PID>
```

## 📚 Files to Know

- **`start_all.bat`** - Windows startup (does everything)
- **`start_all.sh`** - Mac/Linux startup (does everything)
- **`proxy.py`** - The proxy server
- **`script.js`** - Main app logic
- **`index.html`** - App interface

## 🚀 Recommended Workflow

1. **Start everything**: `start_all.bat` or `bash start_all.sh`
2. **Get API key**: `http://localhost:8000` → Sign in → Settings → API Keys
3. **Configure app**: `http://localhost:3000` → ⚙️ Settings → Paste key
4. **Test**: Click 🧪 Test Connection
5. **Generate**: Click 🤖 AI Art → Type → Generate!

## ✨ All Systems Ready!

- ✅ Web App on port 3000
- ✅ Proxy on port 8001
- ✅ OpenWebUI on port 8000
- ✅ No port conflicts
- ✅ Ready for AI generation!

**Next: Get your API key from OpenWebUI and start generating!** 🎉
