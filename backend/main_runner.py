import os
import sys
import argparse

if getattr(sys, "frozen", False):
    base_dir = sys._MEIPASS
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)

import uvicorn

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    args, _ = parser.parse_known_args()

    PORT = args.port

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=PORT,
        log_level="info",
    )