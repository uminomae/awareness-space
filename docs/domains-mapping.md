# domains 読み替えルール

`creation-space` の `domains = 30学問領域` を、`awareness-space` 用に読み替えるための正本。

## 1. 前提

`creation-space` では domain が D01-D30 の各学問領域を指す。
`awareness-space` では同じ単位をそのまま使わず、**意識モデルの構成要素**を domain として扱う。

## 2. 当面の domains 候補

| awareness-space domain | 内容 |
|---|---|
| F-O軸 | 生存と間主観性の評価軸 |
| 4層モデル | Layer 0-3 |
| Withhold | 保持機能 |
| M1 意識OS | 基盤文書群 |
| concept notes | CN 系の補助概念 |

## 3. 運用ルール

- `transform/domains/` では、この読み替えを前提に report 単位を扱う
- `knowledge/domains/` はこの domain 単位の受け皿とする
- `assets/reports/reports.json` もこの domain 単位に合わせていく

## 4. 非採用

現段階では、`awareness-space` で `domains = D01-D30` をそのまま採用しない。
30領域 evidence は素材・参照系譜として扱い、主 domain とは分ける。
