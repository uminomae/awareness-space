# domains terminology audit

**状態**: draft  
**更新日**: 2026-03-24

## 目的

`awareness-space` で現在 `domains` と呼んでいる単位が、
実態として何を指しているのかを整理し、
`#95` で行う分析 / 計画 / 実装の起点にする。

## 暫定結論

現時点の `domains` は、
`creation-space` のような「領域」ではない。
また単純な「構成要素」とも言い切れない。

実態として最も近いのは、
**統合的な全体調査報告を組むための調査トピック束**
である。

## 観測根拠

### 1. UI はすでに「構成要素レポート」または `components` として読ませている

- `index.html`
- `src/reports/render.js`

ここでは `domain` ではなく、
「構成要素レポート」「component reports」という reader-facing 文言を使っている。

### 2. ただし中身は同質な構成要素ではない

現在の `knowledge/topics/` には次が混在する。

- 生存-信頼軸
- 4層モデル
- Withhold
- concept-notes
- 4層モデルの原著文書群

これは同列の「部品」ではなく、
理論仮説、説明モデル、補助概念、原著系列が混在した束である。

### 3. survey / 現在地 / 統合報告への返却先として使われている

- `transform/survey/reader-rules/reader-rules-awareness-survey.md`
- `docs/summary-report-pairing.md`
- `docs/report-structure.md`

これらの文書では、
各 report は単独完結の終点ではなく、
調査の現在地や統合的な全体整理へ返される中間単位として扱われている。

### 4. docs 側でも毎回「読み替え」を要求している

- `docs/topics-mapping.md`
- `transform/topics/README.md`
- `transform/topics/reader-rules/reader-rules-awareness-report.md`

いずれも
「`creation-space` の domains とは違う」
「awareness では別の意味で使う」
という但し書きを持つ。

これは `domains` が repo 固有概念として自然に定着していないことを示す。

## 現時点の判断

### 採用候補

- `topics`
- `research-topics`
- `integration-topics`

日本語候補:

- 調査トピック
- 統合トピック
- 調査トピック束

### 保留候補

- `components`

理由:
reader-facing には分かりやすいが、
原著文書群や concept notes まで同列の「構成要素」と呼ぶにはやや強い。

### 非推奨

- `domains`

理由:
`creation-space` 由来の legacy 名としては残せても、
意味としてはこの repo の実態を表しにくい。

## 次に見るべき場所

- `docs/topics-mapping.md`
- `docs/report-structure.md`
- `transform/topics/README.md`
- `transform/topics/reader-rules/reader-rules-awareness-report.md`
- `transform/topics/publish/topics/index.json`
- `pjdhiro/assets/awareness/manifests/domains.json`
- `transform/survey/reader-rules/reader-rules-awareness-survey.md`

## 次の判断課題

1. reader-facing 名称を `components` のまま維持するか
2. internal contract の `domains` を legacy 名として残すか
3. path / manifest / script まで rename するか
4. `survey-status` / `survey-domain-index` をどう再命名するか
