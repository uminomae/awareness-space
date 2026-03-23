# reader-rules 目録

## 役割

このディレクトリは `transform/domains` の入力変換ルールを固定化する場所。

- `reader-rules-awareness-report.md`: awareness の report 生成時に使う主要ルール
- `../domain-report-template.md`: report の統一テンプレート
- `quality-test/`: 生成後の品質評価

## 使用順序

1. `../../PRINCIPLES.md` を読む
2. `PROJECT.md` を読む
3. `reader-rules-awareness-report.md` を読む
4. `../domain-report-template.md` を読む
5. 対象 evidence / intake / review を読む
6. `quality-test/quality-test-awareness-report.md` を事前に読了
7. report を生成し、quality-test で点検

## ルールの粒度

- 本 repository の `domains` は、`creation-space` の D01-D30 を対象にしない。
- 今回は「意識モデル構成要素」を 1 単位として扱う。
- 出力は長文の長さより、根拠と限界の明記順を重視する。
- summary / report / survey / design memo の責務分離を守る。
- 一人称経験と三人称参照枠の区別を守る。

## 拡張

- EN 版は JA 版と同じ主要ルールを使い、公開時は同時に整備する。
- `schema` 連動ルールが必要になった場合は同階層に追加し、入口 README を更新する。
