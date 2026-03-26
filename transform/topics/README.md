# transform/topics — 調査トピック向け report パイプライン

## 5W1H

- **What**: `evidence` から調査トピック単位の報告文書を再生成する workflow。
- **Why**: 統合的な全体調査報告を支えるトピック report を、再生成可能な形で揃えるため。
- **Who**: Awareness 側の調査報告を更新する Claude Code CLI とレビュー担当者。
- **When**: 調査トピックの evidence が更新されたとき、既存 report を再生成するとき。
- **Where**: 入力は `evidence/`、規約は `reader-rules/`、品質基準は `quality-test/`、公開草案は `knowledge/topics/`。
- **How**: `reader-rules` で構成し、`quality-test` で自己点検し、レビューを通したうえで公開形に整える。

## 読み替え前提（重要）

`creation-space` の `domains` は D01-D30 の学術領域だが、`awareness-space` では reader-facing / public contract を **topics** に統一して扱う。
一部の内部ファイル名や template 名に `domain` が残っていても、意味上は調査トピックを指す legacy 名として読む。

- `生存-信頼軸`
- `4層モデル`

## 現在の状態

- 骨格は作成済み。現時点では実レポートと検証データは段階的に整備中。
- 既存公開物は `pjdhiro/assets/awareness/topics/` と `pjdhiro/assets/awareness/manifests/topics.json` にある。
- 一時的に `quality-criteria` は暫定ルール（v0.2）として採用。
- `knowledge/topics/` 側は `awareness-space` 側で拡張前提。生成先は将来の運用状況に合わせて更新。
- 公開契約は Markdown 正本 + topics PDF + manifest 更新である。
- 公開本文は外部向けトーンを守り、repo 内パスやアンカータグを含む生HTMLを出さない。

## ワークフロー

**End-to-End 手順書**: [WORKFLOW.md](WORKFLOW.md)
共通前提: まず [../PRINCIPLES.md](../PRINCIPLES.md) を読む。

| やりたいこと | 参照先 |
|---|---|
| 1調査トピックの新規生成 | WORKFLOW.md §A |
| 1調査トピックの再生成（更新） | WORKFLOW.md §B |
| 調査トピック全体の一括再生成 | WORKFLOW.md §C |
| EN 版生成（公開必須） | WORKFLOW.md §D |

## 入口

- 共通原則: [../PRINCIPLES.md](../PRINCIPLES.md)
- 生成ルール: [reader-rules/reader-rules-awareness-report.md](reader-rules/reader-rules-awareness-report.md)
- 統一テンプレート: [domain-report-template.md](domain-report-template.md)
- SVG 生成ルール: [svg-generation-rules.md](svg-generation-rules.md)
- 品質基準: [quality-test/quality-test-awareness-report.md](quality-test/quality-test-awareness-report.md)
- 3軸基準: [quality-criteria.md](quality-criteria.md)
- 共通規約: [reader-rules/README.md](reader-rules/README.md)

## 命名とファイル運用（暫定）

- 調査トピック単位の evidence は原則 `evidence/awareness-<slug>.md` を想定する。
- report 草案は `knowledge/topics/<slug>/{ja,en}/report.md`、公開配置は `pjdhiro/assets/awareness/topics/{ja,en}/md/<slug>.md` を既定とする。
- PDF は同じ公開用 MD から `pjdhiro/assets/awareness/topics/{lang}/pdf/<slug>.pdf` を生成する。
- overview SVG は `pjdhiro/assets/awareness/img/svg/topics/{lang}/{slug}-01-overview-svg.svg` を既定とする。
- `slug` は次を想定:
  - `survival-trust-axis`
  - `four-layers`

`concept notes` は現時点では `knowledge/concepts/` 側の source bundle として扱い、`transform/topics/` の公開対象には含めない。

## 参照先

- `knowledge/` の公開草案運用: [knowledge/README.md](/Users/uminomae/dev/awareness-space/knowledge/README.md)
- 調査原本: [evidence/README.md](/Users/uminomae/dev/awareness-space/evidence/README.md)
- Awareness 運用の実装方針: [docs/material-inventory.md](/Users/uminomae/dev/awareness-space/docs/material-inventory.md)
