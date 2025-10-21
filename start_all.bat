@echo off
REM Start all services for ASCII Art Generator
REM OpenWebUI: 8000
REM Web App: 3000  
REM Proxy: 8001

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
    echo ⚠️  OpenWebUI may already be running or port conflict
    echo   To check: docker ps
    echo   To stop: docker stop open-webui
)

echo.
echo ⏳ Waiting 5 seconds for OpenWebUI to initialize...
timeout /t 5 /nobreak

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
