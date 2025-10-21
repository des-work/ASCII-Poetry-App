#!/bin/bash
# Start all services for ASCII Art Generator
# OpenWebUI: 8000
# Web App: 3000
# Proxy: 8001

echo ""
echo "🚀 ASCII Art Generator - Complete Setup"
echo "========================================="
echo ""

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "📦 Starting OpenWebUI on port 8000..."
docker run -d -p 8000:8000 --name open-webui ghcr.io/open-webui/open-webui:latest
if [ $? -eq 0 ]; then
    echo "✅ OpenWebUI starting on port 8000"
else
    echo "⚠️  OpenWebUI may already be running"
    echo "   To check: docker ps"
    echo "   To stop: docker stop open-webui"
fi

echo ""
echo "⏳ Waiting 5 seconds for OpenWebUI to initialize..."
sleep 5

echo ""
echo "🔌 Starting Proxy Server on port 8001..."
python proxy.py &
PROXY_PID=$!
echo "✅ Proxy server starting on port 8001 (PID: $PROXY_PID)"

echo ""
echo "🌐 Starting Web App on port 3000..."
python -m http.server 3000 &
WEB_PID=$!
echo "✅ Web app starting on port 3000 (PID: $WEB_PID)"

echo ""
echo "========================================="
echo "🎉 All services started!"
echo "========================================="
echo ""
echo "📍 Access the app at: http://localhost:3000"
echo "📍 OpenWebUI at: http://localhost:8000"
echo "📍 Proxy at: http://localhost:8001"
echo ""
echo "💡 Setup Steps:"
echo "   1. Go to http://localhost:3000"
echo "   2. Click ⚙️ Settings → API tab"
echo "   3. Go to http://localhost:8000 in another tab"
echo "   4. Sign in and create API key (Settings → API Keys)"
echo "   5. Copy key and paste in settings"
echo "   6. Click 🧪 Test Connection"
echo "   7. Use 🤖 AI Art mode!"
echo ""
echo "⏸️  Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait
