# topics 読み替えルール

`creation-space` の `domains = 30学問領域` を、`awareness-space` 用の `topics` 概念へ読み替えるための正本。

## 1. 前提

`creation-space` では domain が D01-D30 の各学問領域を指す。
`awareness-space` では同じ単位をそのまま使わず、**統合的な全体調査報告を組むための調査トピック束**を扱う。

## 2. 当面の topics 候補

| awareness-space topic | 内容 |
|---|---|
| 生存-信頼軸 | 中核仮説トピック |
| 4層モデル | 説明モデルの中核トピック |
| 4層モデルの原著文書群 | 基盤文書トピック |

## 2.1 topics に含めないもの

- `抱持` / `Containment` は、現時点では意識モデルの topics に含めない
- これは中核仮説でも検証対象でもなく、調査で独立した現象として見えた場合のみ再検討する候補語として扱う
- `concept notes` は、現時点では独立 topic ではなく source bundle として扱う

## 3. 運用ルール

- `transform/topics/` では、この読み替えを前提に report 単位を扱う
- `knowledge/topics/` はこの調査トピック束の受け皿とする
- RESEARCH UI の manifest 正本は `transform/topics/publish/topics/index.json` とする
- `抱持` / `Containment` を独立 topic や独立 report として先に固定しない
- `concept notes` は `knowledge/concepts/` を正面の置き場とし、独立 report を先に固定しない

## 4. 非採用

現段階では、`awareness-space` で `domains = D01-D30` をそのまま採用しない。
30学問領域の調査は `creation-space` 側のスコープであり、`awareness-space` の管理対象には含めない。
