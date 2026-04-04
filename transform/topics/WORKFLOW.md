# 調査トピックレポート End-to-End ワークフロー v0.4

**用途**: 調査トピック report を `evidence` → `transform` → `knowledge` で再生成する。
**前提**: 対象トピックの evidence が `evidence/` に存在すること。
**参照**: `transform/PRINCIPLES.md`, `transform/topics/README.md`, `docs/evidence-metadata-awareness.md`

---

## A. 1調査トピックの新規生成（最小パス）

### Step 1: 入力準備

```bash
ls evidence | rg "(survival-trust-axis|four-layers)"
```

以下を読む（この順序）:

1. `transform/PRINCIPLES.md`
2. `transform/topics/README.md`
3. `transform/topics/reader-rules/reader-rules-awareness-report.md`
4. `transform/topics/quality-test/quality-test-awareness-report.md`
5. 対象の evidence（暫定: `evidence/awareness-<slug>.md`）
6. `transform/topics/svg-generation-rules.md`（SVG を生成する場合）

### Step 2: MD 生成（暫定）

`reader-rules-awareness-report.md` の構成で `knowledge/topics/<slug>/{ja,en}/report.md` を作成する。

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

`knowledge/` 配下の本文を `pjdhiro/assets/awareness/topics/{ja,en}/md/` へ反映する。
公開時は JA/EN を同時に更新する。
公開本文は外部向けの一般的なトーンを守り、repo 相対パス・内部運用語・アンカータグを含む生HTMLを含めない。

### Step 6: PDF 生成 + manifest 更新

`creation-space` と同じく、
topics でも **同じ公開用 MD を単一正本** として PDF を生成する。

```bash
cd /Users/uminomae/dev/awareness-space
bash transform/scripts/build-pdf-guide.sh --kind topics --lang all
```

このコマンドで次を行う。

1. `pjdhiro/assets/awareness/topics/{lang}/md/*.md` を入力に PDF を生成
2. `pjdhiro/assets/awareness/topics/{lang}/pdf/*.pdf` を更新
3. `transform/topics/publish/topics/index.json` を更新
4. `pjdhiro/assets/awareness/manifests/topics.json` を更新

出力確認:

```text
pjdhiro/assets/awareness/topics/ja/pdf/<slug>.pdf
pjdhiro/assets/awareness/topics/en/pdf/<slug>.pdf
```

### Step 6.5: SVG 生成（必要な topic のみ）

初期導入では `1 topic = 1 SVG` を原則とし、まず `survival-trust-axis` と `four-layers` を対象にする。
品質要件が高いため、主力モデルは `gemini-2.5-pro` とする。

```bash
cd /Users/uminomae/dev/awareness-space
bash transform/scripts/generate-awareness-topic-svg.sh --slug survival-trust-axis --lang all
bash transform/scripts/generate-awareness-topic-svg.sh --slug four-layers --lang all
```

出力先:

```text
pjdhiro/assets/awareness/img/svg/topics/ja/<slug>-01-overview-svg.svg
pjdhiro/assets/awareness/img/svg/topics/en/<slug>-01-overview-svg.svg
```

生成後は `transform/scripts/validate-awareness-svg.py` の PASS を確認する。

### Step 7: pjdhiro 側 commit & push

`creation-space` と同じく、
公開 assets は `pjdhiro/main` に commit / push する。

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/awareness/topics/ assets/awareness/img/svg/topics/ assets/awareness/manifests/topics.json
git diff --stat
git commit -m "publish awareness assets YYYY-MM-DD"
git push origin main
```

### Step 8: awareness-space 側 commit & push

```bash
cd /Users/uminomae/dev/awareness-space
git add -A
git commit -m "docs: regenerate awareness topic reports"
git pull --rebase origin develop
git push origin develop
```

metadata の情報フロー:

```text
knowledge/topics/*/{ja,en}/report.md
    ↓
pjdhiro/assets/awareness/topics/{ja,en}/md/*.md
    ↓
pjdhiro/assets/awareness/topics/{ja,en}/pdf/*.pdf
    ↓
transform/topics/publish/topics/index.json
    ↓
pjdhiro/assets/awareness/manifests/topics.json
```

## B. 1調査トピックの再生成（既存 report 更新）

A と同じだが、対象 evidence の差分確認が必須。  
再生成後、`knowledge/topics/<slug>/ja/report.md` の差分比較を取り、レビュー結果を更新する。  
公開 assets を更新した場合は Step 7-8 まで進める。

## C. 全調査トピック一括生成

暫定対象順:

1. `survival-trust-axis`
2. `four-layers`

上記を順次実行し、`quality-test` はバッチ前提で記録する。  
FAIL が出たトピックは分離して再生成する。  
公開時は `bash transform/scripts/build-pdf-guide.sh --kind topics --lang all --push` を優先する。

## D. EN版生成（公開必須）

公開時は英語版を同時に整備する。追加実行:

1. 日本語版を起点に EN 翻訳下書きを作成
2. `knowledge/topics/<slug>/en/report.md` 作成
3. `quality-test-awareness-report.md` を翻訳版にも適用
4. `bash transform/scripts/build-pdf-guide.sh --kind topics --lang all`
5. 用語統一を確認し、JA/EN を同時に公開

## 読み替えルール（運用固定）

- `creation-space` = 30学術領域（D01-D30）
- `awareness-space` = 統合的な全体調査報告を組むための調査トピック束

対象は `生存-信頼軸`, `4層モデル` の順で進行する。  
`抱持` / `Containment` は現時点では独立 topic に含めず、調査で独立現象として見えた場合のみ再検討する。  
`concept notes` は source bundle として `knowledge/concepts/` 側で扱い、独立 topic report へは先に固定しない。  
将来項目はこのファイル更新で拡張し、対象外項目は実行しない。

## awareness-space 固有メモ

- `awareness-space` は通常作業ブランチを `develop` とし、`main` への直接 push は行わない。
- 公開 assets の push は `pjdhiro/main` 側で行い、source repo 側は `develop` を維持する。
- 現行 publish script は `survival-trust-axis` と `four-layers` を既定対象としている。対象追加時は `transform/scripts/publish-awareness-topics.sh` も更新する。
