#!/bin/zsh
# Double-click to serve this checkout; Ctrl+C stops the local preview.
cd -- "${0:A:h}" || exit 1
python3 -u - <<'PY'
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

root = Path.cwd()
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
try:
    server = ThreadingHTTPServer(('127.0.0.1', 8895), handler)
except OSError:
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
print(f'\nMLNLP 2025 本地预览：http://127.0.0.1:{server.server_port}/mlnlp2025/\n按 Ctrl+C 停止预览。\n', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\n预览已停止。')
finally:
    server.server_close()
PY
