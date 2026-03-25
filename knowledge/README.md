# knowledge — 意識モデル知識ベース

## 5W1H

- **What**: `awareness-space` の解説用ナレッジを整理するディレクトリ
- **Why**: `evidence/` から抽出・要約された知識を、公開時に再利用しやすい形で置くため
- **Who**: 読者、`transform/` パイプライン、将来のレポート再生成で参照する
- **When**: `モデル解説` の更新、公開用文書の追加・改訂時
- **Where**: `awareness-space/knowledge/`
- **How**: `schema/` と `topics/` を分離し、役割ごとに参照先を固定して運用する

## 役割分離

| ディレクトリ | 役割 |
|---|---|
| `knowledge/` | 説明・解説向けの受け皿（運用中） |
| `knowledge/guides/` | 廃止予定。guide 公開正本は `pjdhiro/assets/awareness/guides/` |
| `knowledge/topics/` | reader-facing な調査トピック report の置き場。guide の論拠層 |
| `knowledge/concepts/` | 概念ノート群（CN-001〜）を横断管理 |
| `evidence/` | 調査原本（一次材料） |
| `transform/` | 変換 workflow（再編集・再生成の入口） |

## 知識構造

- `schema/`: ナレッジの骨格。意識モデルの定義・比較表などの原本群。
- `concepts/`: 概念ノート群（CN-001〜CN-007）と運用ノートの保持場所。
- `topics/`: legacy path 名。調査トピックごとの読者向け report を置く場所。
- `*.md`（overview 群）: 全体像の入口として維持する要約文書。

## summary と論拠

- `pjdhiro/assets/awareness/guides/`: summary。全体像を渡し、report / survey への導線を示す
- `knowledge/topics/`: reader-facing report。summary の主要要点を支える公開本文
- `evidence/review/`: design memo。未検証・調査中の論点を保持する

guide に書く主要な要点は、原則として `topics/`（調査トピック report）, `survey`, `evidence/review/` のいずれかに対応先を持つ。

## 現在の収録文書

- `survival-trust-axis-overview.md`: 生存-信頼軸の入口解説
- `survival-trust-axis-starting-memo.md`: 生存-信頼軸起点メモ（source）
- `model-overview.md`: 意識モデル全体の総覧
- `four-layers-overview.md`: 4層モデル入口解説
- `topics/four-layers/part-1-introduction.md`: Part 1（4層モデルの導入）
- `topics/four-layers/part-2-interoception.md`: Part 2（Layer 0）
- `topics/four-layers/part-3-prediction-error.md`: Part 3（Layer 1）
- `topics/four-layers/part-4-survival-trust-evaluation.md`: Part 4（Layer 2）
- `topics/four-layers/part-5-withhold.md`: Part 5（Layer 3）
- `four-layers-overview.md`: 4層モデル入口解説
- `schema/four-layers.md`: 4層モデル骨格（定義）
- `schema/four-modules.md`: 4モジュール構造
- `schema/withhold-matching-v2.md`: Withhold マッチング表
- `withhold-overview.md`: Withhold の入口解説
- `concepts-overview.md`: Concept Notes の入口解説
- `concepts/index.md`: CN-001〜CN-007索引
- `concepts/CN-001_internalized-relationship.md`: CN-001
- `concepts/CN-002_f-axis-exposure.md`: CN-002
- `concepts/CN-003_boundary-casebook.md`: CN-003
- `concepts/CN-004_collective-withhold.md`: CN-004
- `concepts/CN-005_trust-hypothesis-inventory.md`: CN-005
- `concepts/CN-006_trust-analysis-axes.md`: CN-006
- `concepts/CN-007_iss42-measurement-design-principles.md`: CN-007
- `reports-overview.md`: 調査報告セクションの総覧
- `topics/survival-trust-axis/ja/report.md`: 生存-信頼軸 report
- `topics/four-layers/ja/report.md`: 4層モデル report
- `topics/withhold/ja/report.md`: Withhold report

## 移行状態

- `knowledge/concepts/` を新設し、CN-001〜CN-007 を追加
- `knowledge/schema/` に `four-layers.md`、`four-modules.md`、`withhold-matching-v2.md` を追加
- `knowledge/topics/` に 生存-信頼軸、4層モデル、Withhold の report を追加
- 4層モデルの原著文書群は `knowledge/topics/four-layers/` 配下と `four-layers-overview.md` へ統合済み
- Concept Notes は `source_ready` の入口文書として接続済み
- overview 群は source とは分離して、公開向け explainer として整備する
- guide 公開正本は `pjdhiro/assets/awareness/guides/` へ移行
