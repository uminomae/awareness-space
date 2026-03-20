# 調査報告の構造メモ

`awareness-space` の REPORTS を、どのファイルが何を担うかで整理した現状メモ。

## 1. 目的

`creation-space` の REPORTS と同じく、
`awareness-space` 側でも「一覧で見つける」「カードで入口を掴む」「詳細本文を読む」を
同じ導線で扱えるようにする。

同時に、REPORTS は guide を裏づける **論拠層** であり、
guide を単独説明文にしないための対応先として機能する。

## 2. 現在の3層構造

1. manifest
2. カード/UI
3. 詳細本文

### manifest

`transform/domains/publish/domains/index.json`

- REPORTS セクションの正本データ
- 各 report の ID、名前、進捗、summary、Markdown 参照先を持つ
- `creation-space` の domains manifest を、`awareness-space` の domain 単位へ読み替えたもの

### カード/UI

- `index.html`
- `src/reports/*.js`
- `src/styles/reports.css`

manifest を読み込み、
進捗メトリクス、フィルタ、domain card、modal 導線を描画する。

### 詳細本文

- `knowledge/domains/survival-trust-axis/ja/report.md`
- `knowledge/domains/four-layers/ja/report.md`

ここに置くものは、計画書ではなく読者向けの report 本文である。
主題、中心的な見立て、未決論点、関連素材を最小単位として持つ。

## 3. report と source_ready の違い

`awareness-space` の REPORTS では、すべてのカードが同じ成熟度ではない。

- `report_ready`: `knowledge/domains/*/ja/report.md` の本文があり、modal で参照できる
- `source_ready`: overview や移設済み素材には到達できるが、domain report 本文はまだない

2026-03-20 時点では次の構成で運用している。

- `report_ready`: 生存-信頼軸、4層モデル
- `source_ready`: なし（主要4本は report 入口あり）
- `internal_draft`: Withhold

## 4. 置き場の役割分担

- 調査原本: `evidence/`
- summary: `knowledge/guides/`
- report 本文: `knowledge/domains/`
- source_ready の入口文書: `knowledge/` 直下および `knowledge/concepts/`, `knowledge/domains/four-layers/`
- manifest 正本: `transform/domains/publish/domains/index.json`
- UI 導線: `index.html`, `src/reports/`
- design memo: `evidence/review/`

`transform/reports/` は将来の拡張用に保持しているが、
現在の REPORTS セクション実装は `transform/domains/` manifest を起点にしている。

## 5. 計画書として扱うもの

次の文書は report ではなく、設計・運用・取り込み方針として扱う。

- `docs/material-inventory.md`
- `evidence/review/core-source-map.md`
- `docs/report-structure.md`

## 6. 次の拡張

- report 間の相互参照を強める
- guide の主要要点と report の対応表を強める
- Concept Notes を個別 report へどう分解するか決める
- PDF 出力や bilingual report の扱いを必要に応じて追加する
