# transform/guides/ — audience別 guide 生成ワークフロー

## 5W1H

- **What**: 意識モデルの guide 類を audience 別に生成する workflow。
- **Why**: `report` や `source` と混ぜずに、調査結果を踏まえたモデル解説を読者別に正本化するため。
- **Who**: guide 系 Markdown を生成・更新する CLI と review 担当者。
- **When**: general / designer / academic guide を生成・更新するとき。
- **Where**: ルールは `reader-rules/` に置く。公開出力先は `pjdhiro/assets/awareness/guides/`。
- **How**: audience 別 reader-rules を読み、`transform/scripts/build-pdf-guide.sh` で PDF 生成後に `pjdhiro/main` へ公開する。

共通前提: まず [../PRINCIPLES.md](../PRINCIPLES.md) を読む。

## 現在の状態

- awareness-space では guide は 3 audience 構成で扱う。
- `general`, `designer`, `academic` を `creation-space` と同じ枠組みで揃える。
- `pjdhiro/assets/awareness/` を `creation-space` と同じ公開契約の正本とする。
- JA / EN guide を公開正本として配置する。
- guide は「読者向け入口文」ではなく、**仮説・調査・現在地を含むモデル解説**として扱う。
- front matter は `generator_model` / `generated` を持ち、`guides.json` に反映する。
- metadata 契約の正本は `docs/evidence-metadata-awareness.md`。

## 入口

- [../PRINCIPLES.md](../PRINCIPLES.md)
- [guide-rebuild-plan.md](guide-rebuild-plan.md)
- [reader-rules/reader-rules-awareness-general.md](reader-rules/reader-rules-awareness-general.md)
- [reader-rules/reader-rules-awareness-designer.md](reader-rules/reader-rules-awareness-designer.md)
- [reader-rules/reader-rules-awareness-academic.md](reader-rules/reader-rules-awareness-academic.md)

## PDF build

```bash
# guides general JA
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all

# 公開時は JA+EN をまとめて反映
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all --push
```
