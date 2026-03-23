# 意識モデル構成要素レポート End-to-End ワークフロー v0.2

**用途**: `domains` 構成要素の report を `evidence` → `transform` → `knowledge` で再生成する。
**前提**: 対象構成要素の evidence が `evidence/` に存在すること。
**参照**: Issue #21, #22, #26

---

## A. 1構成要素の新規生成（最小パス）

### Step 1: 入力準備

```bash
ls evidence | rg "(survival-trust-axis|four-layers|withhold|cn-)"
```

以下を読む（この順序）:

1. `transform/domains/reader-rules/reader-rules-awareness-report.md`
2. `transform/domains/quality-test/quality-test-awareness-report.md`
3. 対象の evidence（暫定: `evidence/awareness-<slug>.md`）

### Step 2: MD 生成（暫定）

`reader-rules-awareness-report.md` の構成で `knowledge/domains/<slug>/{ja,en}/report.md` を作成する。

必須:

- front matter:
  - `title`
  - `generator_model`
  - `lang`
  - `version`
  - `generated`
- `evidence` 参照の節を明記
- 調査の問いに対して「分かったこと」「分からないこと」を分離

### Step 3: quality-test 実施

`quality-test/quality-test-awareness-report.md` に基づき自己採点する。  
FAIL が1件でもあれば生成に戻る。

### Step 4: 独立レビュー（推奨）

別エンジンで最低1回の指摘抽出を行い、`review` 結果をレポート末尾に残す。

- WARN 3件以上は再生成を検討。
- FAIL があれば再生成。

### Step 5: 公開整形

`knowledge/` 配下の本文を `pjdhiro/assets/awareness/domains/{ja,en}/md/` へ反映する。
公開時は JA/EN を同時に更新する。
公開本文は外部向けの一般的なトーンを守り、repo 相対パス・内部運用語・アンカータグを含む生HTMLを含めない。

### Step 6: PDF 生成 + manifest 更新

`creation-space` と同じく、
domains でも **同じ公開用 MD を単一正本** として PDF を生成する。

```bash
cd /Users/uminomae/dev/awareness-space
bash transform/scripts/build-pdf-guide.sh --kind domains --lang all
```

このコマンドで次を行う。

1. `pjdhiro/assets/awareness/domains/{lang}/md/*.md` を入力に PDF を生成
2. `pjdhiro/assets/awareness/domains/{lang}/pdf/*.pdf` を更新
3. `transform/domains/publish/domains/index.json` を更新
4. `pjdhiro/assets/awareness/manifests/domains.json` を更新

出力確認:

```text
pjdhiro/assets/awareness/domains/ja/pdf/<slug>.pdf
pjdhiro/assets/awareness/domains/en/pdf/<slug>.pdf
```

### Step 7: pjdhiro 側 commit & push

`creation-space` と同じく、
公開 assets は `pjdhiro/main` に commit / push する。

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/awareness/domains/ assets/awareness/manifests/domains.json
git diff --stat
git commit -m "publish awareness assets YYYY-MM-DD"
git push origin main
```

### Step 8: awareness-space 側 commit & push

```bash
cd /Users/uminomae/dev/awareness-space
git add -A
git commit -m "docs: regenerate awareness domain reports"
git push origin develop
```

### Step 9: awareness-space develop → main マージ

`creation-space` と同じく、
source repo 側でも develop を main へ反映して公開作業を閉じる。

```bash
cd /Users/uminomae/dev/awareness-space
git switch main
git merge develop
git push origin main
git switch develop
```

metadata の情報フロー:

```text
knowledge/domains/*/{ja,en}/report.md
    ↓
pjdhiro/assets/awareness/domains/{ja,en}/md/*.md
    ↓
pjdhiro/assets/awareness/domains/{ja,en}/pdf/*.pdf
    ↓
transform/domains/publish/domains/index.json
    ↓
pjdhiro/assets/awareness/manifests/domains.json
```

## B. 1構成要素の再生成（既存 report 更新）

A と同じだが、対象 evidence の差分確認が必須。  
再生成後、`knowledge/domains/<slug>/ja/report.md` の差分比較を取り、レビュー結果を更新する。

## C. 全構成要素一括生成

暫定対象順:

1. `survival-trust-axis`
2. `four-layers`
3. `withhold`
4. `cn-001`〜`cn-007`

上記を順次実行し、`quality-test` はバッチ前提で記録する。  
FAIL が出た構成要素は分離して再生成する。

## D. EN版生成（公開必須）

公開時は英語版を同時に整備する。追加実行:

1. 日本語版を起点に EN 翻訳下書きを作成
2. `knowledge/domains/<slug>/en/report.md` 作成
3. `quality-test-awareness-report.md` を翻訳版にも適用
4. `bash transform/scripts/build-pdf-guide.sh --kind domains --lang all`
5. 用語統一を確認し、JA/EN を同時に公開

## 読み替えルール（運用固定）

- `creation-space` = 30学術領域（D01-D30）
- `awareness-space` = 意識モデル構成要素

対象は `生存-信頼軸`, `4層モデル`, `concept notes` の順で進行する。  
将来項目はこのファイル更新で拡張し、対象外項目は実行しない。
