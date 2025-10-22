# 🔍 Diagnostic Plan - Connection Troubleshooting

## Current Status from Your Screenshot

The connection log shows:
```
❌ Proxy not detected on port 8001
💡 Run: python proxy.py in a new terminal
```

**This means:** The app is looking for the proxy but can't find it.

## Investigation Strategy

We'll check each component systematically to find the issue.

---

## Phase 1: Service Status Check

### Check 1.1: What processes are currently running?

**Windows:**
```bash
tasklist | findstr python
tasklist | findstr docker
```

**Mac/Linux:**
```bash
ps aux | grep python
ps aux | grep docker
```

**What to look for:**
- `python proxy.py` or similar ✅
- `docker` or container process ✅
- `http.server` ✅

---

### Check 1.2: Port availability

**Windows:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :8001
```

**Mac/Linux:**
```bash
lsof -i :3000
lsof -i :8000
lsof -i :8001
```

**What to look for:**
- Port 3000: Your web app should be listening ✅
- Port 8000: Docker/OpenWebUI should be listening ✅
- Port 8001: Proxy should be listening ✅

If any show `(Not listening)` or are empty → that service isn't running!

---

## Phase 2: Direct Service Testing

### Check 2.1: Is the proxy actually running?

**Open a new terminal and run:**
```bash
curl -v -X OPTIONS http://localhost:8001/api/proxy
```

**Expected response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
```

**If you get:**
- `Connection refused` → Proxy not running
- `Network is unreachable` → Port issue
- `200 OK` → Proxy IS running! ✓

---

### Check 2.2: Is OpenWebUI running?

**Open a browser and visit:**
```
http://localhost:8000
```

**Expected:** OpenWebUI login page loads

**If you get:**
- Blank page/error → OpenWebUI not running
- Login page → OpenWebUI IS running! ✓

---

### Check 2.3: Is the web app running?

**Open a browser and visit:**
```
http://localhost:3000
```

**Expected:** ASCII Art Generator loads

**If you get:**
- Blank page/error → Web app not running
- Your app loads → Web app IS running! ✓

---

## Phase 3: Docker-Specific Checks

### Check 3.1: Docker containers

```bash
docker ps
```

**Expected output should include:**
```
CONTAINER ID    IMAGE                                  STATUS
abc123def456    ghcr.io/open-webui/open-webui:latest  Up 2 minutes
```

**If you see:**
- Nothing/empty → No containers running
- The container listed → OpenWebUI IS running! ✓

---

### Check 3.2: Docker logs

If container IS running but port 8000 isn't responding:

```bash
docker logs open-webui
```

**Look for:**
- Any error messages
- Port binding information
- Startup failures

---

## Phase 4: Proxy Server Debugging

### Check 4.1: Start proxy manually with debug output

```bash
cd C:\Users\desmo\AI\ Programs\ASCII\ ART\ Poetry
python proxy.py
```

**Watch for:**
- ✅ `🚀 CORS Proxy running on http://localhost:8001`
- ✅ `📍 API endpoint: POST /api/proxy`
- ❌ Any error messages?
- ❌ Does it hang/freeze?

**If proxy starts fine:**
- Leave it running
- Try connection test again in app

**If proxy fails:**
- Copy error message
- Check Python version: `python --version`
- Check if port 8001 is already in use

---

## Phase 5: Network Communication Check

### Check 5.1: Test proxy can reach OpenWebUI

**In a new terminal, test the proxy:**

```bash
curl -X POST http://localhost:8001/api/proxy \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:8000/api/test",
    "apiKey": "test",
    "data": {}
  }'
```

**What this does:** Tests if proxy can actually reach OpenWebUI

**Expected:** Some response (even if error is OK at this point)

---

## Phase 6: Browser/App Debugging

### Check 6.1: Browser console errors

1. Open app at `http://localhost:3000`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for red error messages
5. Copy any errors you see

**Common errors:**
- `Uncaught TypeError` → Code issue
- `CORS error` → Server communication issue
- `Failed to fetch` → Network issue

---

## Phase 7: Configuration Check

### Check 7.1: App settings

1. Open `http://localhost:3000`
2. Click ⚙️ **Settings**
3. Check **API** tab
4. Verify:
   - API URL: `http://localhost:8000` ✓
   - API Key: (should be filled) ✓
   - Model: `mistral` ✓

If API Key is empty → That's the issue! Get one from OpenWebUI.

---

## Complete Diagnostic Flowchart

```
START
  ↓
[Check ports with netstat] 
  ├─ 3000 not listening? → Start web app with: python -m http.server 3000
  ├─ 8000 not listening? → Start OpenWebUI with: docker run -d -p 8000:8000 ghcr.io/open-webui/open-webui:latest
  └─ 8001 not listening? → Start proxy with: python proxy.py
  ↓
[All ports listening?] YES → Continue
  ↓
[Can you access http://localhost:3000?] YES → Continue
  ├─ NO → Web server crashed, restart it
  ↓
[Can you access http://localhost:8000?] YES → Continue
  ├─ NO → OpenWebUI issue, check docker logs
  ↓
[Does proxy respond to: curl http://localhost:8001/api/proxy?] YES → Continue
  ├─ NO → Proxy crashed, restart it
  ↓
[Is API Key filled in settings?] YES → Continue
  ├─ NO → Get key from OpenWebUI, save in settings
  ↓
[Click Test Connection - what happens?] 
  ├─ All green ✓ → SUCCESS! Ready to generate
  ├─ Proxy error → Check Step 4
  ├─ OpenWebUI error → Check Step 3
  └─ API error → Get new API key, check Step 7
```

---

## Quick Reference: What Each Service Should Show

### Proxy (Port 8001)
```bash
$ curl -X OPTIONS http://localhost:8001/api/proxy
HTTP/1.1 200 OK
```

### OpenWebUI (Port 8000)
```bash
$ curl http://localhost:8000
(returns HTML login page)
```

### Web App (Port 3000)
```bash
$ curl http://localhost:3000
(returns HTML app page)
```

---

## Run This Diagnostic Now

### Do This Step-by-Step:

**Step 1: Check what's running**
```bash
tasklist | findstr python
tasklist | findstr docker
```

Copy the output here for analysis.

**Step 2: Check ports**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :8001
```

Copy the output here.

**Step 3: Test proxy directly**
```bash
curl -v -X OPTIONS http://localhost:8001/api/proxy
```

Copy the result.

**Step 4: Check browser console**
- F12 → Console
- Screenshot any red errors

---

## Analysis Summary Template

Fill this in as you run checks:

```
✓/✗ Web app running on port 3000? 
✓/✗ OpenWebUI running on port 8000?
✓/✗ Proxy running on port 8001?
✓/✗ Can curl reach proxy?
✓/✗ API Key filled in settings?
✓/✗ Any console errors?

First issue found:
Likely cause:
Recommended fix:
```

---

## Next Steps

**Run Phase 1 and Phase 2 checks above, then:**

1. Tell me which services are actually running
2. Show me any error messages
3. Share what `curl` shows for each port
4. I'll identify the exact issue and fix it

**Let's solve this systematically!** 🔧
