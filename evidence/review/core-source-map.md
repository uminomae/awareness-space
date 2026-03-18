# core source map

`awareness-space` が「意識のモデル」を組み立てるときの中核参照地図。
素材インベントリそのものではなく、**何を中心に読み、何を比較素材として使うか**を固定する正本。

## 1. この map の役割

- 神経現象学と心理学を中心に据える
- F-O軸、4層モデル、M1、concept notes、D01-D30 比較素材の位置づけを分ける
- `#46` の D01-D30 取り込みポリシーと、今後の domain report 実装順の前提を与える

## 2. 中心軸

### 2-1. 中核参照領域

`awareness-space` の中心軸は次の 2 系統とする。

1. **神経現象学**
2. **心理学**

ここでいう心理学には、特に以下を含む。

- 発達心理学
- 認知・知覚に関わる心理学的知見
- 間主観性、愛着、信頼、社会的認知に関わる心理学的知見

この repo は、欠損駆動思考そのものを主題化するのではなく、
神経現象学と心理学を足場にして「意識をどの単位で記述できるか」を整理する。

### 2-2. 起点仮説

起点仮説は **F-O軸** とする。

- F軸: 生存、脅威、安全、保身
- O軸: 関係、愛着、所属、信頼、間主観性

F-O軸は採択済みの正解ではなく、神経現象学と心理学の知見を受けて
妥当性を検証するための**仮説座標系**として扱う。

## 3. source の層分け

### 3-1. Layer A: 中核の正本・最優先 source

| source | 役割 | 現在の扱い |
|---|---|---|
| `knowledge/fo-axis-starting-memo.md` | 起点仮説の入口 | awareness-space 側の起点文書 |
| `~/dev/kesson-driven-thinking/base/schema/core-definitions.md` | D1-D4 の定義 | 正本参照 |
| `~/dev/kesson-driven-thinking/base/schema/four-layers.md` | 意識の層構造 | 正本参照寄りの主要 schema |
| 神経現象学系の今後の intake | 一人称経験と記述単位の中核 | これから intake 対象を固定 |
| 発達心理学を含む心理学系の今後の intake | 間主観性・愛着・社会的発達の中核 | これから intake 対象を固定 |

### 3-2. Layer B: モデル構築を支える主要 source

| source | 役割 | 現在の扱い |
|---|---|---|
| `knowledge/m1-consciousness-os/` | F-O軸と意識記述の初期構造 | 主要 source |
| `knowledge/concepts/CN-*.md` | 仮説補助、概念の枝分かれ | 主要 source |
| `knowledge/schema/four-modules.md` | 構成整理の補助 | 支持 source |
| `knowledge/schema/withhold-matching-v2.md` | 周辺仮説の参照 | 周辺 source |

### 3-3. Layer C: 比較・照明用の source

| source | 役割 | 現在の扱い |
|---|---|---|
| `creation-space/evidence/` 由来の D01-D30 | 意識モデルを外部から照らす比較素材 | 本体調査ではない |
| `kesson-driven-thinking/chatgpt/output/` | review / reconcile / DR 系譜 | 補助参照 |
| `evidence/review/survey-5w1h-source-map.md` | survey 用の整理メモ | 補助メモ |
| `docs/material-inventory.md` | 素材所在の一覧 | インベントリ |

## 4. 主要要素の位置づけ

### 4-1. F-O軸

- **役割**: repo の起点仮説
- **位置づけ**: 中核
- **使い方**: 神経現象学と心理学の知見を束ねる仮説座標系

### 4-2. 4層モデル

- **役割**: 意識記述の構造枠
- **位置づけ**: 中核
- **使い方**: F-O軸の記述対象をどの層で扱うか整理する構造

### 4-3. 神経現象学

- **役割**: 一人称経験と記述単位の中心参照
- **位置づけ**: 中核
- **使い方**: 意識経験をどう記述するかの理論的中心

### 4-4. 発達心理学

- **役割**: 間主観性、愛着、発達的形成の中心参照
- **位置づけ**: 中核心理学の最優先候補
- **使い方**: O軸と社会的意識形成の検証 source

### 4-5. M1 意識OS

- **役割**: awareness-space の初期文章資産
- **位置づけ**: 主要 source
- **使い方**: F-O軸、予測誤差、内受容感覚をつなぐ基盤文書

### 4-6. concept notes

- **役割**: 仮説の枝分かれと補助論点
- **位置づけ**: 主要 source
- **使い方**: 主要 report の補助線、論点分解、将来の exploration

### 4-7. Withhold

- **役割**: 周辺仮説
- **位置づけ**: 中核ではない
- **使い方**: 必要な場面で限定的に参照する

### 4-8. D01-D30 比較素材

- **役割**: 意識モデルを外部から照らす比較材料
- **位置づけ**: 比較 source
- **使い方**: 中心理論の代替ではなく、外部照明として扱う

## 5. 今後の intake / report 優先順

### 優先度 A

1. F-O軸
2. 4層モデル
3. 神経現象学 source map / intake
4. 発達心理学 source map / intake

### 優先度 B

1. M1 意識OS
2. concept notes
3. four-modules

### 優先度 C

1. Withhold
2. D01-D30 比較素材
3. creation-space-refs 再構築後の取り込み

## 6. `#44` 配下の次の実装候補

この source map を前提に、次は以下へ分解する。

1. 神経現象学 intake map を作る
2. 発達心理学 intake map を作る
3. F-O軸 / 4層モデルの report 正本を整理する
4. `#46` で D01-D30 比較素材の取り込み境界を固定する

## 7. 正本関係

- この文書は `#45` の正本
- 素材一覧の正本は `docs/material-inventory.md`
- D01-D30 の取り込み境界は `evidence/d01-d30-intake-plan.md`
