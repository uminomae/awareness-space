# awareness-space — Claude Code CLI

`awareness-space` で作業する Claude Code CLI 向けの運用ルール。管理書類の入口は `docs/README.md`、調査の正本は `evidence/PROJECT.md` を参照する。

## 強いルール

- **現在、Claude のプロジェクト管理対象は `awareness-space` のみ**
- **`awareness-space` は Codex の担当リポジトリ**
- Codex は repo 内実務: 実装、構造化、日常作業を担う
- Claude は親 Issue、優先順位、依存関係、全体進行を管理する
- この体制変更は pjdhiro の明示指示がある場合のみ

## プロジェクト概要

- `awareness-space` は「意識とは何か」を探索する独立モジュール
- `kesson-driven-thinking` の既存資料は素材であり、自動的な正本ではない
- D1-D4 の正本は `~/dev/kesson-driven-thinking/base/schema/core-definitions.md`
- 出発点の仮説は 生存-信頼軸: 生存と間主観性を基礎とする意識仮説
- コンテンツ構造は `creation-space` を模倣し、`意識モデル / 調査内容 / 調査報告` の3本柱で整備する

## Git 規約

- 通常作業ブランチは `develop`
- `main` は GitHub Pages 公開用ブランチ
- `main` への直接 push は行わない
- コミットメッセージ形式は `{type}: {summary}`
- すべてのコミットに `Co-Authored-By: Codex <noreply@openai.com>` を含める
- push 前に `git status --short --branch` と `git diff --stat` を確認する
- `develop` を push する前に `git pull --rebase origin develop` を実行する

## セッション開始手順

1. `git branch --show-current`
2. `git status --short --branch`
3. `docs/README.md` と `evidence/PROJECT.md` を読む
4. 対象タスクの Issue と関連ファイルを読む
5. UI 確認が必要なら `bash server.sh 3003` でローカル確認する

## セッション終了時

1. `git diff --stat` で変更範囲を確認する
2. 関連 Issue に変更サマリを投稿する
3. コミットメッセージ形式と `Co-Authored-By` を確認してコミットする
4. `develop` 作業なら `git pull --rebase origin develop` の後に `git push origin develop`
5. `bash scripts/check-issue-close-state.sh` で DONE と Issue 状態の整合を確認する
6. `.cache/outbox/` に review / DONE を残す運用を優先する

## 指示書 / 完了報告

- CLI 指示書を作るときは `skills/cli-instruction/SKILL.md` と `docs/templates/cli-instruction.md` を参照する
- review を伴う作業では `.cache/outbox/REVIEW-*.md` を残す
- 完了シグナルとして `.cache/outbox/DONE-*.md` を残す
- Step 最終では `gh issue view --json state` による終了状況確認を必須とする
- close した Issue は close 後の状態確認まで実施する
- `.cache/` はローカル運用領域であり、Git 追跡はしない

## ローカル確認

- `bash server.sh` で `http://localhost:3003/` を起動する
- `3003` は macOS の LaunchAgent で常時起動する前提で扱う

## ディレクトリ構造

| パス | 役割 |
|---|---|
| `src/` | Web UI 本体、背景、runtime |
| `assets/` | ローカル静的データ |
| `docs/` | 管理書類のハブ |
| `evidence/` | 調査原本と調査憲章 |
| `knowledge/` | 解説向けナレッジの受け皿 |
| `transform/` | 公開向け変換 workflow |
| `scripts/` | 補助スクリプト |

## 関連リポジトリ

| リポジトリ | 関係 |
|---|---|
| `creation-space` | 構造、workflow、UI/UX の参照元 |
| `kesson-driven-thinking` | 正本定義と親 Issue の参照元 |
| `kesson-space` | 同系サイト shell の参照先 |
