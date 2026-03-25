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

- RESEARCH UI の一覧・カード・詳細導線はすでに動作している。
- 現在の report 正本と manifest は主に `transform/topics/` を起点に更新する。
- `transform/reports/` 自体は、横断レポートや将来の report workflow を整理する補助入口として扱う。

## 入口

- UI 入口: `index.html` の `#reports-section`
- 初期化: `src/reports/index.js`
- 描画: `src/reports/render.js`
- データ解決: `src/reports/data.js`
- modal / 履歴同期: `src/reports/modal.js`, `src/reports/history.js`
- 現行 manifest 正本: `transform/topics/publish/topics/index.json`
