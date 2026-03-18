# transform/survey/ — survey 生成ワークフロー

## 5W1H

- **What**: awareness の「調査内容」文書を生成する workflow。
- **Why**: guide / report とは別に、何をどう調査しているかを読者に渡すため。
- **Who**: survey 系の概要・索引を生成する CLI と review 担当者。
- **When**: `survey-status.md` / `survey-domain-index.md` を生成・更新するとき。
- **Where**: ルールは `reader-rules/`、公開先は `pjdhiro/assets/awareness/survey/`。
- **How**: survey ルールを読み、JA 本文を先に整え、PDF build script で md/pdf を公開配置へ流す。

## 現在の状態

- ルール正本: `reader-rules/reader-rules-awareness-survey.md`
- source archaeology: `evidence/review/survey-5w1h-source-map.md`
- 公開配置は `pjdhiro/assets/awareness/survey/`

## 入口

- [reader-rules/reader-rules-awareness-survey.md](reader-rules/reader-rules-awareness-survey.md)
- [../../evidence/review/survey-5w1h-source-map.md](../../evidence/review/survey-5w1h-source-map.md)
- [../guides/README.md](../guides/README.md)
- [../domains/README.md](../domains/README.md)
