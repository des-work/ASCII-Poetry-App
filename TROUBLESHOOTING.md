# 🔧 Troubleshooting Guide

## Connection Issues

### ❌ "Proxy: Disconnected"

**Means:** The proxy server is not running on port 8001.

**Fix:**
1. Open a new terminal window
2. Navigate to project: `cd ~/AI\ Programs/ASCII\ ART\ Poetry`
3. Run: `python proxy.py`
4. You should see:
   ```
   🚀 CORS Proxy running on http://localhost:8001
   📍 API endpoint: POST /api/proxy
   📝 Ready to forward requests to OpenWebUI
   ```

### ❌ "OpenWebUI: Disconnected"

**Means:** OpenWebUI is not running or the URL is wrong.

**Fix:**
1. Check if Docker is running: `docker ps`
2. Start OpenWebUI:
   ```bash
   docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest
   ```
3. Wait 30 seconds for it to start
4. Visit `http://localhost:8000` in browser
5. If it works, come back to settings and test again

### ❌ "API Error: 501 Unsupported method"

**Means:** You're calling the Python HTTP server directly instead of through the proxy.

**Fix:** Make sure proxy is running (`python proxy.py`), then test connection button will use it.

### ❌ "API Error: 401 Unauthorized"

**Means:** Your API key is invalid or expired.

**Fix:**
1. Go to `http://localhost:8000` (OpenWebUI)
2. Sign in with your account
3. Click profile icon (top-right)
4. Go to Settings → API Keys
5. Create a NEW API key
6. Copy it and paste in settings
7. Click Test Connection again

## Using the Connection Tester

### 🔍 Auto-Detect Button

Automatically checks both services:
- ✅ Detects if OpenWebUI is running
- ✅ Detects if Proxy is running
- Shows real-time connection log

**Steps:**
1. Open ⚙️ Settings
2. Go to API tab
3. Click 🔍 **Auto-Detect**
4. Watch the connection log fill with results

### 🧪 Test Connection Button

Complete connection test with 3 steps:
1. Checks proxy server (port 8001)
2. Checks OpenWebUI running
3. Validates API key works

**What it tests:**
- ✅ Proxy running on port 8001
- ✅ OpenWebUI accessible
- ✅ API key is valid
- ✅ OpenWebUI accepts API calls

### 📜 Connection Log

Shows real-time status with timestamps:
- 🟢 Green = Success
- 🔴 Red = Error
- 🟡 Yellow = Warning
- 🔵 Blue = Info

## Port Conflicts

### Issue: "Address already in use"

**If proxy won't start:**
```bash
# Find what's using port 8001
lsof -i :8001  # Mac/Linux
netstat -ano | findstr :8001  # Windows
```

**Solutions:**
1. Close the other application
2. Or change proxy port in `proxy.py`:
   ```python
   if __name__ == '__main__':
       run_proxy(8002)  # Use 8002 instead
   ```
   Then update `script.js`:
   ```javascript
   fetch('http://localhost:8002/api/proxy', {
   ```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot reach proxy | Proxy not running | `python proxy.py` |
| Cannot reach OpenWebUI | Docker not running | `docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest` |
| Unauthorized 401 | Bad API key | Create new API key in OpenWebUI |
| Connection timeout | Services too slow | Wait longer, try again |
| CORS errors | Old browser cache | Hard refresh: Ctrl+Shift+R |
| Module not found | Python path issue | Run from project root: `cd ~/AI\ Programs/ASCII\ ART\ Poetry` |

## Step-by-Step Verification

### 1️⃣ Check All Services Running

```bash
# Terminal 1: OpenWebUI
docker ps | grep open-webui

# Terminal 2: Check proxy
curl http://localhost:8001/api/proxy -X OPTIONS

# Terminal 3: Check web server
curl http://localhost:8000
```

### 2️⃣ Verify API Key

1. Open http://localhost:8000
2. Sign in
3. Settings → API Keys
4. If no keys: Create New
5. Copy full key (not partial)

### 3️⃣ Test Configuration In App

1. Paste API key in settings
2. Click 🧪 **Test Connection**
3. Watch connection log
4. Look for all green checkmarks ✓

### 4️⃣ Try Generating

1. Click 🤖 **AI Art** button
2. Type: "A simple tree"
3. Click ✨ **Generate**
4. Wait 10-30 seconds

## Browser Console Debugging

Open browser console (F12 or Ctrl+Shift+K):

```javascript
// Check if app is loaded
console.log(window.app)

// Manual proxy test
fetch('http://localhost:8001/api/proxy', {
    method: 'OPTIONS'
}).then(r => console.log('Proxy OK')).catch(e => console.log('Proxy FAIL'))

// Check settings
console.log(window.app.app.settings)
```

## Advanced Debugging

### Enable Debug Mode

In browser console:
```javascript
window.DEBUG_MODE = true;
```

This will log all API calls to console.

### Check Proxy Logs

Watch the terminal running `proxy.py`:
```
[13:05:21] POST /api/proxy
  → Forwarding to: http://localhost:8000/api/chat/completions
  ✅ Success
```

### Network Inspection

Use browser DevTools (F12):
1. Go to Network tab
2. Click Generate
3. Look for POST to `/api/proxy`
4. Check response for errors

## Still Having Issues?

1. **Close everything** - Stop all terminals/servers
2. **Start fresh** - Open 3 new terminals:
   - Terminal 1: `docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest`
   - Terminal 2: `cd ~/AI\ Programs/ASCII\ ART\ Poetry && python proxy.py`
   - Terminal 3: `cd ~/AI\ Programs/ASCII\ ART\ Poetry && python -m http.server 8000`
3. **Wait 30 seconds** - Let services initialize
4. **Refresh browser** - Hard refresh (Ctrl+Shift+R)
5. **Test again** - Click Auto-Detect or Test Connection

## Getting Help

When reporting issues, include:
- Output from `python proxy.py`
- Output from browser console (F12)
- Output from docker logs: `docker logs open-webui`
- Screenshot of connection log
- Steps you took to reproduce
