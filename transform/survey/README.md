# transform/survey/ — survey 生成ワークフロー

## 5W1H

- **What**: awareness の「調査内容」文書を生成する workflow。
- **Why**: guide / report とは別に、何をどう調査しているかを読者に渡すため。
- **Who**: survey 系の概要・索引を生成する CLI と review 担当者。
- **When**: `survey-status.md` / `survey-topic-index.md`（調査トピック索引）を生成・更新するとき。
- **Where**: ルールは `reader-rules/`、公開先は `pjdhiro/assets/awareness/survey/`。
- **How**: survey ルールを読み、JA/EN 本文を揃え、PDF build script で md/pdf を公開配置へ流し、`pjdhiro/main` へ公開する。

共通前提: まず [../PRINCIPLES.md](../PRINCIPLES.md) を読む。

## 現在の状態

- ルール正本: `reader-rules/reader-rules-awareness-survey.md`
- source archaeology: `evidence/review/survey-5w1h-source-map.md`
- publish / topics への導線は `transform/topics/README.md` を参照する
- 公開配置は `pjdhiro/assets/awareness/survey/`
- front matter は `generator_model` / `generated` を持ち、`survey.json` に反映する
- metadata 契約の正本は `docs/evidence-metadata-awareness.md`

## 入口

- [../PRINCIPLES.md](../PRINCIPLES.md)
- [reader-rules/reader-rules-awareness-survey.md](reader-rules/reader-rules-awareness-survey.md)
- [../../evidence/review/survey-5w1h-source-map.md](../../evidence/review/survey-5w1h-source-map.md)
- [../guides/README.md](../guides/README.md)
- [../topics/README.md](../topics/README.md)

## 公開時の原則

- survey の公開は JA/EN を同時に更新する。
- PDF 公開時は `--lang all` を使う。
- `transform/scripts/build-pdf-guide.sh` 実行時に `survey.json` も更新する。
