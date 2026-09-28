"""Serve the interactive scroll from a local HTTP origin."""

from argparse import ArgumentParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser


ROOT = Path(__file__).resolve().parent.parent


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)


def main():
    parser = ArgumentParser(description="在浏览器中预览清明上河交互长卷")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), PreviewHandler)
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), PreviewHandler)

    url = f"http://127.0.0.1:{server.server_port}/index.html"
    print(f"清明上河预览地址：{url}", flush=True)
    print("关闭此终端窗口或按 Ctrl+C 即可停止预览。", flush=True)
    if not args.no_browser:
        Timer(0.2, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
