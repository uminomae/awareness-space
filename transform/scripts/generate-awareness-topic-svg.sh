#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
OUT_BASE="$PJDHIRO/img/svg/topics"
VALIDATOR="$ROOT/transform/scripts/validate-awareness-svg.py"

SLUG="survival-trust-axis"
LANG="all"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --slug) SLUG="${2:-}"; shift 2 ;;
        --lang) LANG="${2:-all}"; shift 2 ;;
        *) echo "unknown arg: $1" >&2; exit 1 ;;
    esac
done

if [[ "$SLUG" != "survival-trust-axis" && "$SLUG" != "four-layers" ]]; then
    echo "supported slugs: survival-trust-axis, four-layers" >&2
    exit 1
fi

langs=()
case "$LANG" in
    ja) langs=("ja") ;;
    en) langs=("en") ;;
    all) langs=("ja" "en") ;;
    *) echo "unknown lang: $LANG" >&2; exit 1 ;;
esac

mkdir -p "$OUT_BASE/ja" "$OUT_BASE/en"

for lang in "${langs[@]}"; do
    out="$OUT_BASE/$lang/${SLUG}-01-overview-svg.svg"
    if [[ "$SLUG" == "survival-trust-axis" && "$lang" == "ja" ]]; then
        cat > "$out" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <rect x="0" y="0" width="1200" height="800" fill="#f6f3ee"/>
  <text x="80" y="92" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="38" fill="#1f2430">生存-信頼軸</text>
  <text x="80" y="130" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#5f6672">経験が何を守ろうとし、どの関係条件を失っているかを読むための最小座標系</text>
  <line x1="180" y1="520" x2="720" y2="520" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="450" y1="220" x2="450" y2="680" stroke="#2f3d4c" stroke-width="3"/>
  <polygon points="720,520 698,509 698,531" fill="#2f3d4c"/>
  <polygon points="450,220 439,242 461,242" fill="#2f3d4c"/>
  <text x="732" y="528" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="20" fill="#2f3d4c">生存軸</text>
  <text x="468" y="214" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="20" fill="#2f3d4c">信頼軸</text>
  <rect x="206" y="288" width="208" height="170" rx="18" fill="#d7e4f3" stroke="#7ba1c9" stroke-width="2"/>
  <text x="228" y="328" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#243447">関係が脅かされる</text>
  <text x="228" y="362" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#425466">理解されない</text>
  <text x="228" y="388" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#425466">受け入れられない</text>
  <text x="228" y="414" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#425466">修復できない気がする</text>
  <rect x="486" y="288" width="208" height="170" rx="18" fill="#f0ddd2" stroke="#c4835f" stroke-width="2"/>
  <text x="508" y="328" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#3d2d26">生存が脅かされる</text>
  <text x="508" y="362" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5c4337">危険を避ける</text>
  <text x="508" y="388" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5c4337">安全を確保する</text>
  <text x="508" y="414" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5c4337">防衛や保身へ向かう</text>
  <rect x="802" y="218" width="300" height="384" rx="22" fill="#ffffff" stroke="#d3c6b9" stroke-width="2"/>
  <text x="832" y="264" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="24" fill="#243447">今回の整理</text>
  <text x="832" y="310" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#425466">1. 信頼軸には発達的基盤がある</text>
  <text x="832" y="352" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#425466">2. 関係安全性は内在化された</text>
  <text x="852" y="378" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#425466">   関係資源にも支えられる</text>
  <text x="832" y="420" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#425466">3. 修復可能性は観測候補になる</text>
  <text x="832" y="462" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#425466">4. 信頼軸の中心語はまだ未確定</text>
  <text x="832" y="528" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="15" fill="#6b7280">source: survival-trust-axis report</text>
</svg>
EOF
    elif [[ "$SLUG" == "survival-trust-axis" && "$lang" == "en" ]]; then
        cat > "$out" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <rect x="0" y="0" width="1200" height="800" fill="#f6f3ee"/>
  <text x="80" y="92" font-family="Inter, Helvetica Neue, sans-serif" font-size="38" fill="#1f2430">Survival-Trust Axis</text>
  <text x="80" y="130" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#5f6672">A minimal coordinate system for reading what experience protects and which relational conditions are weakened.</text>
  <line x1="180" y1="520" x2="720" y2="520" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="450" y1="220" x2="450" y2="680" stroke="#2f3d4c" stroke-width="3"/>
  <polygon points="720,520 698,509 698,531" fill="#2f3d4c"/>
  <polygon points="450,220 439,242 461,242" fill="#2f3d4c"/>
  <text x="732" y="528" font-family="Inter, Helvetica Neue, sans-serif" font-size="20" fill="#2f3d4c">Survival axis</text>
  <text x="468" y="214" font-family="Inter, Helvetica Neue, sans-serif" font-size="20" fill="#2f3d4c">Trust axis</text>
  <rect x="206" y="288" width="208" height="170" rx="18" fill="#d7e4f3" stroke="#7ba1c9" stroke-width="2"/>
  <text x="228" y="328" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#243447">Connection is at risk</text>
  <text x="228" y="362" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#425466">not understood</text>
  <text x="228" y="388" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#425466">not accepted</text>
  <text x="228" y="414" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#425466">repair feels unavailable</text>
  <rect x="486" y="288" width="208" height="170" rx="18" fill="#f0ddd2" stroke="#c4835f" stroke-width="2"/>
  <text x="508" y="328" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#3d2d26">Survival is at risk</text>
  <text x="508" y="362" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5c4337">avoid danger</text>
  <text x="508" y="388" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5c4337">secure safety</text>
  <text x="508" y="414" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5c4337">move toward defense</text>
  <rect x="802" y="218" width="300" height="384" rx="22" fill="#ffffff" stroke="#d3c6b9" stroke-width="2"/>
  <text x="832" y="264" font-family="Inter, Helvetica Neue, sans-serif" font-size="24" fill="#243447">Current reading</text>
  <text x="832" y="310" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">1. The trust axis has a developmental basis</text>
  <text x="832" y="352" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">2. Relational safety is also supported</text>
  <text x="852" y="378" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">   by internalized resources</text>
  <text x="832" y="420" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">3. Repairability is a candidate route</text>
  <text x="852" y="446" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">   to observability</text>
  <text x="832" y="488" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#425466">4. The central term remains unsettled</text>
  <text x="832" y="528" font-family="Inter, Helvetica Neue, sans-serif" font-size="15" fill="#6b7280">source: survival-trust-axis report</text>
</svg>
EOF
    elif [[ "$SLUG" == "four-layers" && "$lang" == "ja" ]]; then
        cat > "$out" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <rect x="0" y="0" width="1200" height="800" fill="#f6f3ee"/>
  <text x="80" y="92" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="38" fill="#1f2430">4層モデル</text>
  <text x="80" y="130" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="18" fill="#5f6672">身体状態から差異の前景化、方向づけ、見直しの余地までを読む構造枠</text>
  <rect x="96" y="240" width="220" height="330" rx="22" fill="#d7e4f3" stroke="#7ba1c9" stroke-width="2"/>
  <text x="122" y="286" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="26" fill="#243447">Layer 0</text>
  <text x="122" y="324" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#243447">身体の足場</text>
  <text x="122" y="368" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#425466">呼吸・緊張・心拍</text>
  <text x="122" y="394" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#425466">意識経験の背景条件</text>
  <rect x="360" y="240" width="220" height="330" rx="22" fill="#efe4cd" stroke="#c9a45e" stroke-width="2"/>
  <text x="386" y="286" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="26" fill="#3d3424">Layer 1</text>
  <text x="386" y="324" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#3d3424">差異の選別</text>
  <text x="386" y="368" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5a503d">予測と現実の差</text>
  <text x="386" y="394" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5a503d">一部だけが前景化する</text>
  <rect x="624" y="240" width="220" height="330" rx="22" fill="#f0ddd2" stroke="#c4835f" stroke-width="2"/>
  <text x="650" y="286" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="26" fill="#3d2d26">Layer 2</text>
  <text x="650" y="324" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#3d2d26">方向づけ</text>
  <text x="650" y="368" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5c4337">生存か信頼か</text>
  <text x="650" y="394" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#5c4337">情動と行動準備の向き</text>
  <rect x="888" y="240" width="220" height="330" rx="22" fill="#dceadf" stroke="#6f9573" stroke-width="2"/>
  <text x="914" y="286" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="26" fill="#274033">Layer 3</text>
  <text x="914" y="324" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="22" fill="#274033">見直しの余地</text>
  <text x="914" y="368" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#446050">反応を固定しすぎない</text>
  <text x="914" y="394" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="16" fill="#446050">再評価へ開く</text>
  <line x1="316" y1="405" x2="360" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="580" y1="405" x2="624" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="844" y1="405" x2="888" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <polygon points="360,405 344,396 344,414" fill="#2f3d4c"/>
  <polygon points="624,405 608,396 608,414" fill="#2f3d4c"/>
  <polygon points="888,405 872,396 872,414" fill="#2f3d4c"/>
</svg>
EOF
    else
        cat > "$out" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <rect x="0" y="0" width="1200" height="800" fill="#f6f3ee"/>
  <text x="80" y="92" font-family="Inter, Helvetica Neue, sans-serif" font-size="38" fill="#1f2430">Four-Layer Model</text>
  <text x="80" y="130" font-family="Inter, Helvetica Neue, sans-serif" font-size="18" fill="#5f6672">A structural frame that reads awareness from bodily footing through discrepancy, direction, and revisability.</text>
  <rect x="96" y="240" width="220" height="330" rx="22" fill="#d7e4f3" stroke="#7ba1c9" stroke-width="2"/>
  <text x="122" y="286" font-family="Inter, Helvetica Neue, sans-serif" font-size="26" fill="#243447">Layer 0</text>
  <text x="122" y="324" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#243447">Bodily footing</text>
  <text x="122" y="368" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#425466">breath, tension, heartbeat</text>
  <text x="122" y="394" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#425466">background of experience</text>
  <rect x="360" y="240" width="220" height="330" rx="22" fill="#efe4cd" stroke="#c9a45e" stroke-width="2"/>
  <text x="386" y="286" font-family="Inter, Helvetica Neue, sans-serif" font-size="26" fill="#3d3424">Layer 1</text>
  <text x="386" y="324" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#3d3424">Discrepancy selection</text>
  <text x="386" y="368" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5a503d">prediction vs reality</text>
  <text x="386" y="394" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5a503d">only some come forward</text>
  <rect x="624" y="240" width="220" height="330" rx="22" fill="#f0ddd2" stroke="#c4835f" stroke-width="2"/>
  <text x="650" y="286" font-family="Inter, Helvetica Neue, sans-serif" font-size="26" fill="#3d2d26">Layer 2</text>
  <text x="650" y="324" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#3d2d26">Direction</text>
  <text x="650" y="368" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5c4337">survival or trust</text>
  <text x="650" y="394" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#5c4337">emotion and action readiness</text>
  <rect x="888" y="240" width="220" height="330" rx="22" fill="#dceadf" stroke="#6f9573" stroke-width="2"/>
  <text x="914" y="286" font-family="Inter, Helvetica Neue, sans-serif" font-size="26" fill="#274033">Layer 3</text>
  <text x="914" y="324" font-family="Inter, Helvetica Neue, sans-serif" font-size="22" fill="#274033">Revision margin</text>
  <text x="914" y="368" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#446050">response not fixed too early</text>
  <text x="914" y="394" font-family="Inter, Helvetica Neue, sans-serif" font-size="16" fill="#446050">keeps re-evaluation open</text>
  <line x1="316" y1="405" x2="360" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="580" y1="405" x2="624" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <line x1="844" y1="405" x2="888" y2="405" stroke="#2f3d4c" stroke-width="3"/>
  <polygon points="360,405 344,396 344,414" fill="#2f3d4c"/>
  <polygon points="624,405 608,396 608,414" fill="#2f3d4c"/>
  <polygon points="888,405 872,396 872,414" fill="#2f3d4c"/>
</svg>
EOF
    fi
    python3 "$VALIDATOR" "$out"
    echo "generated: $out"
done
