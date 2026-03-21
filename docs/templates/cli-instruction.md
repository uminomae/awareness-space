# CLI 指示書テンプレート

`awareness-space` で CLI 指示書を作成する際の正本テンプレート。
まずこのファイルを読み、その後で作業固有の内容を埋める。

---

## テンプレート

```markdown
# CLI指示書: {タイトル}

**担当**: Claude Code CLI
**対象リポジトリ**: {owner/repo}
**ブランチ**: {ブランチ名}
**前提**: {前提条件}
**reasoning**: {high | xhigh}（high=機械的検証・形式チェック、xhigh=解釈・判断・分析）

---

## Step 0: 前提確認（作業開始前に必ず実行）

```bash
git branch --show-current
```

---

## 前提確認

（ブランチ、関連 Issue、参照元、前提資料など）

## 作業手順

### Step 1: （作業固有）

### Step 2: （作業固有）

...

### Step N: 検証

（テスト、lint、ファイル存在確認、表示確認など）

### Step N+1: commit & push

```bash
git add ...
git commit -m "{message}"
git pull --rebase origin {branch}
git push origin {branch}
```

### Step N+2: コミット影響レビュー

`skills/commit-review-with-log/SKILL.md` に従ってレビューする。
関連スキルがローカルにない場合は、参照元パスを明示して指示書に書くこと。

レビュー結果の報告:

1. `.cache/outbox/REVIEW-{SHA短縮}-{YYYYMMDD}.md` に保存
2. 関連 Issue に判定と要点をコメント

### Step 気づき: 作業中の発見と助言（必須）

- 作業中に見つけた不整合
- 指示書に書かれていなかった判断点
- 次に着手すべき事項

「特になし」でも明記すること。

### Step 完了報告（Codex 向け・必須）

- instruction: {指示書ファイル名}
- model: {使用モデル名}
- tokens used: {概算}

## Step 最終: 完了処理

1. Issue に変更概要 + SHA + 検証結果 + 気づき をコメント
2. `.cache/outbox/DONE-{issue番号}-{YYYYMMDD}.md` を作成
3. `gh issue view {issue番号} --repo {owner/repo} --json state,url` で終了状況を確認
4. 完了条件を満たす場合のみ Issue を close
5. `gh issue view {issue番号} --repo {owner/repo} --json state,closedAt,url` で close 結果を確認
6. close しない場合は、OPEN のまま残す理由を Issue コメントに明記する

DONE ファイル形式:

```markdown
# DONE: #{issue番号} {タイトル}
- SHA: {commit hash}
- 判定: PASS / WARN / FAIL
- instruction: {指示書ファイル名}
```

## 完了条件

- [ ] （作業固有の条件）
- [ ] Issue コメントが投稿されている
- [ ] `.cache/outbox/DONE-{issue番号}-{YYYYMMDD}.md` が作成されている
- [ ] Issue の終了状況が `gh issue view --json state` で確認されている
- [ ] close した場合は close 後の状態確認まで終わっている

### Issue close 条件

（指示書ごとに具体条件を書く。具体条件がない場合は close しない）
```

---

## チェックリスト

- [ ] `対象リポジトリ` が書かれている
- [ ] Step 0 がある
- [ ] 検証、commit & push、レビューがある
- [ ] 完了報告フッターがある
- [ ] DONE ファイル作成が書かれている
- [ ] Step 最終に `gh issue view --json state` が書かれている
- [ ] Issue close 条件が書かれている
- [ ] 出力先 README を確認している
