# PROJECT.md

## 目的

`awareness-space` は、意識について新しい探索を進めるための作業リポジトリである。
出発点として `kesson-driven-thinking` の既存資料を活用するが、目的は単純な移設ではない。
意識そのものを探索するための、より明確な構造をつくることを目指す。

## 強い原則

- **この repo の主題は「意識のモデル」である。**
- **欠損駆動思考そのものの調査は別 repo の担当とする。**
- `awareness-space` では、神経現象学を中核の参照領域としつつ、発達心理を含む心理学領域の知見を統合する
- F-O軸（生存と間主観性）は、この repo の特徴的な仮説であり、採用前提ではなく**検証対象**として扱う
- `Withhold` は現時点で周辺仮説の1つに留め、repo 全体の中心概念として固定しない
- 調査、データ整理、文章生成ルール、公開物はすべてこの原則に従う

## 強い体制ルール

- **現在、Claude のプロジェクト管理対象は `awareness-space` のみ**
- **`awareness-space` は Codex の担当リポジトリ**
- Codex は repo 内実務: bootstrap、実装、構造化、日常作業を担う
- Claude は repo 横断管理: 親 Issue、優先順位、依存関係、順序づけを担う
- この体制変更は pjdhiro の明示指示がある場合のみ

## 現在のスコープ

Phase 1:
- リポジトリ bootstrap
- 初期の体制整備と Issue 運用整備
- `creation-space` 型 UI / 導線 / report 受け皿の初期整備
- 現在は残作業として `#43` の性能改善がある

Phase 2:
- 親 Issue は `#44`
- `kesson-driven-thinking` から選定素材を取り込む
- 神経現象学と心理学を中核にした source map は `#45` で正本化済み
- awareness-space 固有の探索文書と次の実装 Issue 群を立ち上げる

## 正本参照

- D1-D4 正本:
  `~/dev/kesson-driven-thinking/base/schema/core-definitions.md`
- `kesson-driven-thinking` 側の親 Issue:
  `#280`

## 初期素材バケット

- schema 候補
- M1 consciousness OS テキスト
- concept note CN-001 〜 CN-007
- `creation-space-refs`
- `m2-exploration` と `m2-evidence` skills

## 品質基準

- 重要な作業単位には GitHub Issue を持たせる
- repo 間の前提は Issue か docs に明記する
- repo 内ルールはチャットだけでなく追跡対象ファイルに残す
- 調査内容が「意識モデル」から逸脱していないかを継続的に確認する

## ブランチ / 公開方針

- `main`: GitHub Pages 公開用
- `develop`: 日常作業用
- ローカル確認は `develop` を `http://localhost:3003/` で常時配信する
