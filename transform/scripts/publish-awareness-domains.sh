#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
DOMAINS_JA_MD_DIR="$PJDHIRO/domains/ja/md"
DOMAINS_EN_MD_DIR="$PJDHIRO/domains/en/md"
MANIFEST_DIR="$PJDHIRO/manifests"
RAW_BASE="https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/awareness"
DATE_STR="$(TZ=Asia/Tokyo date +%Y-%m-%d)"

mkdir -p "$DOMAINS_JA_MD_DIR" "$DOMAINS_EN_MD_DIR" "$MANIFEST_DIR"

publish_domain() {
    local slug="$1"
    rsync -a "$ROOT/knowledge/domains/${slug}/ja/report.md" "$DOMAINS_JA_MD_DIR/${slug}.md"
    rsync -a "$ROOT/knowledge/domains/${slug}/en/report.md" "$DOMAINS_EN_MD_DIR/${slug}.md"
}

publish_domain "survival-trust-axis"
publish_domain "four-layers"

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
      "description_ja": "読者向け report を参照できる",
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
        "ja": "${RAW_BASE}/domains/ja/md/survival-trust-axis.md",
        "en": "${RAW_BASE}/domains/en/md/survival-trust-axis.md"
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
        "ja": "${RAW_BASE}/domains/ja/md/four-layers.md",
        "en": "${RAW_BASE}/domains/en/md/four-layers.md"
      }
    }
  ]
}
EOF
