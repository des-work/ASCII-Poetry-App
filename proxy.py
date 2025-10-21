#!/usr/bin/env python3
"""
Simple CORS proxy for OpenWebUI API calls
Run with: python proxy.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse
import os
from datetime import datetime

class CORSProxyHandler(BaseHTTPRequestHandler):
    """Handle API proxy requests with CORS support"""
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            print(f"[{datetime.now().strftime('%H:%M:%S')}] POST {self.path}")
            
            # Only allow /api/proxy endpoint
            if self.path != '/api/proxy':
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())
                return
            
            # Parse request body
            try:
                request_data = json.loads(body)
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode())
                return
            
            # Validate required fields
            target_url = request_data.get('url')
            api_key = request_data.get('apiKey')
            
            if not target_url:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing 'url' in request"}).encode())
                return
            
            if not api_key:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing 'apiKey' in request"}).encode())
                return
            
            # Prepare the actual API request
            api_request_data = request_data.get('data', {})
            api_request_body = json.dumps(api_request_data).encode('utf-8')
            
            # Create request to target API
            req = urllib.request.Request(
                target_url,
                data=api_request_body,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {api_key}'
                },
                method='POST'
            )
            
            # Forward to OpenWebUI
            try:
                print(f"  → Forwarding to: {target_url}")
                with urllib.request.urlopen(req, timeout=30) as response:
                    response_body = response.read().decode('utf-8')
                    
                    # Send success response
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response_body.encode())
                    print(f"  ✅ Success")
                    
            except urllib.error.HTTPError as e:
                error_body = e.read().decode('utf-8')
                print(f"  ❌ HTTP {e.code}: {error_body[:100]}")
                
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_json = {
                    "error": f"API returned {e.code}",
                    "status": e.code,
                    "details": error_body
                }
                self.wfile.write(json.dumps(response_json).encode())
                
            except urllib.error.URLError as e:
                print(f"  ❌ Connection error: {e.reason}")
                self.send_response(503)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response_json = {
                    "error": "Cannot reach API server",
                    "details": str(e.reason)
                }
                self.wfile.write(json.dumps(response_json).encode())
                
        except Exception as e:
            print(f"  ❌ Unexpected error: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_json = {"error": "Internal server error", "details": str(e)}
            self.wfile.write(json.dumps(response_json).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def run_proxy(port=8001):
    """Run the proxy server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSProxyHandler)
    print(f"🚀 CORS Proxy running on http://localhost:{port}")
    print(f"📍 API endpoint: POST /api/proxy")
    print(f"📝 Ready to forward requests to OpenWebUI\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Proxy server stopped")
        httpd.server_close()

if __name__ == '__main__':
    run_proxy(8001)
