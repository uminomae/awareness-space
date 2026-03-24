# transform/reports

`awareness-space` の調査報告を公開向けに整形する workflow の入口。

## 役割

- 調査原本を report 向けに整形する
- 一覧、カード、詳細表示に接続する出力単位を決める
- 将来的な Markdown / PDF / bilingual 出力の受け皿になる

## 想定する出力

- 意識モデルの調査報告
- 調査トピック report を横断して返す比較・整理レポート
- 横断的な比較・整理レポート

## 現在の状態

まだ report 出力自体は未整備。
まずはトップページの調査報告セクションと接続する入口として使う。

## 入口

- UI 入口: `index.html` の `#reports-section`
- 初期化: `src/reports/index.js`
- 描画: `src/reports/render.js`
- データ解決: `src/reports/data.js`
- modal / 履歴同期: `src/reports/modal.js`, `src/reports/history.js`
