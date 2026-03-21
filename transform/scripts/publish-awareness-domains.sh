#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/uminomae/dev/awareness-space"
PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/awareness"
DOMAINS_JA_MD_DIR="$PJDHIRO/domains/ja/md"
DOMAINS_EN_MD_DIR="$PJDHIRO/domains/en/md"
MANIFEST_DIR="$PJDHIRO/manifests"
LOCAL_MANIFEST="$ROOT/transform/domains/publish/domains/index.json"
RAW_BASE="https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/awareness"
DATE_STR="$(TZ=Asia/Tokyo date +%Y-%m-%d)"

mkdir -p "$DOMAINS_JA_MD_DIR" "$DOMAINS_EN_MD_DIR" "$MANIFEST_DIR" "$(dirname "$LOCAL_MANIFEST")"

publish_domain() {
    local slug="$1"
    rsync -a "$ROOT/knowledge/domains/${slug}/ja/report.md" "$DOMAINS_JA_MD_DIR/${slug}.md"
    rsync -a "$ROOT/knowledge/domains/${slug}/en/report.md" "$DOMAINS_EN_MD_DIR/${slug}.md"
}

publish_domain "survival-trust-axis"
publish_domain "four-layers"

python3 - "$ROOT" "$RAW_BASE" "$DATE_STR" "$LOCAL_MANIFEST" "$MANIFEST_DIR/domains.json" <<'PY'
import json
import os
import re
import sys

root, raw_base, date_str, local_manifest, public_manifest = sys.argv[1:]

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
        'description_ja': 'domain 定義のみ。読者向け report は未配置',
        'description_en': 'Domain defined, but no reader-facing report yet',
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

def build_reports(md_builder):
    reports = []
    for spec in report_specs:
        slug = spec['slug']
        generator_model = {}
        generated = {}
        for lang in ('ja', 'en'):
            meta = read_frontmatter(os.path.join(root, 'knowledge', 'domains', slug, lang, 'report.md'))
            generator_model[lang] = meta.get('generator_model', '')
            generated[lang] = meta.get('generated') or meta.get('date', '')
        reports.append({
            **spec,
            'generator_model': generator_model,
            'generated': generated,
            'md': md_builder(slug),
        })
    return reports

local_payload = {
    'version': '0.3',
    'generated_at': date_str,
    'note': 'awareness-space reports manifest',
    'progress_taxonomy': progress_taxonomy,
    'reports': build_reports(lambda slug: {
        'ja': f'./knowledge/domains/{slug}/ja/report.md',
        'en': f'./knowledge/domains/{slug}/en/report.md',
    }),
}

public_payload = {
    'version': '0.3',
    'generated_at': date_str,
    'namespace': 'awareness',
    'progress_taxonomy': progress_taxonomy,
    'reports': build_reports(lambda slug: {
        'ja': f'{raw_base}/domains/ja/md/{slug}.md',
        'en': f'{raw_base}/domains/en/md/{slug}.md',
    }),
}

for path, payload in ((local_manifest, local_payload), (public_manifest, public_payload)):
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
        fh.write('\n')
PY
