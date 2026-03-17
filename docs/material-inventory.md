# 初期素材インベントリ

`awareness-space` が `kesson-driven-thinking` から参照・活用する初期素材の一覧。

## 基本方針

- これは「単純移設」の一覧ではなく、`awareness-space` の探索に使う**素材インベントリ**
- **正本**と**素材候補**を分けて扱う
- 正本が `kesson-driven-thinking` に残るものは、原則として `awareness-space` へ複製せず参照する
- 初期コピーが必要なものは、コピー元候補を明記して次 Phase で扱う

## 1. 正本として参照するもの

### 1-1. コア定義

| 種別 | パス | 扱い |
|---|---|---|
| D1-D4 | `~/dev/kesson-driven-thinking/base/schema/core-definitions.md` | **正本参照**。`awareness-space` に正本コピーは持たない |

### 1-2. 主要スキーマ

| ファイル | パス | 初期扱い |
|---|---|---|
| 5段階モデル | `~/dev/kesson-driven-thinking/base/schema/five-stages.md` | 素材候補。参照優先 |
| 4層モデル | `~/dev/kesson-driven-thinking/base/schema/four-layers.md` | 素材候補 |
| 4モジュール | `~/dev/kesson-driven-thinking/base/schema/four-modules.md` | 素材候補 |
| Withhold マッチング | `~/dev/kesson-driven-thinking/base/schema/withhold-matching-v2.md` | 素材候補 |
| 用語集 | `~/dev/kesson-driven-thinking/base/schema/glossary.md` | 素材候補 |
| academic domains | `~/dev/kesson-driven-thinking/base/schema/academic-domains.md` | D01-D30 整理用の参照素材 |
| evidence metadata | `~/dev/kesson-driven-thinking/base/schema/evidence-metadata.md` | evidence 取り込み時の参照素材 |
| container mapping | `~/dev/kesson-driven-thinking/base/schema/container-mapping.md` | 周辺素材 |

## 2. 初期探索の主要素材

### 2-1. M1 意識OS

| ファイル | パス |
|---|---|
| part-1 introduction | `~/dev/kesson-driven-thinking/base/text/m1-consciousness-os/part-1-introduction.md` |
| part-2 interoception | `~/dev/kesson-driven-thinking/base/text/m1-consciousness-os/part-2-interoception.md` |
| part-3 prediction error | `~/dev/kesson-driven-thinking/base/text/m1-consciousness-os/part-3-prediction-error.md` |
| part-4 fo evaluation | `~/dev/kesson-driven-thinking/base/text/m1-consciousness-os/part-4-fo-evaluation.md` |
| part-5 withhold | `~/dev/kesson-driven-thinking/base/text/m1-consciousness-os/part-5-withhold.md` |

### 2-2. concept notes

| ファイル | パス |
|---|---|
| CN-001 internalized relationship | `~/dev/kesson-driven-thinking/base/concepts/CN-001_internalized-relationship.md` |
| CN-002 f-axis exposure | `~/dev/kesson-driven-thinking/base/concepts/CN-002_f-axis-exposure.md` |
| CN-003 boundary casebook | `~/dev/kesson-driven-thinking/base/concepts/CN-003_boundary-casebook.md` |
| CN-004 collective withhold | `~/dev/kesson-driven-thinking/base/concepts/CN-004_collective-withhold.md` |
| CN-005 trust hypothesis inventory | `~/dev/kesson-driven-thinking/base/concepts/CN-005_trust-hypothesis-inventory.md` |
| CN-006 trust analysis axes | `~/dev/kesson-driven-thinking/base/concepts/CN-006_trust-analysis-axes.md` |
| CN-007 iss42 measurement design principles | `~/dev/kesson-driven-thinking/base/concepts/CN-007_iss42-measurement-design-principles.md` |
| concept index | `~/dev/kesson-driven-thinking/base/concepts/index.md` |

### 2-3. creation-space-refs

| ファイル | パス | 備考 |
|---|---|---|
| README | `~/dev/kesson-driven-thinking/base/evidence/creation-space-refs/README.md` | 現状説明 |
| concept-index | `~/dev/kesson-driven-thinking/base/evidence/creation-space-refs/concept-index.md` | 参照索引 |
| memo-level2-similarities | `~/dev/kesson-driven-thinking/base/evidence/creation-space-refs/memo-level2-similarities.md` | 抽出メモ |
| plan-level2-similarities | `~/dev/kesson-driven-thinking/base/evidence/creation-space-refs/plan-level2-similarities.md` | 構造案 |

補足:
- この束は `kesson-driven-thinking#278` で再構築予定
- `awareness-space` では、再構築後の取り込みを前提に扱う

### 2-4. M2 関連 skills

| ファイル | パス | 備考 |
|---|---|---|
| m2-exploration | `~/dev/kesson-driven-thinking/skills/m2-exploration/SKILL.md` | 探索手順素材 |
| m2-evidence | `~/dev/kesson-driven-thinking/skills/m2-evidence/SKILL.md` | evidence 作業素材 |
| m2-evidence design | `~/dev/kesson-driven-thinking/skills/m2-evidence/DESIGN.md` | 補助設計文書 |

## 3. D01-D30 evidence 系譜

### 3-1. 現状認識

- `kesson-driven-thinking/base/evidence/README.md` によると、構造類似調査データ本体は **creation-space に移動済み**
- ただし `kesson-driven-thinking` 側には、Issue #62 に連なる review / reconcile / DR 出力が `chatgpt/output/` に残っている
- Issue #280 の決定では、**D01-D30 evidence は awareness-space に初期コピーする**

### 3-2. コピー元候補

### 候補A: creation-space の `evidence/`

| パス | 扱い |
|---|---|
| `~/dev/creation-space/evidence/` | evidence 本体の移動先。**一次候補** |

### 候補B: kesson-driven-thinking の `chatgpt/output/`

`kesson-driven-thinking` に残る周辺成果物。初期コピー時の参照・補助候補として扱う。

主な確認済みファイル群:
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/DR-D12-agriculture-ecology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/DR-D13-philosophy.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D06-astronomy.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D07-engineering.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D08-neuroscience.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D09-life-sciences.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D10-clinical-medicine.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0228/REVIEW-D11-pharmacy.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D15-aesthetics.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D16-history.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D17-linguistics.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D18-sociology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D19-literary-studies.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0302/RECONCILE-D20-law-politics.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D12-agriculture.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D13-philosophy.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D14-psychology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D21-economics.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D22-business-management.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D23-developmental-psychology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D24-religion.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D25-anthropology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D26-musicology.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D27-architecture.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D28-performing-arts.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D29-complexity-science.md`
- `~/dev/kesson-driven-thinking/chatgpt/output/0304/RECONCILE-D30-traditional-knowledge.md`

### 3-3. 現時点の判断

- D01-D30 の**本体コピー元は `creation-space/evidence/` を第一候補**とする
- `kesson-driven-thinking/chatgpt/output/` は、review / reconcile / DR 系譜の補助参照として扱う
- 実コピー時には、`awareness-space` で「何を evidence 本体とみなすか」を別 Issue で固定する

## 4. 次の作業候補

1. `awareness-space#2` で F-O軸の起点メモを作る
2. `awareness-space` 側で D01-D30 コピー元ポリシーを確定する
3. `kesson-driven-thinking#278` の再構築後に `creation-space-refs` の取り込み方を見直す
