# core source map

`awareness-space` が「意識のモデル」を組み立てるときの中核参照地図。
素材インベントリそのものではなく、**何を中心に読むか**を固定する正本。

## 1. この map の役割

- 神経現象学と心理学を中心に据える
- 生存-信頼軸、4層モデル原著文書群、concept notes の位置づけを分ける
- 今後の intake と domain report 実装順の前提を与える

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

起点仮説は **生存-信頼軸** とする。

- 生存軸: 生存、脅威、安全、保身
- 信頼軸: 関係、愛着、所属、信頼、間主観性

生存-信頼軸は採択済みの正解ではなく、神経現象学と心理学の知見を受けて
妥当性を検証するための**仮説座標系**として扱う。

## 3. source の層分け

### 3-1. Layer A: 中核の正本・最優先 source

| source | 役割 | 現在の扱い |
|---|---|---|
| `knowledge/survival-trust-axis-starting-memo.md` | 起点仮説の入口 | awareness-space 側の起点文書 |
| `~/dev/kesson-driven-thinking/base/schema/core-definitions.md` | D1-D4 の定義 | 正本参照 |
| `~/dev/kesson-driven-thinking/base/schema/four-layers.md` | 意識の層構造 | 正本参照寄りの主要 schema |
| 神経現象学系の今後の intake | 一人称経験と記述単位の中核 | これから intake 対象を固定 |
| 発達心理学を含む心理学系の今後の intake | 間主観性・愛着・社会的発達の中核 | これから intake 対象を固定 |

### 3-2. Layer B: モデル構築を支える主要 source

| source | 役割 | 現在の扱い |
|---|---|---|
| `knowledge/topics/four-layers/` | 生存-信頼軸と意識記述の初期構造 | 主要 source |
| `knowledge/concepts/CN-*.md` | 仮説補助、概念の枝分かれ | 主要 source |
| `knowledge/schema/four-modules.md` | 構成整理の補助 | 支持 source |

### 3-3. Layer C: 周辺の補助 source

| source | 役割 | 現在の扱い |
|---|---|---|
| `evidence/review/survey-5w1h-source-map.md` | survey 用の整理メモ | 補助メモ |
| `docs/material-inventory.md` | 素材所在の一覧 | インベントリ |

## 4. 主要要素の位置づけ

### 4-1. 生存-信頼軸

- **役割**: repo の起点仮説
- **位置づけ**: 中核
- **使い方**: 神経現象学と心理学の知見を束ねる仮説座標系

### 4-2. 4層モデル

- **役割**: 意識記述の構造枠
- **位置づけ**: 中核
- **使い方**: 生存-信頼軸の記述対象をどの層で扱うか整理する構造

### 4-3. 神経現象学

- **役割**: 一人称経験と記述単位の中心参照
- **位置づけ**: 中核
- **使い方**: 意識経験をどう記述するかの理論的中心

### 4-4. 発達心理学

- **役割**: 間主観性、愛着、発達的形成の中心参照
- **位置づけ**: 中核心理学の最優先候補
- **使い方**: 信頼軸と社会的意識形成の検証 source

### 4-5. 4層モデルの原著文書群

- **役割**: awareness-space の初期文章資産
- **位置づけ**: 主要 source
- **使い方**: 生存-信頼軸、予測誤差、内受容感覚をつなぐ基盤文書

### 4-6. concept notes

- **役割**: 仮説の枝分かれと補助論点
- **位置づけ**: 主要 source
- **使い方**: 主要 report の補助線、論点分解、将来の exploration

## 5. 今後の intake / report 優先順

### 優先度 A

1. 生存-信頼軸
2. 4層モデル
3. 神経現象学 source map / intake
4. 発達心理学 source map / intake

### 優先度 B

1. 4層モデルの原著文書群
2. concept notes
3. four-modules

### 優先度 C

1. creation-space-refs 再構築後の取り込み

## 6. `#44` 配下の次の実装候補

この source map を前提に、次は以下へ分解する。

1. 神経現象学 intake map を作る
2. 発達心理学 intake map を作る
3. 生存-信頼軸 / 4層モデルの report 正本を整理する

## 7. 正本関係

- この文書は `#45` の正本
- 素材一覧の正本は `docs/material-inventory.md`
