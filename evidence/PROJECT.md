# awareness-space 調査憲章

**状態**: 進行中
**開始**: 2026-03
**更新**: 2026-03-17

## 0. 戦略

### 0.1 目的

`awareness-space` は、「意識とは何か」を探索する独立リポジトリである。
`kesson-driven-thinking` に蓄積された意識モデル関連の知識を素材として活用しながら、
意識そのものを記述するための新しい構造を立ち上げる。

### 0.1.1 強い原則

- この調査が扱う主題は **意識のモデル** に限定する
- 欠損駆動思考そのものの調査は別 repo の担当とする
- 神経現象学を中心参照に据えつつ、発達心理を含む心理学領域の知見を統合する
- F-O軸（生存と間主観性）は、この repo の中核仮説であり、**是非を含めた検証対象**として扱う
- `Withhold` は周辺仮説として扱い、repo 全体の中心主題として固定しない
- D01-D30 の構造類似調査は、本体調査ではなく比較素材として扱う

### 0.2 出発点

このプロジェクトの最初の中核仮説は **F-O軸** である。

- F軸: 生存、脅威、安全、保身
- O軸: 関係、愛着、所属、信頼、間主観性

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
欠損駆動思考そのものの理論展開はこの repo の対象外とする。

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

- `knowledge/fo-axis-starting-memo.md`

このメモでは、次を暫定的に採用している。

- 意識経験はズレや欠損を F軸 / O軸 で評価する
- 情動や行動準備は、この評価を通じて方向づけられる
- O軸の問題を F軸で処理しようとする誤配が、人間の苦しさの重要な源泉である

ただし、これらは採択済みの正解ではなく、repo 全体で検証される仮説として扱う。

### 2.2 正本参照

現時点で `awareness-space` が正本参照するもの:

- `~/dev/kesson-driven-thinking/base/schema/core-definitions.md`
- `~/dev/kesson-driven-thinking/base/schema/five-stages.md`
- `~/dev/kesson-driven-thinking/base/schema/four-layers.md`
- `~/dev/kesson-driven-thinking/base/schema/four-modules.md`
- `~/dev/kesson-driven-thinking/base/schema/withhold-matching-v2.md`

### 2.3 素材インベントリ

初期素材一覧:

- `docs/material-inventory.md`

ここには schema、M1 consciousness OS、concept notes、D01-D30 evidence 系譜、
`creation-space-refs`、`m2-*` skills を整理してある。

## 3. プロジェクト状態

### 3.1 現在地

- `awareness-space` は GitHub Pages 前提の `main` / `develop` 体制を持つ
- `develop` は `http://localhost:3003/` で常時配信されている
- 背景試作は `src/backgrounds/` に昇格済み
- Phase 1 の親 Issue `#6`, `#9`, `#21` は完了済み
- 現在の open Issue は `#43`, `#44`, `#45`, `#46`

### 3.2 現在の主作業

- `#43` で風神雷神背景の FPS を 60 目標に軽量化する
- `#45` で神経現象学と心理学を中核にした source map を整備する
- `#46` で D01-D30 evidence を比較素材としてどう取り込むかを固定する
- `#44` を親として、次の内容統合フェーズの実装順を整理する

### 3.3 次のアクション

- `#43` を完了させ、Phase 1 の残作業を閉じる
- `#45` の source map を正本パスに固定する
- `#46` で D01-D30 の一次コピー元と補助参照の境界を明文化する
- `#44` 配下に、domain report 化や evidence intake の実装 Issue を追加する

### 3.4 ブロッカー

- D01-D30 evidence の取り込みポリシーが未確定
- 神経現象学と心理学を中心に据えた source map がまだ固定されていない
- domain report をどの順で実体化するかが未分解

## 4. ファイル構成

| パス | 役割 |
|---|---|
| `evidence/PROJECT.md` | 調査憲章。調査目的、起点仮説、現在地の正本 |
| `evidence/README.md` | evidence ディレクトリの入口 |
| `evidence/review/` | 横断レビュー、進捗設計、設計判断ログ、将来のレビュー成果 |
| `evidence/work/` | D01-D30 初期スキャン、一次候補、取り込み前の中間素材 |
| `evidence/deepdive/` | Level2 以降の深掘り探索（準備/プレースホルダ） |
| `evidence/archive/` | Revise 前の evidence 退避を管理 |
| `docs/material-inventory.md` | 初期素材インベントリ |
| `knowledge/fo-axis-starting-memo.md` | F-O軸 起点メモ |
| `src/` | Web UI 本体 |
| `src/backgrounds/` | 背景の tracked prototype |
| `transform/` | 将来の公開用変換 workflow |

## 5. 呼び出し側への契約

### 現時点で提供するもの

- F-O軸を起点とする意識探索の入口
- 意識モデル関連素材のインベントリ
- `creation-space` 型のサイト shell とローカル確認環境

### まだ進行中のもの

- 意識モデルの解説ページ群
- 調査内容の正本整理
- 調査報告の一覧・詳細 UI
