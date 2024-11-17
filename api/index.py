from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "status": "ok",
            "message": "Carbon Footprint Analyzer API",
            "timestamp": str(datetime.now())
        }
        
        self.wfile.write(json.dumps(response).encode())
        return

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "total_co2": 1.5,
            "metrics": {
                "pageSize": 2.1,
                "jsCount": 5,
                "cssCount": 3,
                "imageCount": 10,
                "serverLocation": "Test",
                "caching": "Enabled",
                "cdnUsage": True
            }
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
