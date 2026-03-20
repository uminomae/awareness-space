#!/usr/bin/env bash
# build-pdf-guide.sh — awareness-space PDF 生成 v0.1
#
# 概要:
#   creation-space の build-pdf-guide.sh を模倣し、
#   awareness guides / survey の Markdown → PDF → manifest 更新を行う。
#
# 使い方:
#   bash transform/scripts/build-pdf-guide.sh
#   bash transform/scripts/build-pdf-guide.sh --kind guides --audience all
#   bash transform/scripts/build-pdf-guide.sh --kind guides --lang all
#   bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang ja --push
#   bash transform/scripts/build-pdf-guide.sh --kind survey --lang ja
#   bash transform/scripts/build-pdf-guide.sh --setup

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AWARENESS_SPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PJDHIRO_DIR="/Users/uminomae/dev/pjdhiro"
GUIDES_BASE="$PJDHIRO_DIR/assets/awareness/guides"
SURVEY_BASE="$PJDHIRO_DIR/assets/awareness/survey"
MANIFESTS_DIR="$PJDHIRO_DIR/assets/awareness/manifests"
PUBLISH_DOMAINS_SCRIPT="$AWARENESS_SPACE_ROOT/transform/scripts/publish-awareness-domains.sh"

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

check_deps() {
    echo "依存チェック..."
    local missing=0
    for cmd in pandoc lualatex python3; do
        if command -v "$cmd" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $cmd"
        else
            echo -e "  ${RED}✗${NC} $cmd が見つかりません"
            missing=1
        fi
    done
    if [ "$missing" -eq 1 ]; then
        echo ""
        echo -e "${YELLOW}インストール:${NC}"
        echo "  brew install pandoc"
        echo "  brew install --cask mactex-no-gui"
        echo "  sudo tlmgr install collection-luatex luatexja haranoaji"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} 依存OK"
}

get_guide_title() {
    local audience="$1"
    local lang="${2:-ja}"
    if [ "$lang" = "en" ]; then
        case "$audience" in
            general)  echo "What Is Awareness? — Survival and Intersubjectivity" ;;
            designer) echo "Using the Awareness Model as an Observation Tool" ;;
            academic) echo "Awareness Model in Dialogue with Neurophenomenology and Psychology" ;;
        esac
    else
        case "$audience" in
            general)  echo "意識とは何か — 生存と間主観性を手がかりに" ;;
            designer) echo "意識モデルを観察の道具として使う" ;;
            academic) echo "意識モデルと神経現象学・心理学の接続" ;;
        esac
    fi
}

get_guide_subtitle() {
    local audience="$1"
    local lang="${2:-ja}"
    if [ "$lang" = "en" ]; then
        case "$audience" in
            general)  echo "A Guide to Awareness as a Model" ;;
            designer) echo "For Educators, Supporters, and Team Designers" ;;
            academic) echo "An Exploratory Guide for Cross-Disciplinary Readers" ;;
        esac
    else
        case "$audience" in
            general)  echo "一般向けの解説" ;;
            designer) echo "教育・支援・チーム設計のための解説" ;;
            academic) echo "学際的な検討のための解説" ;;
        esac
    fi
}

make_header_ja() {
    local title="$1" subtitle="$2"
    local date_str
    date_str=$(TZ=Asia/Tokyo date "+%Y年%m月%d日")

    cat << YAML
---
title: "${title}"
subtitle: "${subtitle}"
author: ""
date: "${date_str}"
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

make_header_en() {
    local title="$1" subtitle="$2"
    local date_str
    date_str=$(TZ=Asia/Tokyo date "+%Y-%m-%d")

    cat << YAML
---
title: "${title}"
subtitle: "${subtitle}"
author: ""
date: "${date_str}"
documentclass: article
classoption: [a4paper, 11pt]
header-includes:
  - \\usepackage{fontspec}
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

build_guide() {
    local audience="$1"
    local lang="${2:-ja}"

    local md_dir="$GUIDES_BASE/${lang}/md"
    local pdf_dir="$GUIDES_BASE/${lang}/pdf"
    local md_file="$md_dir/awareness-${audience}.md"
    local pdf_file="$pdf_dir/awareness-${audience}.pdf"
    local tmp="$AWARENESS_SPACE_ROOT/.build-tmp/_guide_${audience}_${lang}.md"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 awareness-${audience} [${lang_label}] ビルド中...${NC}"

    if [ ! -f "$md_file" ]; then
        echo -e "  ${RED}✗${NC} ソースが見つかりません: ${md_file}"
        return 1
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$(dirname "$tmp")"

    local title subtitle
    title="$(get_guide_title "$audience" "$lang")"
    subtitle="$(get_guide_subtitle "$audience" "$lang")"

    if [ "$lang" = "en" ]; then
        make_header_en "$title" "$subtitle" > "$tmp"
    else
        make_header_ja "$title" "$subtitle" > "$tmp"
    fi

    cat "$md_file" | strip_frontmatter >> "$tmp"

    echo "  pandoc 変換中..."
    if pandoc "$tmp" \
        -o "$pdf_file" \
        --pdf-engine=lualatex \
        --resource-path="$md_dir" \
        --wrap=none \
        2>&1 | sed 's/^/    /'; then
        local size
        size=$(du -k "$pdf_file" 2>/dev/null | cut -f1)
        echo -e "  ${GREEN}✅${NC} awareness-${audience}.pdf (${size:-?} KB)"
    else
        echo -e "  ${RED}✗${NC} ビルド失敗: awareness-${audience}.pdf"
        rm -f "$tmp"
        return 1
    fi

    rm -f "$tmp"
}

get_markdown_title() {
    local file="$1"
    local fallback
    fallback="$(basename "$file" .md)"
    python3 - "$file" "$fallback" << 'PYEOF'
import sys, re
text = open(sys.argv[1]).read()
m = re.search(r'^title:\s*["\x27](.*?)["\x27]', text, re.MULTILINE)
if m:
    print(m.group(1))
else:
    h = re.search(r'^#\s+(.+)', text, re.MULTILINE)
    if h:
        print(h.group(1).strip())
    else:
        print(sys.argv[2])
PYEOF
}

build_survey() {
    local lang="${1:-ja}"
    local md_dir="$SURVEY_BASE/${lang}/md"
    local pdf_dir="$SURVEY_BASE/${lang}/pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 survey [${lang_label}] ビルド中...${NC}"

    if [ ! -d "$md_dir" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$AWARENESS_SPACE_ROOT/.build-tmp"

    local success=0 fail=0
    for md_file in "$md_dir"/survey-*.md; do
        [ -e "$md_file" ] || continue
        local base
        base="$(basename "$md_file" .md)"
        local out="$pdf_dir/${base}.pdf"
        local tmp="$AWARENESS_SPACE_ROOT/.build-tmp/_survey_${base}_${lang}.md"
        local title
        title="$(get_markdown_title "$md_file")"

        echo -e "  ${BLUE}→${NC} ${base} [${lang_label}]"

        if [ "$lang" = "en" ]; then
            make_header_en "$title" "" > "$tmp"
        else
            make_header_ja "$title" "" > "$tmp"
        fi

        cat "$md_file" | strip_frontmatter >> "$tmp"

        if pandoc "$tmp" \
            -o "$out" \
            --pdf-engine=lualatex \
            --wrap=none \
            2>&1 | sed 's/^/      /'; then
            local size
            size=$(du -k "$out" 2>/dev/null | cut -f1)
            echo -e "    ${GREEN}✅${NC} ${base}.pdf (${size:-?} KB)"
            success=$((success + 1))
        else
            echo -e "    ${RED}✗${NC} ビルド失敗: ${base}.pdf"
            fail=$((fail + 1))
        fi

        rm -f "$tmp"
    done

    echo -e "  survey [${lang_label}]: ${success}成功 / ${fail}失敗"
    [ "$fail" -gt 0 ] && return 1
    return 0
}

update_manifests() {
    echo -e "${BLUE}📋 manifests 更新${NC}"
    mkdir -p "$MANIFESTS_DIR"

    local date_str
    date_str=$(date +%Y-%m-%d)

    python3 -c "
import json, os, sys

awareness_dir = sys.argv[1]
date_str = sys.argv[2]
audiences = [
    ('general', '一般向け', 'General'),
    ('designer', '設計者向け', 'Designer'),
    ('academic', '専門家向け', 'Academic'),
]
guides = []
for aid, title_ja, title_en in audiences:
    entry = {'id': aid, 'title_ja': title_ja, 'title_en': title_en, 'md': {}, 'pdf': {}}
    for lang in ('ja', 'en'):
        md_rel = f'guides/{lang}/md/awareness-{aid}.md'
        pdf_rel = f'guides/{lang}/pdf/awareness-{aid}.pdf'
        entry['md'][lang] = md_rel if os.path.isfile(os.path.join(awareness_dir, md_rel)) else None
        entry['pdf'][lang] = pdf_rel if os.path.isfile(os.path.join(awareness_dir, pdf_rel)) else None
    guides.append(entry)

manifest = {
    'version': '0.1',
    'generated_at': date_str,
    'namespace': 'awareness',
    'guides': guides,
}
print(json.dumps(manifest, indent=2, ensure_ascii=False))
" "$PJDHIRO_DIR/assets/awareness" "$date_str" > "$MANIFESTS_DIR/guides.json"

    echo -e "  ${GREEN}✓${NC} guides.json 更新完了"
}

publish_domains() {
    echo -e "${BLUE}🧩 domains 公開物更新${NC}"
    bash "$PUBLISH_DOMAINS_SCRIPT"
    echo -e "  ${GREEN}✓${NC} domains.json / domains markdown 更新完了"
}

push_pjdhiro_main() {
    echo -e "${BLUE}🚀 pjdhiro/main へ公開${NC}"

    local branch
    branch="$(git -C "$PJDHIRO_DIR" branch --show-current)"
    if [ "$branch" != "main" ]; then
        echo -e "  ${RED}✗${NC} pjdhiro が main ではありません: ${branch}"
        return 1
    fi

    local status_output
    status_output="$(git -C "$PJDHIRO_DIR" status --short -- assets/awareness)"
    if [ -z "$status_output" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: assets/awareness に変更がありません"
        return 0
    fi

    git -C "$PJDHIRO_DIR" add assets/awareness

    if git -C "$PJDHIRO_DIR" diff --cached --quiet; then
        echo -e "  ${YELLOW}スキップ${NC}: commit 対象がありません"
        return 0
    fi

    local date_str
    date_str="$(TZ=Asia/Tokyo date +%Y-%m-%d)"
    git -C "$PJDHIRO_DIR" commit -m "publish awareness assets ${date_str}"
    git -C "$PJDHIRO_DIR" push origin main
    echo -e "  ${GREEN}✓${NC} pjdhiro/main push 完了"
}

main() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  awareness-space — PDF生成 v0.1${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo ""

    local kind="guides"
    local audience="general"
    local lang="ja"
    local do_push=false

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --setup|-s)    check_deps; exit 0 ;;
            --kind|-k)     kind="${2:-guides}"; shift 2 ;;
            --audience|-a) audience="${2:-general}"; shift 2 ;;
            --lang|-l)     lang="${2:-ja}"; shift 2 ;;
            --push|-p)     do_push=true; shift ;;
            --help|-h)
                echo "使い方: bash transform/scripts/build-pdf-guide.sh [オプション]"
                echo ""
                echo "オプション:"
                echo "  --kind {guides|survey|all}                       種別（デフォルト: guides）"
                echo "  --audience {general|designer|academic|all}       対象（guides時のみ。デフォルト: general）"
                echo "  --lang {ja|en|all}                               言語（デフォルト: ja）"
                echo "  --push                                           ビルド後に公開 assets を commit/push"
                echo "  --setup                                          依存チェックのみ"
                exit 0
                ;;
            *) echo -e "${RED}不明なオプション: $1${NC}"; exit 1 ;;
        esac
    done

    check_deps
    echo ""

    local langs=()
    case "$lang" in
        all) langs=(ja en) ;;
        ja|en) langs=("$lang") ;;
        *) echo -e "${RED}不明なlang: $lang${NC}"; exit 1 ;;
    esac

    local kinds=()
    case "$kind" in
        all) kinds=(guides survey) ;;
        guides|survey) kinds=("$kind") ;;
        *) echo -e "${RED}不明なkind: $kind${NC}"; exit 1 ;;
    esac

    local success=0 fail=0

    for _k in "${kinds[@]}"; do
        case "$_k" in
            guides)
                local audiences=()
                case "$audience" in
                    all) audiences=(general designer academic) ;;
                    general|designer|academic) audiences=("$audience") ;;
                    *) echo -e "${RED}不明なaudience: $audience${NC}"; exit 1 ;;
                esac

                for a in "${audiences[@]}"; do
                    for l in "${langs[@]}"; do
                        if build_guide "$a" "$l"; then
                            success=$((success + 1))
                        else
                            fail=$((fail + 1))
                        fi
                        echo ""
                    done
                done
                ;;
            survey)
                for l in "${langs[@]}"; do
                    if build_survey "$l"; then
                        success=$((success + 1))
                    else
                        fail=$((fail + 1))
                    fi
                    echo ""
                done
                ;;
        esac
    done

    if $do_push; then
        update_manifests
        publish_domains
        push_pjdhiro_main
        echo ""
    fi

    rm -rf "$AWARENESS_SPACE_ROOT/.build-tmp"

    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "完了: ${GREEN}${success}成功${NC} / ${fail}失敗"
    echo -e "${BLUE}══════════════════════════════════════${NC}"

    if [ "$fail" -gt 0 ]; then
        exit 1
    fi
    exit 0
}

main "$@"
