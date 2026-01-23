#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver

class UTF8Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Forzar UTF-8 en todos los archivos HTML
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()

PORT = 8000

with socketserver.TCPServer(("", PORT), UTF8Handler) as httpd:
    print(f"🚀 Servidor corriendo en http://localhost:{PORT}")
    print(f"📝 Con codificación UTF-8 habilitada")
    httpd.serve_forever()
