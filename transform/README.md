# transform/ — awareness-space の変換層

## 5W1H

- **What**: guide / survey / topics report を、公開用 Markdown と必要な PDF / SVG に変換する workflow 群。
- **Why**: `pjdhiro/assets/awareness/` を公開正本として育てるため。
- **Who**: awareness-space の公開物を更新する CLI が使う。
- **When**: guide を更新するとき、既存出力を再生成するとき。
- **Where**: 変換ルールは `transform/`、公開配置は `pjdhiro/assets/awareness/`。
- **How**: workflow README から入口を選び、reader-rules → front matter 更新 → 公開用 MD を正本として必要な PDF / SVG を生成 → manifest 更新 → `pjdhiro/main` push の順で進む。

**原則**: guide は summary、report は論拠、survey は現在地、design memo は計画中論点として扱う。
**共通原則**: [PRINCIPLES.md](PRINCIPLES.md)
**metadata 正本**: `docs/evidence-metadata-awareness.md`

## ワークフロー一覧

| workflow | 役割 | 状態 |
|---|---|---|
| `guides/` | audience別 guide を再生成し、公開配置へ流す | **初期実装済み** |
| `survey/` | 調査内容の概要・索引を生成し、公開配置へ流す | **初期実装済み** |
| `topics/` | 調査トピック report を整備する | **初期整備済み** |
| `image-cards/` | pjdhiro 配下の画像を解釈カードとして公開する | **初期実装** |
| `reports/` | report UI / modal 周辺の補助 | **参考メモ段階** |

## PDF ビルド

### スクリプト

`transform/scripts/build-pdf-guide.sh` — awareness guides / survey / topics の PDF 生成スクリプト。

### 使い方

```bash
# guides（デフォルト: general JA）
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all

# guides general JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --lang all

# survey JA+EN
bash transform/scripts/build-pdf-guide.sh --kind survey --lang all

# topics JA+EN
bash transform/scripts/build-pdf-guide.sh --kind topics --lang all

# guides + survey + topics JA+EN + 公開 assets を commit/push
bash transform/scripts/build-pdf-guide.sh --kind all --lang all --push

# guides 全3種 JA+EN + 公開 assets を commit/push
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang all --push

# 依存チェックのみ
bash transform/scripts/build-pdf-guide.sh --setup
```

### 出力先

- guides Markdown: `pjdhiro/assets/awareness/guides/{lang}/md/`
- guides PDF: `pjdhiro/assets/awareness/guides/{lang}/pdf/`
- survey Markdown: `pjdhiro/assets/awareness/survey/{lang}/md/`
- survey PDF: `pjdhiro/assets/awareness/survey/{lang}/pdf/`
- topics Markdown: `pjdhiro/assets/awareness/topics/{lang}/md/`
- topics PDF: `pjdhiro/assets/awareness/topics/{lang}/pdf/`
- topics SVG: `pjdhiro/assets/awareness/img/svg/topics/{lang}/`
- manifests: `pjdhiro/assets/awareness/manifests/`

### metadata

- source markdown front matter は `generator_model` / `generated` を持つ
- manifest root は `generated_at` を持つ
- details は `docs/evidence-metadata-awareness.md` を正本とする

### 依存

- `pandoc`
- `lualatex`
- `python3`

## 入口

- `PRINCIPLES.md`: transform 配下の共通原則
- `guides/README.md`: audience別 guide workflow の入口
- `guides/WORKFLOW.md`: guides の end-to-end 手順書
- `survey/README.md`: 調査内容 workflow の入口
- `image-cards/README.md`: 画像解釈カード workflow の入口
- `reports/README.md`: 調査報告の変換 workflow 入口
- `topics/README.md`: awareness-space 版 topics pipeline の入口（生存-信頼軸/4層モデル/CN 系）

## 参照先

- 戦略方針の正本: `evidence/PROJECT.md`
- 共通原則の正本: `transform/PRINCIPLES.md`
- metadata 契約の正本: `docs/evidence-metadata-awareness.md`
- 現在の公開配置: `pjdhiro/assets/awareness/`
