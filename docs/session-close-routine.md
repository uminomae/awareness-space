# Session Close Routine

セッションを跨いでも再開しやすいようにするための終了手順。

## 目的

- 次セッションの起点を 1 ファイルで把握できるようにする
- 今回だけのローカル事情と、今後も使う運用知見を分けて残す
- Issue / commit / review / handoff の取りこぼしを減らす

## 記録先

### 1. セッション固有の closeout

`.cache/outbox/DONE-session-{YYYYMMDD}.md`

ここに残すもの:

- その日に完了した作業
- branch / HEAD / worktree 状態
- 閉じた Issue / 残った Issue
- 次セッションの自然な着手先
- **この対話で起きた問題**

### 2. 再利用するルール

`docs/session-close-routine.md`

ここに残すもの:

- 終了処理の手順
- どこに何を書くか
- recurring な失敗パターン

### 3. 継続承認メモ

`docs/standing-approvals.md`

ここに残すもの:

- ユーザーが「以後も承認する」と明示した運用上の許可
- repo 単位の自律実行ルール

注意:

- これは**運用メモ**であり、sandbox / tool の制度的承認そのものを置き換えるものではない
- 実行環境上の承認要求が必要な場合は、その時点の tool 仕様を優先する

## 手順

1. `git status --short` で worktree を確認する
2. `git rev-parse --short HEAD` で最終 SHA を控える
3. `gh issue list --state open` で残タスクを確認する
4. Issue 作業がある場合は、各 Issue の comment / close / `REVIEW-*` / `DONE-*` を確認する
5. `.cache/outbox/DONE-session-{YYYYMMDD}.md` を更新または作成する
6. recurring な問題があれば本ファイルか `docs/standing-approvals.md` に昇格する
7. worktree が clean、または dirty 理由が closeout に書かれていることを確認して終了する

## この対話で顕在化した recurring 問題

### 1. background worker が停止・無応答になる

症状:

- `wait_agent` では返らない
- remote / issue / worktree を見ると、未着手か途中停止になっている

対処:

- 1-2 回待って返らなければ進捗確認
- それでも薄ければ close して、**write set を狭めて再投入**
- 最終 1 本なら manager 側で bounded patch に切り替える

### 2. worker が commit だけして issue 締めを残す

症状:

- `HEAD` は進んでいる
- しかし `DONE-*`、`REVIEW-*`、Issue comment / close が不足する

対処:

- manager 側で `git show` を確認
- `REVIEW-*` と `DONE-*` を補完
- Issue comment / close を実施する

### 3. `gh issue comment --body` に backtick を含めると shell 展開で崩れる

症状:

- backtick 部分が command substitution 扱いされる
- コメント本文が壊れる

対処:

- 平文で送る
- backtick を避ける
- 必要なら一時ファイルや heredoc で本文を渡す
