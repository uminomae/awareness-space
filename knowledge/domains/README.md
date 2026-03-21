# knowledge/domains — 領域別レポート

## 5W1H

- **What**: 学術領域・観点別に解説を分割するためのディレクトリ
- **Why**: 意識研究を俯瞰しつつ、領域ごとに再利用しやすく蓄積するため
- **Who**: 調査結果を再構成する読者、将来のレポート生成ワークフロー
- **When**: 領域別レポートの追加・拡張時
- **Where**: `awareness-space/knowledge/domains/`
- **How**: 各領域の `ja` / `en` など言語別レポートを配置し、`knowledge` 全体から横断参照できる形にする

## 役割

`evidence/` 由来の領域別資料を、再編集して読みやすい形で保持する場所。  
この時点では `awareness-space` 独自の domain 単位で report を順次追加していく。

## 収載方針

- `docs/domains-mapping.md` の読み替えルールに従い、意識モデルの構成要素を domain として扱う
- 各 domain には `ja/report.md` を最小単位として置き、必要に応じて `en/` や補助資料を追加する
- 計画書や運用メモはここに置かず、`docs/` または `evidence/` に残す

## 移行状態

- 2026-03-17 時点で以下の report を配置済み
- `survival-trust-axis/ja/report.md`
- `four-layers/ja/report.md`
- `withhold/ja/report.md`
- 将来、concept notes 系の report を必要に応じて追加する
