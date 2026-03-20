# kesson-driven-thinking 側削除計画

`awareness-space` への実移設後に、`kesson-driven-thinking` 側から何を削除するかを整理する計画書。

## 1. 前提

削除は次の条件を満たした場合のみ行う。

1. `awareness-space` 側に移設済み実体が存在する
2. その実体が git 追跡されている
3. pjdhiro が移設完了を確認している
4. `kesson-driven-thinking` 側に残る参照が grep で整理されている
5. 削除は `kesson-driven-thinking` の CLI セッションで実行する

## 2. 削除候補

### M1 consciousness OS

- `base/text/domains/four-layers/part-1-introduction.md`
- `base/text/domains/four-layers/part-2-interoception.md`
- `base/text/domains/four-layers/part-3-prediction-error.md`
- `base/text/domains/four-layers/part-4-survival-trust-evaluation.md`
- `base/text/domains/four-layers/part-5-withhold.md`

### concept notes

- `base/concepts/CN-001_internalized-relationship.md`
- `base/concepts/CN-002_f-axis-exposure.md`
- `base/concepts/CN-003_boundary-casebook.md`
- `base/concepts/CN-004_collective-withhold.md`
- `base/concepts/CN-005_trust-hypothesis-inventory.md`
- `base/concepts/CN-006_trust-analysis-axes.md`
- `base/concepts/CN-007_iss42-measurement-design-principles.md`
- `base/concepts/index.md`

### schema

- `base/schema/four-layers.md`
- `base/schema/four-modules.md`
- `base/schema/withhold-matching-v2.md`

## 3. 参照確認項目

削除前に最低限 grep する対象:

- `domains/four-layers/part-`
- `CN-001`〜`CN-007`
- `four-layers.md`
- `four-modules.md`
- `withhold-matching-v2.md`

特に注意すべき既知参照:

- `docs/pdf-output-spec.md`
- `transform/scripts/generate-draft.sh`
- `transform/scripts/build-pdf-weasyprint.py`
- `chatgpt/reviews/` 配下
- `codex/inbox/` 配下

## 4. 実行順

1. `#24` 実移設完了
2. `#25` report 差し替え完了
3. grep で `kesson-driven-thinking` 側の参照を棚卸し
4. 削除対象一覧を確定
5. `kesson-driven-thinking` の CLI セッションで削除

## 5. 注意

- D1-D4 の正本は削除対象ではない
- `creation-space` 参照のように、見た目だけ移して元を消すのは不可
- 削除計画は `awareness-space` 側の移設完了を前提とする
