# transform/ — awareness-space の変換層

## 5W1H

- **What**: guide / report を公開用の Markdown / PDF 出力へ変換する workflow 群。
- **Why**: `pjdhiro/assets/awareness/` を公開正本として育てるため。
- **Who**: awareness-space の公開物を更新する CLI が使う。
- **When**: guide を更新するとき、既存出力を再生成するとき。
- **Where**: 変換ルールは `transform/`、公開配置は `pjdhiro/assets/awareness/`。
- **How**: workflow README から入口を選び、reader-rules → PDF build → manifest 更新の順で進む。

**原則**: guide は summary、report は論拠、survey は現在地、design memo は計画中論点として扱う。

## ワークフロー一覧

| workflow | 役割 | 状態 |
|---|---|---|
| `guides/` | audience別 guide を再生成し、公開配置へ流す | **初期実装済み** |
| `survey/` | 調査内容の概要・索引を生成し、公開配置へ流す | **初期実装済み** |
| `domains/` | 意識モデル構成要素の report を整備する | **初期整備済み** |
| `reports/` | report UI / modal 周辺の補助 | **参考メモ段階** |

## PDF ビルド

### スクリプト

`transform/scripts/build-pdf-guide.sh` — awareness guides / survey の PDF 生成スクリプト。

### 使い方

```bash
# guides（デフォルト: general JA）
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all

# guides general JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --lang all

# survey JA
bash transform/scripts/build-pdf-guide.sh --kind survey --lang ja

# guides + survey JA + manifest 更新
bash transform/scripts/build-pdf-guide.sh --kind all --lang ja --push

# guides 全3種 JA + manifest 更新
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang ja --push

# 依存チェックのみ
bash transform/scripts/build-pdf-guide.sh --setup
```

### 出力先

- guides Markdown: `pjdhiro/assets/awareness/guides/{lang}/md/`
- guides PDF: `pjdhiro/assets/awareness/guides/{lang}/pdf/`
- survey Markdown: `pjdhiro/assets/awareness/survey/{lang}/md/`
- survey PDF: `pjdhiro/assets/awareness/survey/{lang}/pdf/`
- manifest: `pjdhiro/assets/awareness/manifests/guides.json`

### 依存

- `pandoc`
- `lualatex`
- `python3`

## 入口

- `guides/README.md`: audience別 guide workflow の入口
- `survey/README.md`: 調査内容 workflow の入口
- `reports/README.md`: 調査報告の変換 workflow 入口
- `domains/README.md`: awareness-space 版 domains pipeline の入口（FO軸/4層モデル/Withhold/M1意識OS/CN 系）
