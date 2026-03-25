# Guides End-to-End ワークフロー

**用途**: 3 audience の awareness guide を生成し、PDF と manifest を更新して公開配置へ揃える  
**入力**: guide reader-rules、関連 report / survey / design memo  
**出力**: 3 audience x 2 languages の public Markdown / PDF と `guides.json`

---

## A. 生成

### Step 1: 入力を確認する

以下を読む。

1. `transform/PRINCIPLES.md`
2. `transform/guides/reader-rules/reader-rules-awareness-general.md`
3. `transform/guides/reader-rules/reader-rules-awareness-designer.md`
4. `transform/guides/reader-rules/reader-rules-awareness-academic.md`
5. 必要に応じて `knowledge/topics/` と `pjdhiro/assets/awareness/survey/`

### Step 2: public Markdown を揃える

audience ごとの public Markdown を JA / EN で揃える。

| audience | JA | EN |
|---|---|---|
| general | `awareness-general.md` | `awareness-general.md` |
| designer | `awareness-designer.md` | `awareness-designer.md` |
| academic | `awareness-academic.md` | `awareness-academic.md` |

出力先:

```text
pjdhiro/assets/awareness/guides/ja/md/
pjdhiro/assets/awareness/guides/en/md/
```

### Step 3: PDF を生成する

```bash
# guides general JA
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all
```

出力先:

```text
pjdhiro/assets/awareness/guides/{ja,en}/pdf/
```

### Step 4: manifest を更新する

`build-pdf-guide.sh` は `pjdhiro/assets/awareness/manifests/guides.json` を更新する。

確認する項目:

- `generated_at`
- 各 audience の `md`
- 各 audience の `pdf`
- `generator_model`
- `generated`

### Step 5: 必要なら公開する

```bash
# guides 全3種 JA+EN をビルドし、そのまま公開 assets を commit/push
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all --push
```

---

## B. 成果物マトリクス

| item | JA md | EN md | JA pdf | EN pdf |
|---|---|---|---|---|
| awareness-general | yes | yes | yes | yes |
| awareness-designer | yes | yes | yes | yes |
| awareness-academic | yes | yes | yes | yes |

---

## C. 関連ファイル

| 用途 | パス |
|---|---|
| 共通原則 | `transform/PRINCIPLES.md` |
| guide 入口 | `transform/guides/README.md` |
| guide 再構築メモ | `transform/guides/guide-rebuild-plan.md` |
| reader-rules | `transform/guides/reader-rules/` |
| PDF ビルド | `transform/scripts/build-pdf-guide.sh` |
| manifest | `pjdhiro/assets/awareness/manifests/guides.json` |
| public guides | `pjdhiro/assets/awareness/guides/` |

---

## D. awareness 固有メモ

- `creation-space` の guides workflow と違い、awareness では guides 用 SVG 段階を現行 workflow に含めない。
- guide は summary だが、単独説明文ではなく report / survey / design memo と対応づけて扱う。
- 公開時は JA / EN をまとめて揃える。
