# docs/README.md

**更新日**: 2026-03-18

## 位置づけ

このファイルは `awareness-space` の管理書類ハブ。
`CLAUDE.md` や `README.md` から最初に参照し、必要な正本へ移動する。

## docs/ のスコープ

docs/ に置くもの:
- 管理体系のドキュメント
- ルール、仕様、正本
- 調査から抽出された整理済みの結論

docs/ に置かないもの:
- 調査原本（→ `evidence/`）
- 解説本文（→ `knowledge/`）
- 一時試作（→ `.cache/`）

## 1. プロジェクト概要

`awareness-space` は、意識とは何かを探索する独立リポジトリ。
`creation-space` と同じサイトの別ページのように見える構造を採用しながら、
意識モデルの解説、調査内容、調査報告を整備していく。

## 2. 主要エントリーポイント

| パス | 役割 |
|---|---|
| `README.md` | リポジトリ全体の目次 |
| `CLAUDE.md` | Codex 向け最小運用ルール |
| `PROJECT.md` | リポジトリ全体の憲章 |
| `evidence/PROJECT.md` | 調査憲章。調査目的・起点仮説・現在地の正本 |
| `docs/issue-management.md` | Issue 運用ルール |
| `docs/material-inventory.md` | 初期素材インベントリ |
| `docs/report-structure.md` | 調査報告の構造メモ |
| `docs/domains-mapping.md` | awareness-space の domains 読み替えルール |
| `docs/quality-management.md` | 品質基準 |
| `docs/guardian-matrix.md` | 最低限の守護者マトリクス |
| `docs/templates/cli-instruction.md` | CLI 指示書テンプレート正本 |
| `docs/session-close-routine.md` | セッション終了処理の正本 |
| `docs/standing-approvals.md` | 継続承認メモ |
| `docs/kdt-deletion-plan.md` | kesson-driven-thinking 側削除計画 |
| `knowledge/README.md` | 解説向けナレッジの受け皿 |
| `evidence/review/core-source-map.md` | 中核参照地図の正本 |
| `knowledge/concepts/index.md` | CN 概念ノート索引 |
| `knowledge/schema/README.md` | ナレッジスキーマの役割説明 |
| `knowledge/m1-consciousness-os/part-1-introduction.md` | M1 意識OS 系列（Part1） |
| `knowledge/domains/README.md` | 領域別レポート導線の役割説明 |
| `transform/README.md` | 公開用出力 workflow の入口 |
| `transform/domains/README.md` | awareness-space 版 domains pipeline の入口 |

## 3. ファイルカタログ

| パス | 役割 |
|---|---|
| `index.html` | 単一ページ UI の HTML エントリーポイント |
| `server.sh` | ローカル確認用サーバー起動スクリプト |
| `serve.py` | `server.sh` から呼ばれる静的サーバー |
| `src/main.js` | フロントエンド起動点 |
| `src/backgrounds/` | 背景の tracked prototype |
| `skills/cli-instruction/SKILL.md` | CLI 指示書作成スキル |
| `docs/templates/cli-instruction.md` | CLI 指示書テンプレート |
| `docs/session-close-routine.md` | セッション終了時の手順 |
| `docs/standing-approvals.md` | 継続承認の記録場所 |
| `evidence/PROJECT.md` | 調査憲章の正本 |
| `knowledge/fo-axis-starting-memo.md` | F-O軸 起点メモ |

## 4. ブランチ / ローカルサーバー

- `main`: GitHub Pages 公開用
- `develop`: 通常作業用
- 既定ポートは `3003`
- macOS LaunchAgent により `http://localhost:3003/` で常時起動する前提
- LaunchAgent 正本: `ops/launchd/com.uminomae.awareness-space.plist`

## 5. creation-space との構造対応

| パス | 役割 |
|---|---|
| `assets/` | 静的アセット |
| `src/` | フロントエンド本体 |
| `transform/` | 変換 workflow |
| `build/` | 生成物 |
| `scripts/` | 補助スクリプト |
| `index.html` | Pages / ローカル入口 |

## 6. 体制

- **現在、Claude のプロジェクト管理対象は `awareness-space` のみ**
- **`awareness-space` は Codex の担当リポジトリ**

## 7. 現在フェーズ

- Phase 1: bootstrap と UI parity は概ね完了
- 現在の実装線: `#60` M1 report、`#61` Concept Notes report 入口
- Phase 2 の初期統合フェーズは完了
- 次は source_ready を report_ready へ引き上げる段階

## 8. ローカル作業領域

- `.cache/threejs/`: Three.js の背景試作用ページ置き場。必要なものだけ追跡対象へ昇格させる
