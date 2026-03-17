# 意識モデル構成要素レポート End-to-End ワークフロー v0.2

**用途**: `domains` 構成要素の report を `evidence` → `transform` → `knowledge` で再生成する。
**前提**: 対象構成要素の evidence が `evidence/` に存在すること。
**参照**: Issue #21, #22, #26

---

## A. 1構成要素の新規生成（最小パス）

### Step 1: 入力準備

```bash
ls evidence | rg "(fo-axis|four-layers|withhold|m1-consciousness-os|cn-)"
```

以下を読む（この順序）:

1. `transform/domains/reader-rules/reader-rules-awareness-report.md`
2. `transform/domains/quality-test/quality-test-awareness-report.md`
3. 対象の evidence（暫定: `evidence/awareness-<slug>.md`）

### Step 2: MD 生成（暫定）

`reader-rules-awareness-report.md` の構成で `knowledge/domains/<slug>/ja/report.md` を作成する。

必須:

- front matter:
  - `title`
  - `generator_model`
  - `lang`
  - `version`
  - `date`
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

現時点では `knowledge/` 配下へ直接配置する。
将来 `build/` へ PDF/双方向リンク化する場合は `kind` 単位の整形手順を別 issue で追加する。

## B. 1構成要素の再生成（既存 report 更新）

A と同じだが、対象 evidence の差分確認が必須。  
再生成後、`knowledge/domains/<slug>/ja/report.md` の差分比較を取り、レビュー結果を更新する。

## C. 全構成要素一括生成

暫定対象順:

1. `fo-axis`
2. `four-layers`
3. `withhold`
4. `m1-consciousness-os`
5. `cn-001`〜`cn-007`

上記を順次実行し、`quality-test` はバッチ前提で記録する。  
FAIL が出た構成要素は分離して再生成する。

## D. EN版生成（将来）

現時点での英語版配信は未整備。構築時は以下を追加実行:

1. 日本語版を起点に EN 翻訳下書きを作成
2. `knowledge/domains/<slug>/en/report.md` 作成
3. `quality-test-awareness-report.md` を翻訳版にも適用
4. 用語統一を確認して公開

## 読み替えルール（運用固定）

- `creation-space` = 30学術領域（D01-D30）
- `awareness-space` = 意識モデル構成要素

対象は `FO軸`, `4層モデル`, `Withhold`, `M1意識OS`, `concept notes` の順で進行する。  
将来項目はこのファイル更新で拡張し、対象外項目は実行しない。
