#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
import sys

FORBIDDEN = [
    "foreignObject",
    "<script",
    "<animate",
    "<image",
    "<filter",
    "<style",
]


def validate(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    errors: list[str] = []
    stripped = text.strip()
    if not stripped.startswith("<svg"):
        errors.append("does not start with <svg>")
    if "</svg>" not in stripped:
        errors.append("missing </svg>")
    if 'xmlns="http://www.w3.org/2000/svg"' not in stripped:
        errors.append("missing xmlns")
    if "viewBox" not in stripped:
        errors.append("missing viewBox")
    for token in FORBIDDEN:
        if token in stripped:
            errors.append(f"forbidden element/token found: {token}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("svg", nargs="+")
    args = parser.parse_args()

    failed = False
    for raw in args.svg:
        path = Path(raw)
        errors = validate(path)
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
