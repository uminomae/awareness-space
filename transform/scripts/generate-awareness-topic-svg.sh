#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"

python3 "$ROOT/transform/scripts/generate-awareness-topic-svg.py" "$@"
