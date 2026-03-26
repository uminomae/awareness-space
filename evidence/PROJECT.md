# awareness-space 調査憲章

**状態**: 進行中
**開始**: 2026-03
**更新**: 2026-03-22

## 0. 戦略

### 0.1 目的

`awareness-space` は、「意識とは何か」を探索する独立リポジトリである。
`kesson-driven-thinking` に蓄積された意識モデル関連の知識を素材として活用しながら、
意識そのものを記述するための新しい構造を立ち上げる。

### 0.1.1 強い原則

- この調査が扱う主題は **意識のモデル** に限定する
- 意識モデルに直接寄与しない理論や、欠損駆動思考由来の記述を見つけたら削除する
- 別 repo 側の理論展開はこの repo の担当外とする
- 神経現象学を中心参照に据えつつ、発達心理を含む心理学領域の知見を統合する
- 生存-信頼軸（生存と間主観性）は、この repo の中核仮説であり、**是非を含めた検証対象**として扱う
- D01-D30 の構造類似調査は `creation-space` 側の調査であり、この repo のスコープに含めない

### 0.2 出発点

このプロジェクトの最初の中核仮説は **生存-信頼軸** である。

- 生存軸: 生存、脅威、安全、保身
- 信頼軸: 関係、愛着、所属、信頼、間主観性

現段階では、この二軸を「意識が何を重要なものとして扱うか」を分ける最小座標系として扱う。

### 0.3 方針

- これは単純な移設ではなく、既存知識を使った**新しい探索**である
- D1-D4 の正本は引き続き `kesson-driven-thinking` 側に残す
- `creation-space` と同じサイトの別ページのように見える構造・導線・UI を採用する
- 調査原本は `evidence/`、公開向け整理は `knowledge/`、UI は `src/` に置く
- 重要な作業単位は GitHub Issue で管理する

## 1. この調査は何か

`awareness-space` の調査は、意識モデルの知識をひとまとめに置き直すことではなく、
意識の構造をどのような単位で記述できるかを探索する作業である。
主題は神経現象学と心理学的知見を軸にした意識モデルの統合であり、
別 repo 側の理論展開はこの repo の対象外とする。

現時点では、次の3層を区別して扱う。

1. **意識モデルの解説**
2. **調査内容**
3. **調査報告**

この3層を `creation-space` の
「5段階モデル / 調査内容 / REPORTS」
に対応する形で整備していく。

## 2. 現在の中核モデル

### 2.1 起点仮説

最初の起点文書:

- `knowledge/survival-trust-axis-starting-memo.md`

このメモでは、次を暫定的に採用している。

- 意識経験はズレや欠損を 生存軸 / 信頼軸 で評価する
- 情動や行動準備は、この評価を通じて方向づけられる
- 信頼軸の問題を 生存軸で処理しようとする誤配が、人間の苦しさの重要な源泉である

ただし、これらは採択済みの正解ではなく、repo 全体で検証される仮説として扱う。

### 2.2 正本参照

現時点で `awareness-space` が正本参照するもの:

- `~/dev/kesson-driven-thinking/base/schema/core-definitions.md`
- `~/dev/kesson-driven-thinking/base/schema/five-stages.md`
- `~/dev/kesson-driven-thinking/base/schema/four-layers.md`
- `~/dev/kesson-driven-thinking/base/schema/four-modules.md`

### 2.3 素材インベントリ

初期素材一覧:

- `docs/material-inventory.md`
- `evidence/review/core-source-map.md`

ここには schema、4層モデルの原著文書群、concept notes、
`creation-space-refs`、`m2-*` skills を整理してある。

## 3. プロジェクト状態

### 3.1 現在地

- `awareness-space` は GitHub Pages 前提の `main` / `develop` 体制を持つ
- `develop` は `http://localhost:3003/` で常時配信されている
- 背景試作は `src/backgrounds/` に昇格済み
- Phase 1 の親 Issue `#6`, `#9`, `#21` は完了済み
- `#60`, `#61` は完了済み
- `#69`, `#76`, `#78`, `#81`, `#83`, `#84` は完了済み
- `#87` は完了済み
- `#85` は完了済み
- `#90` は完了済み
- `#89` は完了済み
- `#88` は完了済み
- `#91`, `#93` は完了済み
- 現在の open Issue:
  - `#100` Gemini SVG workflow 模倣
- source map の正本は `evidence/review/core-source-map.md`
- 神経現象学 intake の正本は `evidence/review/neurophenomenology-intake-map.md`
- 発達心理学 intake の正本は `evidence/review/developmental-psychology-intake-map.md`
- intake の返し先正本は `evidence/review/intake-return-map.md`
- 調査設計の起点は `evidence/review/research-design-baseline.md`
- 調査設計メモ本体は `evidence/review/research-design.md`
- 発達心理学設計の正本は `evidence/review/developmental-psychology-design.md`
- 神経現象学設計の正本は `evidence/review/neurophenomenology-design.md`
- `survey-status.md` が示す未整備論点は、神経現象学接続と発達心理学接続へ絞られている

### 3.2 現在の主作業

- topics 契約へ移行した repo を前提に、図解 workflow の最小導入を個別 Issue で進める

### 3.3 次のアクション

- `#100` で creation-space の Gemini SVG workflow を awareness-space に持ち込む
- `survival-trust-axis` 導入で固めた契約をもとに、次の topic 展開が必要なら個別 Issue 化する

### 3.4 ブロッカー

- intake の返し先は整理したが、guide / survey / report への再反映はまだ進行中

## 4. ファイル構成

| パス | 役割 |
|---|---|
| `evidence/PROJECT.md` | 調査憲章。調査目的、起点仮説、現在地の正本 |
| `evidence/README.md` | evidence ディレクトリの入口 |
| `evidence/review/` | 横断レビュー、進捗設計、設計判断ログ、将来のレビュー成果 |
| `evidence/work/` | 初期スキャン、一次候補、取り込み前の中間素材 |
| `evidence/deepdive/` | Level2 以降の深掘り探索（準備/プレースホルダ） |
| `evidence/archive/` | Revise 前の evidence 退避を管理 |
| `docs/material-inventory.md` | 初期素材インベントリ |
| `knowledge/survival-trust-axis-starting-memo.md` | 生存-信頼軸 起点メモ |
| `src/` | Web UI 本体 |
| `src/backgrounds/` | 背景の tracked prototype |
| `transform/` | 将来の公開用変換 workflow |

## 5. 呼び出し側への契約

### 現時点で提供するもの

- 生存-信頼軸を起点とする意識探索の入口
- 意識モデル関連素材のインベントリ
- `creation-space` 型のサイト shell とローカル確認環境

### まだ進行中のもの

- 意識モデルの解説ページ群
- 調査内容の正本整理
- 調査報告の一覧・詳細 UI
