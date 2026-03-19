#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-uminomae/awareness-space}"
OUTBOX="${OUTBOX:-.cache/outbox}"

collect_issues_from_done() {
  local f base issue
  for f in "$OUTBOX"/DONE-*.md; do
    [ -e "$f" ] || continue
    base="$(basename "$f")"
    case "$base" in
      DONE-session-*.md|DONE-pm-*.md)
        continue
        ;;
    esac
    issue="$(printf '%s\n' "$base" | sed -n 's/^DONE-\([0-9][0-9]*\)-.*$/\1/p')"
    [ -n "$issue" ] && printf '%s\n' "$issue"
  done | sort -n | uniq
}

if [ "$#" -gt 0 ]; then
  ISSUES=("$@")
else
  ISSUES=()
  while IFS= read -r issue; do
    [ -n "$issue" ] || continue
    ISSUES+=("$issue")
  done < <(collect_issues_from_done)
fi

if [ "${#ISSUES[@]}" -eq 0 ]; then
  echo "No issue-specific DONE files found in $OUTBOX"
  exit 0
fi

echo "Checking ${#ISSUES[@]} issue(s) in ${REPO} against ${OUTBOX}"

failures=0

for issue in "${ISSUES[@]}"; do
  meta="$(
    gh issue view "$issue" --repo "$REPO" \
      --json state,title,url,closedAt,comments \
      --jq '[.state, .title, .url, (.closedAt // ""), (.comments | length)] | @tsv' \
      2>/dev/null || true
  )"

  if [ -z "$meta" ]; then
    echo "WARN  #$issue  GitHub issue metadata could not be read"
    failures=1
    continue
  fi

  IFS=$'\t' read -r state title url closed_at comment_count <<<"$meta"

  if [ "$state" = "CLOSED" ]; then
    echo "OK    #$issue  CLOSED  comments=${comment_count}  ${title}"
    continue
  fi

  echo "WARN  #$issue  OPEN    comments=${comment_count}  ${title}"
  echo "      DONE exists but issue is still open: ${url}"
  echo "      If OPEN is intentional, record the reason in the issue comment."
  failures=1
done

exit "$failures"
