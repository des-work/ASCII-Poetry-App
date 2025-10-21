#!/bin/bash
# Start all services for ASCII Art Generator

echo "🚀 ASCII Art Generator - Starting Services"
echo "========================================="
echo ""

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "📦 Starting OpenWebUI..."
docker run -d -p 8000:8000 --name open-webui ghcr.io/open-webui/open-webui:latest
if [ $? -eq 0 ]; then
    echo "✅ OpenWebUI starting on port 8000"
else
    echo "⚠️  OpenWebUI may already be running"
fi

echo ""
echo "⏳ Waiting 5 seconds for OpenWebUI to initialize..."
sleep 5

echo ""
echo "🔌 Starting Proxy Server..."
python proxy.py &
PROXY_PID=$!
echo "✅ Proxy server starting on port 8001 (PID: $PROXY_PID)"

echo ""
echo "🌐 Starting Web Server..."
python -m http.server 8000 &
WEB_PID=$!
echo "✅ Web server starting on port 8000 (PID: $WEB_PID)"

echo ""
echo "========================================="
echo "🎉 All services started!"
echo "========================================="
echo ""
echo "📍 Access the app at: http://localhost:8000"
echo ""
echo "⏸️  To stop all services, press Ctrl+C"
echo ""

# Wait for user interrupt
wait
