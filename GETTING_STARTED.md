# 🚀 Getting Started with AI ASCII Art

## The Problem

Your app shows the connection log is detecting:
- ✅ **OpenWebUI is running** ← Good!
- ❌ **Proxy server NOT running** ← Need to fix this!

## The Solution

You need to start the **Proxy Server** which forwards API calls from browser to OpenWebUI.

## 🎯 Quick Fix - Windows Users

### Option 1: Automatic (Easiest)
1. **Double-click** `start_all.bat` in project folder
2. A new window opens starting proxy
3. Done! ✅

### Option 2: Manual
1. **Open new terminal** in project folder
2. Run: `python proxy.py`
3. You should see:
   ```
   🚀 CORS Proxy running on http://localhost:8001
   📍 API endpoint: POST /api/proxy
   📝 Ready to forward requests to OpenWebUI
   ```

## 🎯 Quick Fix - Mac/Linux Users

1. **Open new terminal** in project folder
2. Run: `bash start_all.sh`
3. All services start automatically!

## ✅ Verify It Works

1. Refresh browser: `http://localhost:8000`
2. Click ⚙️ **Settings** → **API** tab
3. Click 🔍 **Auto-Detect**
4. Watch connection log:
   - Should see OpenWebUI: ✅ Connected
   - Should see Proxy: ✅ Connected
5. If both green, you're ready! 🎉

## 📋 What Services Need Running

| Service | Port | Status | Fix |
|---------|------|--------|-----|
| OpenWebUI | 8000 | ✅ Running | Already works |
| Proxy | 8001 | ❌ **NOT running** | Run `python proxy.py` |
| Web Server | 8000 | ✅ Running | Already works |

## 🔧 Terminal Setup (If Manual)

You need **2 terminals**:

**Terminal 1: Already running**
```bash
python -m http.server 8000
# Your web server
```

**Terminal 2: NEW - Start proxy**
```bash
cd "C:\Users\desmo\AI Programs\ASCII ART Poetry"
python proxy.py
```

Once both are running, refresh and test connection!

## 🎮 Then Use It

1. Click 🤖 **AI Art** button
2. Type: "A dragon breathing fire"
3. Click ✨ **Generate**
4. Wait 10-30 seconds
5. See AI-generated ASCII art! 🎨

## 📚 More Help

- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Full Setup**: See `SETUP_AI.md`
- **Quick Reference**: See `QUICK_START.md`

## 💡 Next Steps

1. Start proxy: `python proxy.py`
2. Refresh browser
3. Click Auto-Detect
4. Enjoy AI ASCII art! 🚀
