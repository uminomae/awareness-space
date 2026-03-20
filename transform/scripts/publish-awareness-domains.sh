#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
DOMAINS_MD_DIR="$PJDHIRO/domains/ja/md"
MANIFEST_DIR="$PJDHIRO/manifests"
RAW_BASE="https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/awareness"
DATE_STR="$(TZ=Asia/Tokyo date +%Y-%m-%d)"

mkdir -p "$DOMAINS_MD_DIR" "$MANIFEST_DIR"

rsync -a "$ROOT/knowledge/domains/survival-trust-axis/ja/report.md" "$DOMAINS_MD_DIR/survival-trust-axis.md"
rsync -a "$ROOT/knowledge/domains/four-layers/ja/report.md" "$DOMAINS_MD_DIR/four-layers.md"
rsync -a "$ROOT/knowledge/domains/m1-consciousness-os/ja/report.md" "$DOMAINS_MD_DIR/m1-consciousness-os.md"
rsync -a "$ROOT/knowledge/domains/concept-notes/ja/report.md" "$DOMAINS_MD_DIR/concept-notes.md"

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
      "label_ja": "公開ドラフト",
      "label_en": "Draft available",
      "description_ja": "読者向け本文を読める",
      "description_en": "A reader-facing report is available",
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
      }
    }
  ]
}
EOF
