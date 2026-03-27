# Codex Worker 指示書テンプレート

Codex の background worker / 別 session worker に渡す指示書の正本テンプレート。
調査-only と commit ありの両方に対応する。

---

## テンプレート

```markdown
# Codex指示書: {タイトル}

**担当**: Codex background worker
**対象リポジトリ**: {owner/repo}
**対象 Issue**: #{番号}
**ブランチ**: {branch}
**worker 種別**: {調査 | docs | 実装 | レビュー}
**tracked file 変更**: {なし | あり}
**issue close**: {しない | する}
**reasoning**: {high | xhigh}

---

## Step 0: 前提確認

```bash
git branch --show-current
```

## 前提確認

- role table:

| role | 担当者 | 今回の責務 | close 権限 |
|---|---|---|---|
| parent / manager | {親セッション名} | worker 起動、再投入判断、Issue state 最終確認 | あり |
| current worker | {調査 | docs | 実装 | レビュー} | {今回この worker がやること} | {原則なし | 条件付き | あり} |

- current target layer:
  - {guide | report | survey | design memo | docs/workflow}
- 参照ファイル:
  - `path/a`
  - `path/b`
- 出力先:
  - `.cache/outbox/...`
- この worker がやらないこと:
  - ...
- review worker 起動条件:
  - {ファイル移動/削除/リネーム | path 変更 | cross-repo | publish契約変更 | UI導線+docs契約変更 | なし}
- close guard:
  - review worker が必要な変更では、`REVIEW-*` と PASS/WARN/FAIL コメントが揃うまで close しない
  - 調査 worker / review worker は原則 OPEN のまま返す

## 作業手順

### Step 1: （作業固有）

### Step 2: （作業固有）

### Step N: 検証

- 生成したファイルが存在すること
- `git status --short` が想定どおりであること

## IF 分岐

### IF tracked file 変更なし

- commit / push はしない
- `.cache/outbox/PLAN-*` または `REVIEW-*` を作る
- Issue comment を投稿する
- OPEN のまま残す理由を明記する

### IF tracked file 変更あり

#### Step N+1: commit & push

```bash
git add ...
git commit -m "{message}" -m "Co-Authored-By: Codex <noreply@openai.com>"
git pull --rebase origin {branch}
git push origin {branch}
```

#### Step N+2: コミット影響レビュー

- `creation-space/skills/commit-review-with-log/SKILL.md` を参照して `.cache/outbox/REVIEW-*.md` を残す
- review worker が必要な条件に当てはまる場合は、ここで別 worker を起動するか、その必要を明記して親へ返す
- review 必須変更では、`REVIEW-*` と PASS/WARN/FAIL コメントが揃うまで close しない

## failure handling

必須で以下を埋めること:

- worker 無応答:
  write set を狭めて再投入する
- 出力不足:
  欠落項目を指定して同 worker に再投入する
- FAIL:
  close せず、修正実装 worker を起動する
- WARN:
  follow-up Issue か対応先を明記して OPEN 継続する
- Issue 状態不整合:
  `DONE-*` と Issue state を同期してから close する

## Step 気づき

- 発見
- 次の自然な着手先

## Step 完了報告

- instruction: {指示書名}
- model: {モデル}
- tokens used: {概算}

## Step 最終

1. Issue にコメント
2. `.cache/outbox/DONE-{issue}-{date}.md` を作成
3. `gh issue view {issue} --json state,url`
4. review worker 必須条件に当てはまる場合、`REVIEW-*` と PASS/WARN/FAIL コメントの有無を確認する
5. issue close が `する` の場合のみ close
6. close 後に state を再確認

## 完了条件

- [ ] 出力ファイルがある
- [ ] Issue comment がある
- [ ] DONE / REVIEW / PLAN の必要ファイルがある
- [ ] Issue state を確認している
- [ ] review worker が必要な場合、その起動または未起動理由が明記されている
- [ ] close 前に review 完了要件の有無を確認している
```
