#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path("/Users/uminomae/dev/awareness-space")
PJDHIRO = Path("/Users/uminomae/dev/pjdhiro/assets/awareness")
PROMPT_DIR = ROOT / "transform" / "topics" / "svg-prompts"
OUTPUT_DIR = PJDHIRO / "img" / "svg" / "topics"
MODEL = "gemini-2.5-pro"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
API_KEY = os.environ.get("GEMINI_API_KEY", "")
RATE_LIMIT_SEC = 6
MAX_RETRIES = 3

FORBIDDEN = [
    "<foreignObject",
    "<script",
    "<animate",
    "<animateTransform",
    "<animateMotion",
    "<image",
    "<filter",
    "<style",
]

SUPPORTED = {
    "survival-trust-axis": {
        "title": {"ja": "生存-信頼軸", "en": "Survival-Trust Axis"},
        "prompt": PROMPT_DIR / "survival-trust-axis-overview.md",
    },
    "four-layers": {
        "title": {"ja": "4層モデル", "en": "Four-Layer Model"},
        "prompt": PROMPT_DIR / "four-layers-overview.md",
    },
}


def report_path(slug: str, lang: str) -> Path:
    return ROOT / "knowledge" / "topics" / slug / lang / "report.md"


def output_path(slug: str, lang: str) -> Path:
    return OUTPUT_DIR / lang / f"{slug}-01-overview-svg.svg"


def build_prompt(slug: str, lang: str) -> str:
    prompt_path = SUPPORTED[slug]["prompt"]
    template = prompt_path.read_text(encoding="utf-8")
    report = report_path(slug, lang).read_text(encoding="utf-8")
    return (
        template.replace("{{lang}}", lang)
        .replace("{{title}}", SUPPORTED[slug]["title"][lang])
        .replace("{{report_markdown}}", report)
    )


def extract_svg(text: str) -> str | None:
    stripped = text.strip()
    stripped = re.sub(r"^```(?:xml|svg|html)?\s*\n?", "", stripped)
    stripped = re.sub(r"\n?```\s*$", "", stripped)
    match = re.search(r"(<svg[\s\S]*</svg>)", stripped, re.DOTALL)
    if match:
        return match.group(1)
    if stripped.startswith("<svg") and "</svg>" in stripped:
        return stripped
    return None


def validate_svg(svg_text: str) -> list[str]:
    errors: list[str] = []
    stripped = svg_text.strip()
    if not stripped.startswith("<svg"):
        errors.append("does not start with <svg>")
    if "</svg>" not in stripped:
        errors.append("missing </svg>")
    if 'xmlns="http://www.w3.org/2000/svg"' not in stripped:
        errors.append("missing xmlns")
    if 'viewBox="0 0 1200 800"' not in stripped and "viewBox=" not in stripped:
        errors.append("missing viewBox")
    for token in FORBIDDEN:
        if token in stripped:
            errors.append(f"forbidden element/token found: {token}")
    return errors


def call_gemini(prompt: str) -> str | None:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 65536,
        },
    }

    result = subprocess.run(
        [
            "curl",
            "-s",
            "-X",
            "POST",
            f"{API_URL}?key={API_KEY}",
            "-H",
            "Content-Type: application/json",
            "-d",
            json.dumps(payload, ensure_ascii=False),
        ],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode != 0:
        print(f"curl failed: {result.stderr[:200]}", file=sys.stderr)
        return None

    try:
        response = json.loads(result.stdout)
    except json.JSONDecodeError:
        print("invalid JSON response", file=sys.stderr)
        return None

    if "error" in response:
        print(response["error"].get("message", "unknown Gemini API error"), file=sys.stderr)
        return None

    try:
        text = response["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        print("unexpected Gemini response structure", file=sys.stderr)
        return None

    return extract_svg(text)


def generate(slug: str, lang: str) -> Path:
    if not API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")

    prompt = build_prompt(slug, lang)
    out = output_path(slug, lang)
    out.parent.mkdir(parents=True, exist_ok=True)

    last_errors: list[str] = []
    for attempt in range(1, MAX_RETRIES + 1):
        svg = call_gemini(prompt)
        if svg is None:
            last_errors = ["no SVG extracted from Gemini response"]
        else:
            last_errors = validate_svg(svg)
            if not last_errors:
                out.write_text(svg, encoding="utf-8")
                return out
        if attempt < MAX_RETRIES:
            time.sleep(RATE_LIMIT_SEC)

    raise RuntimeError(f"failed to generate valid SVG for {slug}/{lang}: {last_errors}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", required=True, choices=sorted(SUPPORTED.keys()))
    parser.add_argument("--lang", default="all", choices=["ja", "en", "all"])
    args = parser.parse_args()

    langs = ["ja", "en"] if args.lang == "all" else [args.lang]
    for lang in langs:
        path = generate(args.slug, lang)
        print(f"generated: {path}")
        if len(langs) > 1 and lang != langs[-1]:
            time.sleep(RATE_LIMIT_SEC)
    return 0


if __name__ == "__main__":
    sys.exit(main())
