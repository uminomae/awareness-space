#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
DOMAINS_MD_DIR="$PJDHIRO/domains/ja/md"
DOMAINS_PDF_DIR="$PJDHIRO/domains/ja/pdf"
MANIFEST_DIR="$PJDHIRO/manifests"
RAW_BASE="https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/awareness"
PAGES_BASE="https://uminomae.github.io/pjdhiro/assets/awareness"
DATE_STR="$(TZ=Asia/Tokyo date +%Y-%m-%d)"
DATE_JA="$(TZ=Asia/Tokyo date '+%Y年%m月%d日')"

mkdir -p "$DOMAINS_MD_DIR" "$DOMAINS_PDF_DIR" "$MANIFEST_DIR"

rsync -a "$ROOT/knowledge/domains/survival-trust-axis/ja/report.md" "$DOMAINS_MD_DIR/survival-trust-axis.md"
rsync -a "$ROOT/knowledge/domains/four-layers/ja/report.md" "$DOMAINS_MD_DIR/four-layers.md"
rsync -a "$ROOT/knowledge/domains/m1-consciousness-os/ja/report.md" "$DOMAINS_MD_DIR/m1-consciousness-os.md"
rsync -a "$ROOT/knowledge/domains/concept-notes/ja/report.md" "$DOMAINS_MD_DIR/concept-notes.md"

strip_frontmatter() {
    python3 -c "
import sys
lines = sys.stdin.readlines()
if lines and lines[0].strip() == '---':
    for i, l in enumerate(lines[1:], 1):
        if l.strip() == '---':
            print(''.join(lines[i+1:]), end=''); sys.exit()
print(''.join(lines), end='')
"
}

extract_title() {
    local md_file="$1"
    python3 -c "
import re, sys
text = open(sys.argv[1]).read()
m = re.search(r'^title:\s*[\"\\x27](.*?)[\"\\x27]', text, re.MULTILINE)
if m:
    print(m.group(1))
else:
    h = re.search(r'^#\\s+(.+)', text, re.MULTILINE)
    print(h.group(1).strip() if h else 'Report')
" "$md_file"
}

make_header_ja() {
    local title="$1"
    cat <<YAML
---
title: "${title}"
author: ""
date: "${DATE_JA}"
documentclass: ltjsarticle
classoption: [a4paper, 11pt]
header-includes:
  - \\usepackage{luatexja-fontspec}
  - \\setmainjfont{Hiragino Mincho ProN}
  - \\setsansjfont{Hiragino Sans}
  - \\setmonofont{Menlo}
  - \\usepackage{graphicx}
  - \\usepackage{hyperref}
  - \\usepackage{xcolor}
  - \\usepackage{longtable}
  - \\usepackage{booktabs}
  - \\hypersetup{colorlinks=true,linkcolor=blue,urlcolor=blue}
geometry: [margin=25mm]
toc: true
toc-depth: 2
---

\\newpage

YAML
}

build_domain_pdf() {
    local slug="$1"
    local md_file="$DOMAINS_MD_DIR/${slug}.md"
    local pdf_file="$DOMAINS_PDF_DIR/${slug}.pdf"
    local tmp="$ROOT/.build-tmp/_domain_${slug}.md"
    local title
    title="$(extract_title "$md_file")"

    mkdir -p "$(dirname "$tmp")"
    make_header_ja "$title" > "$tmp"
    strip_frontmatter < "$md_file" >> "$tmp"
    pandoc "$tmp" -o "$pdf_file" --pdf-engine=lualatex --resource-path="$DOMAINS_MD_DIR" --wrap=none >/dev/null 2>&1
    rm -f "$tmp"
}

build_domain_pdf "survival-trust-axis"
build_domain_pdf "four-layers"
build_domain_pdf "m1-consciousness-os"
build_domain_pdf "concept-notes"

cat > "$MANIFEST_DIR/domains.json" <<EOF
{
  "version": "0.1",
  "generated_at": "${DATE_STR}",
  "namespace": "awareness",
  "progress_taxonomy": [
    {
      "id": "planned",
      "label_ja": "設計中",
      "label_en": "Planned",
      "description_ja": "domain 定義のみ。読者向け report は未配置",
      "description_en": "Domain defined, but no reader-facing report yet",
      "order": 10,
      "tone": "secondary"
    },
    {
      "id": "source_ready",
      "label_ja": "素材移設済",
      "label_en": "Source ready",
      "description_ja": "移設済み素材または overview を参照できる",
      "description_en": "Imported source material or overview is available",
      "order": 20,
      "tone": "warning"
    },
    {
      "id": "report_ready",
      "label_ja": "公開中",
      "label_en": "Published",
      "description_ja": "読者向け report と PDF を参照できる",
      "description_en": "A reader-facing report and PDF are available",
      "order": 30,
      "tone": "success"
    }
  ],
  "reports": [
    {
      "id": "A01",
      "name_ja": "生存-信頼軸",
      "name_en": "Survival-Trust Axis",
      "slug": "survival-trust-axis",
      "progress_level": "report_ready",
      "progress_note": "公開本文あり",
      "summary_ja": "経験の向きを生存と信頼の二軸から捉えるための報告。",
      "summary_en": "A report on the two-axis model of survival and intersubjectivity.",
      "md": {
        "ja": "${RAW_BASE}/domains/ja/md/survival-trust-axis.md"
      },
      "pdf": {
        "ja": "${PAGES_BASE}/domains/ja/pdf/survival-trust-axis.pdf"
      }
    },
    {
      "id": "A02",
      "name_ja": "4層モデル",
      "name_en": "Four Layers",
      "slug": "four-layers",
      "progress_level": "report_ready",
      "progress_note": "公開本文あり",
      "summary_ja": "意識を身体状態から見直しの余地までの流れとして捉える報告。",
      "summary_en": "A report on awareness as a processing chain from bodily state to response margin.",
      "md": {
        "ja": "${RAW_BASE}/domains/ja/md/four-layers.md"
      },
      "pdf": {
        "ja": "${PAGES_BASE}/domains/ja/pdf/four-layers.pdf"
      }
    },
    {
      "id": "A03",
      "name_ja": "M1 consciousness OS",
      "name_en": "M1 Consciousness OS",
      "slug": "m1-consciousness-os",
      "progress_level": "report_ready",
      "progress_note": "公開本文あり",
      "summary_ja": "現在の意識モデルを支える基盤文章群の位置づけを説明する報告。",
      "summary_en": "A report on the source text bundle behind the current four-layer model.",
      "md": {
        "ja": "${RAW_BASE}/domains/ja/md/m1-consciousness-os.md"
      },
      "pdf": {
        "ja": "${PAGES_BASE}/domains/ja/pdf/m1-consciousness-os.pdf"
      }
    },
    {
      "id": "A05",
      "name_ja": "Concept Notes",
      "name_en": "Concept Notes",
      "slug": "concept-notes",
      "progress_level": "report_ready",
      "progress_note": "公開本文あり",
      "summary_ja": "主軸の説明だけでは扱いきれない論点を保持する補助層の報告。",
      "summary_en": "A report explaining how the concept notes set supports the main reports.",
      "md": {
        "ja": "${RAW_BASE}/domains/ja/md/concept-notes.md"
      },
      "pdf": {
        "ja": "${PAGES_BASE}/domains/ja/pdf/concept-notes.pdf"
      }
    }
  ]
}
EOF
