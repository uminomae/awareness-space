# knowledge/topics — 調査トピックレポート

## 5W1H

- **What**: 調査トピックごとの report を保持するためのディレクトリ
- **Why**: 統合的な全体調査報告を組むための中間単位を、reader-facing に再利用しやすく蓄積するため
- **Who**: 調査結果を再構成する読者、将来のレポート生成ワークフロー
- **When**: 調査トピック report の追加・拡張時
- **Where**: `awareness-space/knowledge/topics/`
- **How**: 各トピックの `ja` / `en` report を配置し、`knowledge` 全体から横断参照できる形にする

## 役割

`evidence/` 由来の資料を、調査トピック単位で再編集して読みやすい形で保持する場所。  
path 名も `topics/` に寄せ、`awareness-space` 独自の調査トピック束を順次追加していく。

## 収載方針

- `docs/topics-mapping.md` の読み替えルールに従い、調査トピック束を legacy 名 `domain` として扱う
- 各 topic には `ja/report.md` を最小単位として置き、必要に応じて `en/` や補助資料を追加する
- 計画書や運用メモはここに置かず、`docs/` または `evidence/` に残す

## 移行状態

- 2026-03-17 時点で以下の report を配置済み
- `survival-trust-axis/ja/report.md`
- `four-layers/ja/report.md`

`抱持` / `Withhold` は現時点では topics 契約に含めない。
独立 topic や独立 report としては扱わず、調査で独立した現象として見えた場合のみ再検討する。
`concept notes` も現時点では独立 topic report にせず、`knowledge/concepts/` 側の source bundle として扱う。
