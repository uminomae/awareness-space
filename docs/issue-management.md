# Issue Management

## 役割分担

- **Claude が主プロジェクト管理者**
- **`awareness-space` は Codex の担当リポジトリ**
- Claude は親 Issue、優先順位、依存順、repo 横断判断を管理する
- Codex は `awareness-space` 内の実装系 Issue を起票、更新、完了する

## 基本ルール

自明でない作業は GitHub Issue を基本の追跡単位とする。
1回の小変更で終わらない作業は、先に Issue を作るか既存 Issue を更新する。

## Issue 種別

- `task`: 範囲が明確な実装・整備作業
- `exploration`: 開いた理論探索・調査作業
- `ops`: ルール、ツール、運用、保守

## 必須項目

各 Issue には最低限以下を書く。

1. 目的
2. スコープ
3. 完了条件
4. 関連 Issue または関連素材

## repo 横断ルール

- `awareness-space` の Issue が `kesson-driven-thinking` に依存する場合、親または関連 Issue をリンクする
- より具体的な親ができるまでは `kesson-driven-thinking#280` を bootstrap 親として使う
- repo ローカル Issue の進捗が親プロジェクトに影響する場合は、親 Issue にコメントを返す

## 運用ルール

- Codex は `awareness-space` 内の Issue を起票・更新してよい
- repo 横断の優先順位と順序づけは Claude を正本とする
- GitHub Issues と矛盾する別のローカル backlog を育てない
