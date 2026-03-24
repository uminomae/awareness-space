# domains 読み替えルール

`creation-space` の `domains = 30学問領域` を、`awareness-space` 用に読み替えるための正本。

## 1. 前提

`creation-space` では domain が D01-D30 の各学問領域を指す。
`awareness-space` では同じ単位をそのまま使わず、**統合的な全体調査報告を組むための調査トピック束**を legacy 名として `domain` と呼んでいる。

## 2. 当面の domains 候補

| awareness-space domain | 内容 |
|---|---|
| 生存-信頼軸 | 中核仮説トピック |
| 4層モデル | 説明モデルの中核トピック |
| Withhold | 暫定ラベルを含む検討トピック |
| 4層モデルの原著文書群 | 基盤文書トピック |
| concept notes | 補助概念トピック |

## 3. 運用ルール

- `transform/domains/` では、この読み替えを前提に report 単位を扱う
- `knowledge/domains/` はこの調査トピック束の受け皿とする
- RESEARCH UI の manifest 正本は `transform/domains/publish/domains/index.json` とする

## 4. 非採用

現段階では、`awareness-space` で `domains = D01-D30` をそのまま採用しない。
30学問領域の調査は `creation-space` 側のスコープであり、`awareness-space` の管理対象には含めない。
