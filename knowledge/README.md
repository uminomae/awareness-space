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

- `concepts/`: 概念ノート群（CN-001〜）と運用ノートの保持場所。
- `topics/`: 調査トピックごとの読者向け report を置く場所。
- `survival-trust-axis-starting-memo.md`: 起点仮説のメモ。

## summary と論拠

- `pjdhiro/assets/awareness/guides/`: summary。全体像を渡し、report / survey への導線を示す
- `knowledge/topics/`: reader-facing report。summary の主要要点を支える公開本文
- `evidence/review/`: design memo。未検証・調査中の論点を保持する

guide に書く主要な要点は、原則として `topics/`（調査トピック report）, `survey`, `evidence/review/` のいずれかに対応先を持つ。

## 現在の収録文書

- `survival-trust-axis-starting-memo.md`: 生存-信頼軸起点メモ（source）
- `concepts/index.md`: CN-001〜CN-007索引
- `concepts/CN-001_internalized-relationship.md`: CN-001
- `concepts/CN-002_f-axis-exposure.md`: CN-002
- `concepts/CN-005_trust-hypothesis-inventory.md`: CN-005
- `concepts/CN-006_trust-analysis-axes.md`: CN-006
- `concepts/CN-007_iss42-measurement-design-principles.md`: CN-007
- `topics/survival-trust-axis/ja/report.md`: 生存-信頼軸 report
- `topics/four-layers/ja/report.md`: 4層モデル report

## 移行状態

- `knowledge/concepts/` を新設し、CN-001〜CN-007 を追加
- `knowledge/topics/` に 生存-信頼軸、4層モデル の report を追加
- Concept Notes は `source_ready` の入口文書として接続済み
- `抱持` / `Withhold` の専用ファイルは削除し、必要な履歴は監査メモ側へ残す
- LLM 再生成しやすい overview / schema / draft は削除し、重要な research と current report source を優先して残す
- guide 公開正本は `pjdhiro/assets/awareness/guides/` へ移行
