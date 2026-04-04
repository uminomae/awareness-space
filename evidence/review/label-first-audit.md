# label-first audit

`awareness-space` の現行文書群に対して、
「現象の抽出より先にラベルが立ち、そのラベルに合わせて調査と公開が組まれていないか」を監査したメモ。

この文書は `awareness-space#71` の作業メモであり、
次の設計 issue で使うための暫定正本とする。

## 1. 監査の観点

次のいずれかに当てはまる場合、label-first リスクありと判定する。

1. 現象の境界より先に概念名が固定されている
2. 独立 report があることで、未確定概念が確立概念のように見える
3. 調査設計や manifest が、既存ラベルを前提に実装されている
4. 読者向け文書が、探索中の概念を「現在の論拠」として強く見せている

## 2. 総合判断

現状の `awareness-space` は、
「探索中の現象を丁寧に抽出してから命名する」構造ではなく、
「既存ラベルを domain に見立てて source / report / guide / manifest へ再配置する」構造が強い。

特に `Containment` は、
repo 内方針では周辺仮説とされている一方で、
公開 report、guide、manifest、survey 上では独立構成要素として reader-facing に固定されている。
そのため、概念の未確定さより「既に確立した主題である」という印象が先行する。

## 3. 主要 findings

### F1. `Containment` が独立 report を持つことで、概念の未確定さより概念の自立性が先に見える

対象:

- 旧 `knowledge/topics/withhold/ja/report.md`（削除済み）
- `transform/topics/publish/topics/index.json`
- `knowledge/guides/awareness-general.md`

問題:

- report が存在するため、読者からは `Containment` が既に独立概念として成立しているように見える
- report 本文でも境界や反例より先に「最小定義」が置かれている
- manifest でも `Containment` が他の構成要素と同格の `report_ready` 項目として固定されている

暫定判定:

- `Containment` は「独立 report を維持してよい概念」ではなく、
  「概念監査待ちの仮ラベル」として降格候補

### F2. survey が現象探索ではなく既存構成要素の整理として読めてしまう

対象:

- `evidence/survey-status.md`

問題:

- 「何を調査しているか」が `4層モデル / 生存-信頼軸 / 4層モデルの原著文書群 / Concept Notes` のように既存ラベル中心で並んでいる
- 「現在公開済みの論拠」に `Containment report` を含めるため、読者は `Containment` を主要な公開済み概念として読む
- 今後の調査計画も「既存仮説と調査を reader-facing に対応づける」が主になっており、
  再抽出・再命名の工程が見えない

暫定判定:

- survey は「既存ラベルの整理」から「現象先行の再調査」へ書き換えが必要

### F3. guide が summary でありながら、探索中ラベルを読者に安定概念として渡している

対象:

- `knowledge/guides/awareness-general.md`

問題:

- `Containment report` を他の report と横並びで reader-facing な論拠として提示している
- 「生存-信頼軸、4層モデル、M1、Concept Notes、Containment にはすでに公開済み report がある」という記述が、
  調査成熟度の差を隠している
- 「モデルの中心仮説」の説明に、既存の 4層構造と Layer 3 の含意が入り込みやすく、
  現象より構造図が先に立つ

暫定判定:

- guide は一度弱める必要がある
- 特に `Containment` は独立論拠ではなく「要再調査の仮説ラベル」として表現を落とす必要がある

### F4. reader-rules / manifest が「調査対象」より先に「構成要素名」を固定している

対象:

- `transform/topics/reader-rules/reader-rules-awareness-report.md`
- `transform/topics/publish/topics/index.json`

問題:

- rule が最初から `生存-信頼軸 / 4層モデル / Containment / concept notes` を対象コンテンツとして固定している
- manifest も同じラベル単位で card / modal / report を構成している
- これにより調査が「その概念があるかどうかを確かめる」のでなく、
  「既にある概念を説明する」方向へ流れやすい

暫定判定:

- rule と manifest は再調査後に再設計が必要
- 少なくとも `Containment` の独立 card / independent domain 扱いは凍結対象

### F5. baseline 文書自体が「どれを中核 report とするか」を問い、概念単位を前提にしている

対象:

- `evidence/review/research-design-baseline.md`

問題:

- 「既存調査は何だったか」の節が `起点仮説 / 構造モデル / 保持機能` と既存ラベル中心で分類されている
- 「次の実装候補」でも `生存-信頼軸 / 4層モデル / Containment のうち、どれを中核 report とするか` を問うている
- これは「どんな現象が本当に抽出されているのか」ではなく、
  「どのラベルを主役にするか」に論点が寄る

暫定判定:

- baseline は再設計 issue の主要入力だが、そのまま正本にはできない

## 4. 文書別の暫定措置

### A. 即時に弱めるべきもの

- 旧 `knowledge/topics/withhold/ja/report.md`（削除済み）
- `knowledge/guides/awareness-general.md`
- `evidence/survey-status.md`
- `transform/topics/publish/topics/index.json`

措置:

- 独立論拠としての見せ方を弱める
- `Containment` を中心構成要素ではなく仮ラベルとして表現する
- 調査中 / 概念監査待ちの表示を優先する

### B. 仮説として維持できるが、確立概念としては扱わないもの

- `knowledge/topics/survival-trust-axis/ja/report.md`
- `knowledge/topics/four-layers/ja/report.md`
- `knowledge/topics/four-layers/ja/report.md`

措置:

- 研究上の作業仮説・構造仮説として保持
- evidence の再読後に再判定する

### C. source 束として維持し、公開概念単位から切り離すもの

- 旧 `knowledge/topics/four-layers/part-1-introduction.md`（削除済み）
- 旧 `knowledge/topics/four-layers/part-2-interoception.md`（削除済み）
- 旧 `knowledge/topics/four-layers/part-3-prediction-error.md`（削除済み）
- 旧 `knowledge/topics/four-layers/part-4-survival-trust-evaluation.md`（削除済み）
- 旧 `knowledge/topics/four-layers/part-5-withhold.md`（削除済み）
- `knowledge/concepts/CN-*.md`

措置:

- 抽出元 source として扱う
- 現象抽出台帳へ分解してから再配置する

## 5. 次 issue への要求

`#72` では少なくとも次を固定する必要がある。

1. どの単位で現象を抽出するか
2. 抽出結果をどの条件で概念化するか
3. 独立 report を与えてよい条件は何か
4. `Containment` を含む既存ラベルを、調査途中ではどう凍結するか
5. survey / guide / manifest を、調査再起動期にどう見せるか

## 6. 暫定結論

最も大きい問題は、`Containment` が「間違っている」ことそのものではない。
問題は、`Containment` が **まだ境界未確定の探索ラベルであるにもかかわらず、
独立構成要素として公開体系に埋め込まれていること** である。

したがって次段階では、
新しい名前を考えるより先に、
既存ラベルを仮トークンへ戻し、
現象・条件・反例・近縁概念の抽出を先に行う必要がある。
