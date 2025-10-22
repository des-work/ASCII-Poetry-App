@echo off
REM Start all services for ASCII Art Generator
REM OpenWebUI: 8000
REM Web App: 3000  
REM Proxy: 8001

echo.
echo 🧹 CLEANUP: Killing old processes...
echo =========================================
echo.

REM Kill all old Python processes
taskkill /F /IM python.exe 2>nul
echo ✅ Old Python processes stopped

REM Stop Docker container if running
docker stop open-webui 2>nul
docker rm open-webui 2>nul
echo ✅ Old Docker containers cleaned up

REM Wait for ports to be released
echo.
echo ⏳ Waiting 3 seconds for ports to be released...
timeout /t 3 /nobreak

echo.
echo 🚀 ASCII Art Generator - Complete Setup
echo =========================================
echo.

REM Check if we're in the right directory
if not exist "proxy.py" (
    echo ❌ proxy.py not found. Please run from project directory.
    pause
    exit /b 1
)

echo 📦 Starting OpenWebUI on port 8000...
docker run -d -p 8000:8000 --name open-webui ghcr.io/open-webui/open-webui:latest
if %errorlevel% equ 0 (
    echo ✅ OpenWebUI starting on port 8000
) else (
    echo ⚠️  OpenWebUI may have failed - check Docker
)

echo.
echo ⏳ Waiting 10 seconds for OpenWebUI to fully start...
timeout /t 10 /nobreak

echo.
echo 🔌 Starting Proxy Server on port 8001...
start "Proxy Server" cmd /k python proxy.py
echo ✅ Proxy server starting on port 8001

echo.
echo 🌐 Starting Web App Server on port 3000...
start "Web App Server" cmd /k python -m http.server 3000
echo ✅ Web app starting on port 3000

echo.
echo =========================================
echo 🎉 All services started!
echo =========================================
echo.
echo 📍 Access the app at: http://localhost:3000
echo 📍 OpenWebUI at: http://localhost:8000
echo 📍 Proxy at: http://localhost:8001
echo.
echo 💡 Setup Steps:
echo    1. Go to http://localhost:3000
echo    2. Click ⚙️ Settings → API tab
echo    3. Go to http://localhost:8000 in another tab
echo    4. Sign in and create API key (Settings → API Keys)
echo    5. Copy key and paste in settings
echo    6. Click 🧪 Test Connection
echo    7. Use 🤖 AI Art mode!
echo.
echo ⏸️  Close either terminal window to stop that service
echo.
pause
