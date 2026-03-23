# 変換ルール: 意識モデル構成要素レポート v0.4

**対象コンテンツ**: `生存-信頼軸`, `4層モデル`, `concept notes` 等  
**対象読者**: 意識モデルの調査報告を読みたい読者  
**目的**: 調査素材を読者が追える report に再構成する  
**性格**: 調査報告書（読解導線重視）
**継承元**: `PROJECT.md` の強い原則、`docs/summary-report-pairing.md`、`evidence/review/first-person-vs-third-person.md`

## 生成前準備

以下を必ず読む。

1. `PROJECT.md`
2. 本ファイル（ルール）
3. `docs/summary-report-pairing.md`
4. `evidence/review/first-person-vs-third-person.md`
5. `transform/domains/domain-report-template.md`
6. `transform/domains/quality-test/quality-test-awareness-report.md`
7. 該当 evidence / intake / review

## 重要: `domains` の意味を固定する

`creation-space` の `domains`（D01-D30）と混同しないこと。
`awareness-space` の `domains` は「意識モデル構成要素（概念単位）」を扱う。

対象優先順（暫定）:
- `生存-信頼軸`
- `4層モデル`
- `CN-001`〜`CN-007`（順次）

## 1. 文書の性格

報告書は説明資料ではなく**調査報告**である。  
主語は「このレポート」で統一し、著者の内面語りを避ける。

`awareness-space` では、
report は summary の代用ではなく論拠層である。
guide に先行して理論を確定させず、
survey や design memo が担当すべき不確定要素を勝手に確定しない。
公開物としては**外部読者向けの本文**であり、
repo 内運用、生成工程、内部整理の都合を本文へ露出しない。

## 2. 5W1H の明示

- この報告は何を扱うか（対象構成要素）
- 何を根拠にしたか（evidence）
- 何を明らかにしたか（読み取り）
- 何が確定/未確定か（結論）
- どの intake / review から、何を report に返したか

## 3. source / attribution（原則）

- front matter の `title`, `generator_model`, `lang`, `version`, `generated` は必須。
- 根拠のある断定には evidence 由来の根拠節を付与。
- 一人称（私/思う/気づいた）は原則避ける。
- 発達心理学、神経現象学、測定設計は source として参照できるが、report 本文の主語を奪ってはいけない。
- intake map が「report に返せる」とした論点だけを report に入れる。
- intake map が「survey に返す」「guide に返す」「まだ返さない」とした論点は、そのままの温度で扱う。

## 4. 公開契約

- `domains` report の公開正本は `pjdhiro/assets/awareness/domains/{lang}/md/` に置く Markdown である。
- 現時点の `domains` は **Markdown + manifest 更新** が公開契約であり、PDF はまだ正式契約に入っていない。
- 将来 PDF を追加する場合も、公開用 MD を単一の正本として使い、別原稿を起こさない。
- JA / EN は公開時に同時整備を原則とする。
- front matter には公開契約上必要な `title`, `lang`, `version`, `generated`, `generator_model`, `date` を入れる。
- 公開版 front matter に `source`, `rules`, ローカルパス、内部メモを出さない。

## 5. 一人称 / 三人称の書き分け

- 一人称経験を扱う report では、それを本論に置く。
- 脳部位、測定設計、計算論、実験語彙は「参照枠」「説明語彙」「相関物」として明示する。
- 三人称語彙で一人称経験を還元しない。
- 脳部位 = 機能 の断定を避ける。

## 6. 外部向けトーン

- 調査を知らない外部読者がそのまま読める一般的なトーンで書く。
- 丁寧で明快だが、自己啓発調・仲間内のメモ調・作業ログ調にしない。
- `reader-facing`, `report-backed`, `design memo`, `intake`, `return`, `phase`, `issue` など制作工程の語を本文の主役にしない。
- 専門語は必要最小限にし、初出で役割がわかるように書く。

## 7. リンク / 記法

- 本文に repo 内の相対パスや公開で到達できないリンクを出さない。
- 生HTMLの `<a href="...">` は公開 Markdown に書かない。
- リンクが必要なら Markdown 記法を使い、公開到達可能な URL だけを対象にする。
- 内部ファイルパス、ローカル絶対パス、存在しない PDF への先行リンクを置かない。

## 8. 構成

### §1 調査の目的と問い

冒頭で「このレポートが答える問い」を1文で明示。  
例: 「生存-信頼軸は、意識モデルの中核仮説としてどこまで妥当か」。

### §2 調査方法

- evidence の参照範囲
- intake / review の返却元
- 判定基準（対応強度、条件付き対応、未確認）
- 限界条件（参照しない点）  
- `domain-report-template.md` の構造に沿う

### §3 構成要素の整理

- 対象要素の定義
- サブ要素（必要なら）
- 神経現象学・発達心理を含む心理学知見との関係

### §4 知見の提示（事実→読み取り→示唆）

- 事実: evidence を要約  
- 読み取り: 構造的な意味づけ  
- 示唆: 次に検討すべき論点  
- source が未確定なら、未確定のまま返す

### §5 限界と反証可能性

- 反例・条件付き解釈の明示  
- 「まだわからない」領域とその理由  
- report に返さない論点の明示

### §6 結論

- 何を確認できたか
- 何が未解決か
- 再調査の接続点

## 9. 禁止事項

- `domains` 名を D01-D30 として扱うこと
- 対象外の理論を根拠外で混ぜること
- 一文で複数問いを解決しようとすること
- エビデンスのない断定（根拠未記載）
- `欠損駆動思考`, `Kesson`, `D1-D4`, `kesson-driven-thinking` を主題にすること
- design memo 段階の論点を report の確定知として書くこと
- summary にしか置けない説明を report 単体で代行すること
- `<a href>` などの生HTMLリンクを埋め込むこと
- 内部運用語を読者向け本文の前面に出すこと

## 10. トーン

- 読者に対して丁寧で明快な文体
- 「です・ます調」を推奨
- 解決しない問いは、暫定結論として明示
- 生存-信頼軸は採択済みではなく検証仮説として扱う
- `抱持` は独立概念として前提にせず、必要なら現象群の暫定ラベルとして限定的に参照する
- 過去素材を現在の正本・命名源・理論権威として扱わない

## 11. 出力の検査ポイント（生成時）

- front matter が存在すること
- `§1`～`§6` のどれかが欠落していないこと
- evidence参照節が本文に1回以上あること
- `range`/`depth`/`insight` の3軸視点のどれかが過不足なくあること
- 神経現象学 / 心理学領域との接続が見えること
- `summary-report-pairing.md` に反しないこと
- 一人称 / 三人称の区別が崩れていないこと
- intake の返却範囲を越えていないこと
- repo 相対パスや `<a href>` が本文に露出していないこと
- 公開契約が Markdown 正本である前提を崩していないこと

## 12. 再利用前提

公開時の bilingual 生成や manifest 更新は本 file を下敷きに行う。  
現時点では JA/EN の本文を揃えたうえで手作業整形（構造のみ）で進める。
統一構造が必要な場合は `transform/domains/domain-report-template.md` を併用する。
