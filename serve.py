#!/usr/bin/env python3
import http.server
import sys
import urllib.parse
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
LOCAL_AWARENESS_PREFIX = "/__pjdhiro/assets/awareness"
LOCAL_AWARENESS_ROOT = (ROOT_DIR.parent / "pjdhiro" / "assets" / "awareness").resolve()


class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        request_path = urllib.parse.urlparse(path).path
        if request_path == LOCAL_AWARENESS_PREFIX or request_path.startswith(f"{LOCAL_AWARENESS_PREFIX}/"):
            relative = request_path.removeprefix(LOCAL_AWARENESS_PREFIX).lstrip("/")
            candidate = (LOCAL_AWARENESS_ROOT / relative).resolve()
            try:
                candidate.relative_to(LOCAL_AWARENESS_ROOT)
            except ValueError:
                return str(LOCAL_AWARENESS_ROOT)
            return str(candidate)
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3003
    print(f"Starting no-cache server on port {port}...")
    http.server.test(HandlerClass=NoCacheHTTPRequestHandler, port=port)
