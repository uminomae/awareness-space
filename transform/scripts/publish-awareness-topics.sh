#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
TOPICS_JA_MD_DIR="$PJDHIRO/topics/ja/md"
TOPICS_EN_MD_DIR="$PJDHIRO/topics/en/md"
TOPICS_JA_PDF_DIR="$PJDHIRO/topics/ja/pdf"
TOPICS_EN_PDF_DIR="$PJDHIRO/topics/en/pdf"
MANIFEST_DIR="$PJDHIRO/manifests"
LOCAL_MANIFEST="$ROOT/transform/topics/publish/topics/index.json"
RAW_BASE="https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/awareness"
PAGES_BASE="https://uminomae.github.io/pjdhiro/assets/awareness"
DATE_STR="$(TZ=Asia/Tokyo date +%Y-%m-%d)"

mkdir -p "$TOPICS_JA_MD_DIR" "$TOPICS_EN_MD_DIR" "$TOPICS_JA_PDF_DIR" "$TOPICS_EN_PDF_DIR" "$MANIFEST_DIR" "$(dirname "$LOCAL_MANIFEST")"

publish_topic() {
    local slug="$1"
    rsync -a "$ROOT/knowledge/topics/${slug}/ja/report.md" "$TOPICS_JA_MD_DIR/${slug}.md"
    rsync -a "$ROOT/knowledge/topics/${slug}/en/report.md" "$TOPICS_EN_MD_DIR/${slug}.md"
}

publish_topic "survival-trust-axis"
publish_topic "four-layers"

python3 - "$ROOT" "$PJDHIRO" "$RAW_BASE" "$PAGES_BASE" "$DATE_STR" "$LOCAL_MANIFEST" "$MANIFEST_DIR/topics.json" <<'PY'
import json
import os
import re
import sys

root, awareness_assets, raw_base, pages_base, date_str, local_manifest, public_manifest = sys.argv[1:]

def read_frontmatter(path):
    if not os.path.isfile(path):
        return {}
    text = open(path, encoding='utf-8').read()
    match = re.match(r'^---\n([\s\S]*?)\n---\n', text)
    if not match:
        return {}
    meta = {}
    for line in match.group(1).splitlines():
        if ':' not in line:
            continue
        key, value = line.split(':', 1)
        meta[key.strip()] = value.strip().strip('"').strip("'")
    return meta

progress_taxonomy = [
    {
        'id': 'planned',
        'label_ja': '設計中',
        'label_en': 'Planned',
        'description_ja': 'topic 定義のみ。読者向け report は未配置',
        'description_en': 'Topic defined, but no reader-facing report yet',
        'order': 10,
        'tone': 'secondary',
    },
    {
        'id': 'source_ready',
        'label_ja': '素材移設済',
        'label_en': 'Source ready',
        'description_ja': '移設済み素材または overview を参照できる',
        'description_en': 'Imported source material or overview is available',
        'order': 20,
        'tone': 'warning',
    },
    {
        'id': 'report_ready',
        'label_ja': '公開中',
        'label_en': 'Published',
        'description_ja': '読者向け report を参照できる',
        'description_en': 'A reader-facing report is available',
        'order': 30,
        'tone': 'success',
    },
]

report_specs = [
    {
        'id': 'A01',
        'slug': 'survival-trust-axis',
        'name_ja': '生存-信頼軸',
        'name_en': 'Survival-Trust Axis',
        'progress_level': 'report_ready',
        'progress_note': '公開本文あり',
        'summary_ja': '経験の向きを生存と信頼の二軸から捉えるための報告。',
        'summary_en': 'A report on the two-axis model of survival and intersubjectivity.',
    },
    {
        'id': 'A02',
        'slug': 'four-layers',
        'name_ja': '4層モデル',
        'name_en': 'Four Layers',
        'progress_level': 'report_ready',
        'progress_note': '公開本文あり',
        'summary_ja': '意識を身体状態から見直しの余地までの流れとして捉える報告。',
        'summary_en': 'A report on awareness as a processing chain from bodily state to response margin.',
    },
]

def build_reports(md_builder, pdf_builder):
    reports = []
    for spec in report_specs:
        slug = spec['slug']
        generator_model = {}
        generated = {}
        for lang in ('ja', 'en'):
            meta = read_frontmatter(os.path.join(root, 'knowledge', 'topics', slug, lang, 'report.md'))
            generator_model[lang] = meta.get('generator_model', '')
            generated[lang] = meta.get('generated') or meta.get('date', '')
        pdf = {}
        for lang in ('ja', 'en'):
            pdf_path = os.path.join(awareness_assets, 'topics', lang, 'pdf', f'{slug}.pdf')
            pdf[lang] = pdf_builder(slug, lang) if os.path.isfile(pdf_path) else None
        reports.append({
            **spec,
            'generator_model': generator_model,
            'generated': generated,
            'md': md_builder(slug),
            'pdf': pdf,
        })
    return reports

local_payload = {
    'version': '0.3',
    'generated_at': date_str,
    'note': 'awareness-space reports manifest',
    'progress_taxonomy': progress_taxonomy,
    'reports': build_reports(lambda slug: {
        'ja': f'./knowledge/topics/{slug}/ja/report.md',
        'en': f'./knowledge/topics/{slug}/en/report.md',
    }, lambda slug, lang: f'{pages_base}/topics/{lang}/pdf/{slug}.pdf'),
}

public_payload = {
    'version': '0.3',
    'generated_at': date_str,
    'namespace': 'awareness',
    'progress_taxonomy': progress_taxonomy,
    'reports': build_reports(lambda slug: {
        'ja': f'{raw_base}/topics/ja/md/{slug}.md',
        'en': f'{raw_base}/topics/en/md/{slug}.md',
    }, lambda slug, lang: f'{pages_base}/topics/{lang}/pdf/{slug}.pdf'),
}

for path, payload in ((local_manifest, local_payload), (public_manifest, public_payload)):
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write('\n')
PY
