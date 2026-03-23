# transform 共通原則 v0.1

**用途**: `transform/` 配下のすべての生成ルールに共通する前提を固定する  
**対象**: `guides/`, `survey/`, `domains/`, 将来追加する公開 workflow  
**更新日**: 2026-03-23

---

## 1. この文書の役割

この文書は、
`awareness-space` の公開物を生成するときに
どの workflow でも先に守るべき共通原則をまとめた正本である。

各 workflow の reader-rules は、
この文書を前提に個別要件だけを追加する。

---

## 2. スコープ原則

- `awareness-space` の主題は意識モデルである
- 生存-信頼軸は採択済みの真理ではなく検証対象である
- 神経現象学と、発達心理学を含む心理学領域の知見を中核参照とする
- `欠損駆動思考`, `Kesson`, `D1-D4`, `kesson-driven-thinking` を公開本文の主題にしない
- `creation-space` の D01-D30 と、`awareness-space` の構成要素 report を混同しない

---

## 3. レイヤ責務

- guide は summary である
- report は論拠である
- survey は現在地と導線である
- design memo は未検証・設計中の論点である

この境界を崩してはならない。
特に、
design memo 段階の論点を report の確定知として書かない。
guide を report の代用にしない。

---

## 4. 公開契約

- 公開正本は `pjdhiro/assets/awareness/` 配下に置く
- 公開物は workflow ごとに **Markdown 正本** を持つ
- PDF を公開する workflow では、同じ公開用 MD を入力に使う
- PDF の有無は workflow ごとの契約に従う。未確定の workflow は MD のみを正本とする
- JA / EN を公開するものは、原則として同時に整備する
- front matter と manifest のメタデータは整合させる

---

## 5. 根拠と温度

- 根拠のある断定だけを書く
- 仮説、暫定整理、未解決を混ぜない
- 「何がわかっているか」と「何がまだわからないか」を分ける
- intake / review / evidence が「まだ返さない」とした論点を勝手に昇格させない
- 一人称経験を本論に置く場合、三人称参照枠で置き換えない

---

## 6. 外部向けトーン

- 外部読者向けの一般的なトーンで書く
- 丁寧で明快だが、仲間内のメモ調・進捗ログ調・自己啓発調にしない
- 内部運用語や制作工程語を本文の主役にしない
- 専門語は必要最小限にし、初出で役割がわかるようにする
- repo の事情より、読者が理解できる順序を優先する

---

## 7. リンクと記法

- repo 相対パスを公開本文に出さない
- ローカル絶対パスを公開本文に出さない
- 公開で到達できないリンクを出さない
- 生HTMLの `<a href="...">` を公開 Markdown に書かない
- リンクが必要なら Markdown 記法を使い、公開到達可能な URL のみを使う
- 内部ラベル、内部ファイル名、存在しない PDF への先行案内を本文に出さない

---

## 8. front matter / metadata

- 公開版 front matter には公開契約上必要な最小項目だけを置く
- `generator_model` と `generated` は公開メタデータとして保持する
- `source`, `rules`, ローカルパス、内部メモを公開 front matter に出さない
- metadata の正本は `docs/evidence-metadata-awareness.md` と各 manifest 生成スクリプトに従う

---

## 9. 運用

各 workflow の reader-rules は、少なくとも次を明記すること。

1. 何を公開正本とするか
2. 誰向けの文書か
3. 何を根拠にするか
4. 何を本文に出してはいけないか
5. JA / EN / PDF / manifest の同期条件

workflow 固有ルールを作るときは、
まずこの文書を読み、
ここにない個別要件だけを追加する。
