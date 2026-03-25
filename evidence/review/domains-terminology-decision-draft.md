# domains terminology decision draft

**状態**: draft  
**更新日**: 2026-03-25  
**関連**: `#95`

## 目的

`domains` という legacy 名をどう扱うかについて、
現時点での採択案を先に固定する。

この文書は最終決定ではなく、
実装前の **意思決定ドラフト** である。

## 提案

### 1. reader-facing 名称は `調査トピック` / `Topic Reports` を採用する

採択:
- 日本語: `調査トピック`
- 英語: `Topic Reports`

理由:
- `components` より広く、原著文書群や concept notes も含めやすい
- report / survey / 統合報告への返却先として自然
- すでに UI / docs の一部はこの方向へ寄せ始めている

### 2. internal contract の `domains` は当面維持する

採択:
- path 名
- manifest 名
- script 名
- loader 定数名

は、現時点では legacy internal contract として維持する。

理由:
- `transform/domains/publish/domains/index.json`
- `pjdhiro/assets/awareness/manifests/domains.json`
- `transform/scripts/publish-awareness-domains.sh`
- `src/reports/data.js`
- `knowledge/domains/`

に広く波及し、
公開経路まで壊す可能性があるため。

### 3. すぐに rename する対象と、保留する対象を分ける

#### すぐに進めてよい

- UI 文言
- docs / reader-rules / workflow の意味づけ
- survey / overview / pairing の reader-facing 文言

#### 保留する

- `survey-domain-index.md` の file 名
- `domains.json` の file 名
- `knowledge/domains/` path
- `transform/domains/` path
- script 名と JS 定数名

## この案で避けられること

- 途中半端な rename による publish 経路の破損
- reader-facing と internal contract が同時に変わることで起きる混乱
- `components` のような狭すぎる語への premature fix

## この案で残る課題

### 1. `survey-domain-index.md` が legacy alias として残る

対応:
- reader-facing では `survey-topic-index` / `調査トピック索引` を使う
- `survey-domain-index` は互換用 alias として当面残す

### 2. `knowledge/domains/` が意味と path でズレる

対応:
- docs で legacy path であることを明記する
- 実体 rename は最後に回す

### 3. `domains.json` が topic report を指す manifest になる

対応:
- manifest 名は internal contract として維持
- 読者向け文言では `topic reports manifest` と呼ぶ

## 判断

現時点では次を採択する。

1. reader-facing: `調査トピック`
2. internal contract: `domains` を維持
3. 実装順: 文言整備を先行、rename は後段

## 次の実装候補

### Option A. 最小安全策

- `#95` はこの判断を採択して close
- 実装は reader-facing 文言整備で止める

### Option B. 段階 rename

- `survey-topic-index` を preferred 名として先行導入し、legacy alias を段階的に外す
- manifest / path は据え置く

### Option C. full migration

- `domains` を `topics` 系へ全面 rename
- ただしこれは別 issue 群へ分解する方が安全

## 推奨

現時点の推奨は **Option A と B の中間** である。

- 今は `#95` を close しない
- ただし「reader-facing は調査トピック、internal contract は domains」の暫定判断は採択する
- 次は `survey-topic-index` 導入後に、legacy alias をどこまで維持するかを判断する
