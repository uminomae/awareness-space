# knowledge/schema — 意識モデルのスキーマ定義

## 5W1H

- **What**: 意識モデルの定義・分類の土台を置くディレクトリ
- **Why**: 解説や将来の自動生成で、定義の揺れを防ぐため
- **Who**: `knowledge/` を読む読者、`transform/` の将来変換、`knowledge` 再編を進める運用担当
- **When**: 5W1H などのスキーマ更新、または新領域のモデル定義追加時
- **Where**: `awareness-space/knowledge/schema/`
- **How**: `five-stages.md`、`academic-domains.md` などの正本化想定ファイルをまとめて管理する

## 役割

意識モデルの共通定義を集約し、`knowledge` 参照全体の基礎ルールとして機能させる。  
現時点では参照先を明示しながら整備を開始する段階。

## 設計方針

- 既存の `knowledge/` 直下ドキュメントを否定せず、まずは参照先と移行方針を明確化
- `evidence/` から得た新しい発見は、必要に応じて schema ファイルへ反映
- `README` とファイル名で「どこが正本か」を判別しやすくする

## 移行状態

- 2026-03-17 時点では `README` のみの初期設置
- 次に `five-stages.md` の移設または新規整備を検討
