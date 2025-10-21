@echo off
REM Start all services for ASCII Art Generator

echo.
echo 🚀 ASCII Art Generator - Starting Services
echo =========================================
echo.

REM Check if we're in the right directory
if not exist "proxy.py" (
    echo ❌ proxy.py not found. Please run from project directory.
    pause
    exit /b 1
)

echo 📦 Starting OpenWebUI...
docker run -d -p 8000:8000 --name open-webui ghcr.io/open-webui/open-webui:latest
if %errorlevel% equ 0 (
    echo ✅ OpenWebUI starting on port 8000
) else (
    echo ⚠️  OpenWebUI may already be running
)

echo.
echo ⏳ Waiting 5 seconds for OpenWebUI to initialize...
timeout /t 5 /nobreak

echo.
echo 🔌 Starting Proxy Server...
start "Proxy Server" cmd /k python proxy.py
echo ✅ Proxy server starting on port 8001

echo.
echo 🌐 Note: Web server should already be running on port 8000
echo.

echo =========================================
echo 🎉 Services started!
echo =========================================
echo.
echo 📍 Access the app at: http://localhost:8000
echo.
echo 💡 You can now:
echo    1. Click ⚙️ Settings
echo    2. Click 🔍 Auto-Detect
echo    3. See all services connected!
echo.
echo ⏸️  Close the "Proxy Server" window to stop proxy
echo.
pause
