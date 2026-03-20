# transform/domains — 意識モデル構成要素向け report パイプライン

## 5W1H

- **What**: `evidence` から意識モデル構成要素の報告文書を再生成する workflow。
- **Why**: レポートの粒度を統一し、`knowledge/` の領域別公開を再生成可能にするため。
- **Who**: Awareness 側の調査報告を更新する Claude Code CLI とレビュー担当者。
- **When**: 構成要素の evidence が更新されたとき、既存 report を再生成するとき。
- **Where**: 入力は `evidence/`、規約は `reader-rules/`、品質基準は `quality-test/`、公開草案は `knowledge/domains/`。
- **How**: `reader-rules` で構成し、`quality-test` で自己点検し、レビューを通したうえで公開形に整える。

## 読み替え前提（重要）

`creation-space` の `domains` は D01-D30 の学術領域だが、`awareness-space` の `domains` は「意識モデルの構成要素」を扱う。

- `生存-信頼軸`
- `4層モデル`
- `concept notes` 系（CN-001 系列）

## 現在の状態

- 骨格は作成済み。現時点では実レポートと検証データは段階的に整備中。
- 一時的に `quality-criteria` は暫定ルール（v0.2）として採用。
- `knowledge/domains/` 側は `awareness-space` 側で拡張前提。生成先は将来の運用状況に合わせて更新。

## ワークフロー

**End-to-End 手順書**: [WORKFLOW.md](WORKFLOW.md)

| やりたいこと | 参照先 |
|---|---|
| 1構成要素の新規生成 | WORKFLOW.md §A |
| 1構成要素の再生成（更新） | WORKFLOW.md §B |
| 構成要素全体の一括再生成 | WORKFLOW.md §C |
| EN 版生成（将来） | WORKFLOW.md §D |

## 入口

- 生成ルール: [reader-rules/reader-rules-awareness-report.md](reader-rules/reader-rules-awareness-report.md)
- 品質基準: [quality-test/quality-test-awareness-report.md](quality-test/quality-test-awareness-report.md)
- 3軸基準: [quality-criteria.md](quality-criteria.md)
- 共通規約: [reader-rules/README.md](reader-rules/README.md)

## 命名とファイル運用（暫定）

- `domains` 単位の evidence は原則 `evidence/awareness-<slug>.md` を想定（将来 `evidence/domains/<slug>.md` へ統一可能）。
- report は `knowledge/domains/<slug>/ja/report.md` を既定とする（英語は `en/report.md`）。
- `slug` は次を想定:
  - `survival-trust-axis`
  - `four-layers`
  - `cn-001` / `cn-007` など

## 参照先

- `knowledge/` の公開草案運用: [knowledge/README.md](/Users/uminomae/dev/awareness-space/knowledge/README.md)
- 調査原本: [evidence/README.md](/Users/uminomae/dev/awareness-space/evidence/README.md)
- Awareness 運用の実装方針: [docs/material-inventory.md](/Users/uminomae/dev/awareness-space/docs/material-inventory.md)
