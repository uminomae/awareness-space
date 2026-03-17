# CLAUDE.md

`awareness-space` で作業するための最小運用ルール。

## 強いルール

- **Claude が主プロジェクト管理者**
- **`awareness-space` は Codex の担当リポジトリ**
- Codex はこの repo の bootstrap、実装、構造化、日常作業を担う
- Claude は親 Issue、優先順位、依存関係、全体進行を管理する
- この体制変更は pjdhiro の明示指示がある場合のみ

## プロジェクトの位置づけ

- `awareness-space` は、「意識とは何か」を探索する独立リポジトリ
- `kesson-driven-thinking` の既存資料は素材であり、自動的な正本ではない
- D1-D4 の正本は `~/dev/kesson-driven-thinking/base/schema/core-definitions.md`
- 出発点の仮説は F-O軸: 生存と間主観性を基礎とする意識仮説

## 作業ルール

- 大きな作業の前に `PROJECT.md` と `docs/README.md` を読む
- この repo では GitHub Issues を追跡単位の基本とする
- repo 間依存はチャットだけで済ませず、Issue に記録する
- Codex で commit する場合は、変更を絞り `Co-Authored-By: Codex <noreply@openai.com>` を含める
