#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

if [ "$(hook_event_name)" != "PostToolUse" ]; then
  exit 0
fi

target_file=""
while IFS= read -r raw_path; do
  [ -n "$raw_path" ] || continue
  normalized="$(hook_normalize_path "$raw_path")"
  rel_path="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
  case "$rel_path" in
    .cache/inbox/_instructions-*.md|docs/templates/cli-instruction.md)
      if [ -f "$normalized" ]; then
        target_file="$normalized"
        break
      fi
      ;;
  esac
done < <(hook_collect_paths)

if [ -z "$target_file" ]; then
  exit 0
fi

lint_output="$(
  python3 - "$target_file" <<'PY'
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
errors = []

required_strings = [
    "## Step 最終: 完了処理",
    "DONE-",
    "gh issue close",
    "### Issue close 条件",
]

for item in required_strings:
    if item not in text:
        errors.append(f"必須要素がありません: {item}")

if "gh issue view" not in text or "--json state" not in text:
    errors.append("Issue の終了状況確認 (`gh issue view ... --json state`) がありません。")

if "close しない場合" not in text and "close しない" not in text:
    errors.append("close しない場合の扱いが明記されていません。")

for message in errors:
    print(message)
PY
)"

if [ -n "$lint_output" ]; then
  hook_block "$lint_output"
fi
