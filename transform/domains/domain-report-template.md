# 調査トピックレポート統一テンプレート v0.2

**用途**: `awareness-space` の `domains` report を同じ責務と粒度で再生成する  
**根拠**: `PROJECT.md`, `docs/summary-report-pairing.md`, `evidence/review/first-person-vs-third-person.md`, `reader-rules-awareness-report.md`  
**参照元**: `creation-space/transform/domains/domain-report-template.md` を awareness 向けに読み替え  
**更新日**: 2026-03-23

---

## テンプレート構造

```markdown
# {トピック名}

## 1. この文書の目的と問い

この文書が何を扱い、どの問いに答える report なのかを1-2段落で明示する。

- 対象トピック
- 意識モデルの中での位置づけ
- 今回答える問い

## 2. 調査方法と参照範囲

- 返却元となる intake / review / evidence
- 何を report に返し、何を返さないか
- 判定基準（返せる / まだ返さない / 未確定）

> 発達心理学や神経現象学を使う場合でも、
> report では「参照した知見」と「この report で引き受ける主張の範囲」を分けて書く。

## 3. トピックの整理

- 対象の定義
- 下位要素または対立項
- 一人称経験を本論に置く場合の主語
- 三人称語彙を参照枠として使う場合の位置づけ

## 4. 現時点で得られた知見

### 4-1. {主要知見A}

- 事実として: source が言っていること
- 読み取りとして: awareness-space での構造的意味
- 示唆として: このトピックのどこが強まり、どこがまだ未確定か

### 4-2. {主要知見B}

- 事実として
- 読み取りとして
- 示唆として

必要な数だけ繰り返す。

## 5. 限界と反証可能性

- 今回の source ではまだ返さない論点
- 条件付きでしか言えないこと
- 他の report / survey / design memo へ残す論点

## 6. 結論

- 何を確認できたか
- 何を未解決として残すか
- 次に返すべき調査先
```

---

## 実装原則

### A. summary-report pairing

- report は `docs/summary-report-pairing.md` の「論拠層」として書く
- summary に先行して理論を確定させない
- design memo 段階の論点は「調査中」「未確定」として扱う

### B. first-person / third-person

- 一人称経験を本論に置く場合は主語を明示する
- 脳部位、計算論、測定設計は参照枠として明示する
- 三人称参照枠で一人称経験を置き換えない

### C. intake return discipline

- intake map が「report に返せる」とした論点だけを report に入れる
- intake map が「まだ返さない」とした論点は未確定として残す
- 中心語の断定や理論全体化は、source が未確定なら未確定のまま書く

### D. repo scope

- `awareness-space` の主題は意識モデルである
- `kesson-driven-thinking` の枠組みは主題化しない
- `creation-space` の D01-D30 と混同しない

### E. public contract

- 公開正本は Markdown である
- PDF は同じ公開用 MD から生成する
- JA / EN は公開時に同時整備する
- front matter は公開用の最小項目だけを置き、内部メタデータを出さない

### F. public tone and link hygiene

- 外部向けの一般的なトーンで書く
- repo 相対パス、ローカルパス、存在しない公開リンクを本文に書かない
- 生HTMLのアンカータグを書かない
- リンクが必要なら公開到達可能な Markdown リンクだけを使う

---

## 最低チェック

- [ ] `§1`〜`§6` が揃っている
- [ ] 返却元 source が `§2` に明示されている
- [ ] `§4` の各知見が「事実 / 読み取り / 示唆」を混線させていない
- [ ] `§5` に「まだ返さない論点」が明記されている
- [ ] 一人称経験と三人称参照枠の区別が保たれている
- [ ] summary に先行する断定を書いていない
- [ ] 外部向けの一般的なトーンになっている
- [ ] アンカータグを含む生HTMLや repo 相対パスが本文に出ていない

---

## CLI向け判断基準

`reader-rules-awareness-report.md` が原則、
このテンプレートが具体的な構造である。
生成時は両方を読み、
不足があれば `quality-test-awareness-report.md` で検査する。
