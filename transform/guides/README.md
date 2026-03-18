# transform/guides/ — audience別 guide 生成ワークフロー

## 5W1H

- **What**: 意識モデルの guide 類を audience 別に生成する workflow。
- **Why**: `report` や `source` と混ぜずに、読者別の解説文を正本化するため。
- **Who**: guide 系 Markdown を生成・更新する CLI と review 担当者。
- **When**: general / designer / academic guide を生成・更新するとき。
- **Where**: ルールは `reader-rules/` に置く。公開出力先は `pjdhiro/assets/awareness/guides/`。
- **How**: audience 別 reader-rules を読み、`transform/scripts/build-pdf-guide.sh` で PDF / manifest へ進む。

## 現在の状態

- awareness-space では guide は 3 audience 構成で扱う。
- `general`, `designer`, `academic` を `creation-space` と同じ枠組みで揃える。
- `pjdhiro/assets/awareness/` を `creation-space` と同じ公開契約の正本とする。
- JA guide は配置済み。EN / PDF は順次追加する。

## 入口

- [reader-rules/reader-rules-awareness-general.md](reader-rules/reader-rules-awareness-general.md)
- [reader-rules/reader-rules-awareness-designer.md](reader-rules/reader-rules-awareness-designer.md)
- [reader-rules/reader-rules-awareness-academic.md](reader-rules/reader-rules-awareness-academic.md)

## PDF build

```bash
# guides general JA
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang ja

# guides.json 更新込み
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang ja --push
```
