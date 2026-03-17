# knowledge — 意識モデル知識ベース

## 5W1H

- **What**: `awareness-space` の解説用ナレッジを整理するディレクトリ
- **Why**: `evidence/` から抽出・要約された知識を、公開時に再利用しやすい形で置くため
- **Who**: 読者、`transform/` パイプライン、将来のレポート再生成で参照する
- **When**: `モデル解説` の更新、公開用文書の追加・改訂時
- **Where**: `awareness-space/knowledge/`
- **How**: `schema/` と `domains/` を分離し、役割ごとに参照先を固定して運用する

## 役割分離

| ディレクトリ | 役割 |
|---|---|
| `knowledge/` | 説明・解説向けの受け皿（運用中） |
| `evidence/` | 調査原本（一次材料） |
| `transform/` | 変換 workflow（再編集・再生成の入口） |

## 知識構造

- `schema/`: ナレッジの骨格。意識モデルの定義や将来の領域分類を置く予定の領域。
- `domains/`: 領域別解説やレポートを置く予定の場所。
- `*.md`（既存 overview 群）: 現時点では移行前の要約文書。まずは全体像の入口として維持する。

## 現在の収録文書

- `fo-axis-starting-memo.md`: F-O軸起点メモ
- `model-overview.md`: 意識モデル全体の総覧
- `four-layers-overview.md`: 4層モデル入口解説
- `withhold-overview.md`: Withhold の入口解説
- `m1-consciousness-os-overview.md`: M1 意識OS の入口解説
- `reports-overview.md`: 調査報告セクションの総覧

## 移行状態

- `knowledge/schema/` は設計済みだが未整備（`schema/*.md` はこの時点では未追加）
- `knowledge/domains/` は設計済みだが未整備（領域別レポートの再配置は今後）
- 概要文書は当面 `knowledge/` 直下で運用し、将来 `schema` / `domains` 配下へ段階移行する
