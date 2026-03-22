# evidence-metadata（awareness-space 固有）

**正本**: `docs/evidence-metadata-awareness.md`  
**参照元**: `creation-space/docs/evidence-metadata-creation.md`  
**状態**: 初版

awareness-space の公開 markdown / manifest / modal UI で使う metadata 契約の正本。

## 1. フィールド定義

### 1.1 `generator_model`

公開本文の生成または改稿に使った LLM / model を表す。

書式:

`{tool}:{model_string}`

例:

- `codex:gpt-5`
- `claude:claude-opus-4-6`
- `claude:claude-opus-4-6+gpt:deep-research`

不明な既存本文は `unknown` を使う。空欄にはしない。
未生成で model が存在しない場合のみ `not_applicable` を使う。

### 1.2 `generated`

各公開本文の生成日。本文単位の metadata。

- 形式: `YYYY-MM-DD`
- 配置先: source markdown front matter、manifest entry

### 1.3 `generated_at`

manifest 全体を再生成した日。manifest 単位の metadata。

- 形式: `YYYY-MM-DD`
- 配置先: manifest root

## 2. 配置場所

### 2.1 source markdown front matter

対象:

- `knowledge/domains/*/{ja,en}/report.md`
- `pjdhiro/assets/awareness/guides/{ja,en}/md/*.md`
- `pjdhiro/assets/awareness/survey/{ja,en}/md/*.md`

必須:

- `title`
- `lang`
- `version`
- `generated`
- `generator_model`

互換のため `date` を残してもよいが、metadata の source of truth は `generated` とする。

### 2.2 manifests

対象:

- guides: `pjdhiro/assets/awareness/manifests/guides.json`
- survey: `pjdhiro/assets/awareness/manifests/survey.json`
- image cards: `pjdhiro/assets/awareness/manifests/image-cards.json`
- domains:
  - repo snapshot: `transform/domains/publish/domains/index.json`
  - public copy: `pjdhiro/assets/awareness/manifests/domains.json`

契約:

- manifest root は `generated_at` を持つ
- entry / file は対応する公開本文の `generator_model` と `generated` を持つ

### 2.3 UI

`src/reports/modal.js` は次の優先順で metadata を解決する。

1. 開いた markdown の front matter
2. manifest entry から渡された metadata
3. manifest root の `generated_at`（日付のみの fallback）

## 3. 情報フロー

### 3.1 domains

```text
docs/evidence-metadata-awareness.md
    ↓
knowledge/domains/*/{ja,en}/report.md
    ↓
transform/domains/publish/domains/index.json
    ↓
pjdhiro/assets/awareness/manifests/domains.json
    ↓
src/reports/data.js / src/reports/modal.js
```

### 3.2 guides / survey

```text
docs/evidence-metadata-awareness.md
    ↓
pjdhiro/assets/awareness/{guides,survey}/*/md/*.md
    ↓
pjdhiro/assets/awareness/manifests/{guides,survey}.json
    ↓
src/reports/modal.js
```

guides / survey の modal 表示は front matter を一次参照とし、manifest は publish 契約と検査用の記録として使う。

### 3.3 image cards

```text
pjdhiro/assets/awareness/image-cards/items/{slug}.(png|jpg|...)
    +
pjdhiro/assets/awareness/image-cards/items/{slug}.json
    ↓
pjdhiro/assets/awareness/manifests/image-cards.json
    ↓
awareness-space/src/image-cards.js
```

image cards は markdown modal を前提にせず、manifest の `title_*` / `comment_*` / `image` をそのままカード UI に使う。
`review_status: "draft"` の sidecar と、旧来の generic 自動コメントは manifest に載せない。
公開用 `comment_*` は、図が何を表現しているかを短く要約する。可視要素の列挙や「図として読める」というメタ説明は避ける。

## 4. 更新タイミング

- guide / survey 更新時:
  `transform/scripts/build-pdf-guide.sh` で PDF と manifests を更新する
- domain report 更新時:
  `transform/scripts/publish-awareness-domains.sh` で repo snapshot と public manifest を更新する
- modal 表示変更時:
  `src/reports/modal.js`, `src/reports/data.js`, `src/reports/render.js` を同時確認する

## 5. 検証ルール

- front matter に `generator_model` / `generated` があること
- manifest root に `generated_at` があること
- manifest entry / file の metadata が source markdown と矛盾しないこと
- image cards は公開対象のみが manifest に載り、draft sidecar が混入していないこと
- image cards の `comment_*` が theme-only / auto-ingest / 図として読める型の文になっていないこと
- UI 表示が `モデル` / `生成日` の文言で揃っていること
