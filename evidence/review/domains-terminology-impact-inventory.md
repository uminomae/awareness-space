# domains terminology impact inventory

**状態**: draft  
**更新日**: 2026-03-24  
**関連**: `#95`

## 目的

`domains` という legacy 名を変更する場合に、
どこが壊れ、どこをどの順で直す必要があるかを棚卸しする。

この文書は rename 実装の前提となる **影響範囲一覧** である。

## 結論

影響は次の 5 層にまたがる。

1. reader-facing UI 文言
2. docs / reader-rules / workflow の意味づけ
3. knowledge 配下の path と参照
4. manifest / scripts / data loader の internal contract
5. survey 系ファイル名と索引導線

このため、
rename を行うなら **reader-facing → docs → internal contract** の順で段階的に進める必要がある。

## 1. reader-facing UI

### すでに `調査トピック` 側へ寄せた場所

- `index.html`
- `src/reports/render.js`

### まだ legacy 名の影響が残る場所

- `src/reports/data.js`
  - `AWARENESS_DOMAINS_MANIFEST_URL`
  - `DEFAULT_REPORTS_DATA_URL`
- `src/reports/*`
  - DOM id / state 名に `domains` が残る

### 判断ポイント

- UI ラベルは `調査トピック` のまま固定できる
- ただし DOM id や JS state は rename 必須ではない

## 2. docs / workflow / reader-rules

### 主要正本

- `docs/topics-mapping.md`
- `docs/report-structure.md`
- `docs/summary-report-pairing.md`
- `transform/topics/README.md`
- `transform/topics/WORKFLOW.md`
- `transform/topics/reader-rules/reader-rules-awareness-report.md`
- `transform/survey/reader-rules/reader-rules-awareness-survey.md`

### 状態

- 意味づけはかなり `調査トピック` 側へ寄せた
- ただし path 名や manifest 名の説明は `domains` のまま残っている

### 判断ポイント

- docs は先に読者向け意味づけを固定できる
- internal contract を rename する場合は docs 側の「legacy 名である」記述を順次外す

## 3. knowledge 配下の path 契約

### 主要対象

- `knowledge/topics/README.md`
- `knowledge/topics/survival-trust-axis/`
- `knowledge/topics/four-layers/`
- `knowledge/topics/withhold/`
- `knowledge/topics/concept-notes/`

### 影響

- path rename は reader-facing link、survey、report overview、evidence/review 内参照に波及する
- 4層モデルの原著文書群まで `knowledge/topics/` に乗っているため、単純 rename ではなく再配置判断が必要

### 判断ポイント

- `knowledge/topics/` は最後に触る
- 先に topic 概念を固定し、path は legacy として維持する選択肢が強い

## 4. manifest / scripts / data loader

### manifest

- `transform/topics/publish/topics/index.json`
- `pjdhiro/assets/awareness/manifests/topics.json`

### scripts

- `transform/scripts/publish-awareness-topics.sh`
- `transform/scripts/build-pdf-guide.sh`

### loader / runtime

- `src/reports/data.js`

### 影響

- file 名
- JSON key
- raw/pages URL
- local snapshot path
- loader 定数名

### 判断ポイント

- ここを変えると UI / publish / Pages の全経路に波及する
- internal contract として `domains` を残すなら、最も安全

## 5. survey 系ファイル名と導線

### 主要対象

- `survey-topic-index.md`（preferred）
- `survey-domain-index.md`（legacy alias）
- `transform/survey/reader-rules/reader-rules-awareness-survey.md`
- `evidence/research-overview.md`
- `docs/summary-report-pairing.md`

### 影響

- `domain-index` という file 名自体が legacy 名
- ただし survey の reader-facing 役割はすでに「索引」として説明できている

### 判断ポイント

- rename 候補:
  - `survey-topic-index.md`
  - `survey-report-index.md`
- 現在は `survey-topic-index` を preferred 名、`survey-domain-index` を legacy alias として扱う

## 推奨移行順

### Step 1. reader-facing 用語を固定する

- `調査トピック`
- `Topic Reports`

### Step 2. docs / survey / pairing の意味づけを固定する

- `domains` は legacy 名
- 実態は topic bundle

### Step 3. internal contract の維持 / rename を判断する

判断対象:

- `transform/topics/publish/topics/index.json`
- `pjdhiro/assets/awareness/manifests/topics.json`
- `survey-domain-index.md`
- `knowledge/topics/`

### Step 4. rename 実装をするなら分割する

1. survey file 名
2. manifest file 名
3. script / loader 定数
4. path 変更

## 現時点の提案

- reader-facing: `調査トピック` を採用
- docs / workflow: `domains` は legacy internal contract と明記
- path / manifest / script: 当面維持
- rename 実装は、`survey-domain-index` と manifest 名のどちらを先に変えるかを別途決める
