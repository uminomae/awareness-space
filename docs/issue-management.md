# Issue Management

## 役割分担

- **現在、Claude のプロジェクト管理対象は `awareness-space` のみ**
- **`awareness-space` は Codex の担当リポジトリ**
- Claude は親 Issue、優先順位、依存順、repo 横断判断を管理する
- Codex は `awareness-space` 内の実装系 Issue を起票、更新、完了する

## 基本ルール

自明でない作業は GitHub Issue を基本の追跡単位とする。
1回の小変更で終わらない作業は、先に Issue を作るか既存 Issue を更新する。

## スコープ原則

- `awareness-space` の Issue は **意識のモデル** に関する作業へ限定する
- 欠損駆動思考そのものの調査・整理・公開は別 repo の担当とする
- 意識モデルに直接寄与しない理論や、欠損駆動思考由来の記述を見つけたら削除する
- 生存-信頼軸（生存と間主観性）は、この repo では仮説検証対象として扱う
- 未検証の周辺仮説を repo 全体の中心概念として先取りしない
- 調査、reader-rules、公開文書、PDF workflow は上記原則に従って見直す
- guide の要点に対になる report / survey / design memo がない場合は、Issue に分解する

## Issue 種別

- `task`: 範囲が明確な実装・整備作業
- `exploration`: 開いた理論探索・調査作業
- `ops`: ルール、ツール、運用、保守

## マルチ worker 役割

Issue を並行処理するときは、親セッションと worker の責務を分ける。

| role | 主な責務 | close 権限 |
|---|---|---|
| 親（manager） | worker 起動、統合判断、Issue 状態更新 | あり |
| 調査 worker | 現状分析、parity 調査、構想メモ、仕様未固定論点の整理 | 原則なし |
| 実装 worker | docs / script / UI / workflow の変更、検証、commit/push | 条件付き |
| review worker | commit 後レビュー、`REVIEW-*` 作成、PASS/WARN/FAIL コメント | なし |

原則:
- 1 worker = 1 Issue = 1成果物
- 調査 worker / review worker は原則 OPEN のまま返す
- close 判定は親（manager）が最終統合後に行う

## worker 起動トリガー

1. 仕様未固定・依存曖昧:
   調査 worker を先行起動する
2. tracked file 編集を伴う:
   実装 worker を起動する
3. ファイル移動・削除・横断変更・公開契約変更:
   review worker を必須起動する
4. close 前:
   親が Issue state / `DONE-*` / `REVIEW-*` を最終確認する

## 必須項目

各 Issue には最低限以下を書く。

1. 目的
2. スコープ
3. 完了条件
4. 関連 Issue または関連素材
5. guide / report / survey / design memo のどこに効くか（必要な場合）

## repo 横断ルール

- `awareness-space` の Issue が `kesson-driven-thinking` に依存する場合、親または関連 Issue をリンクする
- より具体的な親ができるまでは `kesson-driven-thinking#280` を bootstrap 親として使う
- repo ローカル Issue の進捗が親プロジェクトに影響する場合は、親 Issue にコメントを返す

## 親 Issue 返却ルール

### 親 Issue

- 親 Issue の既定値は `uminomae/kesson-driven-thinking#280`

### 返却トリガー

次のいずれかに当てはまるとき、Codex は親 Issue にコメントを返す。

1. repo bootstrap や公開設定など、repo の運用状態が変わったとき
2. `awareness-space` 側の Issue を close し、その成果が親プロジェクトの進行状態を変えるとき
3. 素材選定、コピー元、参照関係など、repo 横断前提を新たに固定したとき
4. Claude / pjdhiro 側の判断が必要な論点が露出したとき

### 親 Issue に返さなくてよいもの

- repo 内だけで完結し、親プロジェクトの状態を変えない小修正
- 途中メモや下書きで、判断や依存関係を更新しない作業

### 最小報告フォーマット

親 Issue へのコメントは、原則として以下を含める。

1. 何が完了したか
2. どのファイルまたは Issue が追加・更新・close されたか
3. commit SHA
4. 親から見た意味
5. 次の自然な着手先

テンプレート:

```md
## awareness-space#{番号} 完了（Codex, YYYY-MM-DD）

- 追加/更新: `path/to/file`
- commit: `abcdef0`
- 状態: awareness-space#{番号} CLOSED

要点:
- ...
- ...

次の自然な着手先は `awareness-space#{次番号}`。
```

## 運用ルール

- Codex は `awareness-space` 内の Issue を起票・更新してよい
- repo 横断の優先順位と順序づけは Claude を正本とする
- GitHub Issues と矛盾する別のローカル backlog を育てない
- guide の未対応要点を見つけたら、「説明を弱める」か「調査計画 issue を立てる」のどちらかを行う
