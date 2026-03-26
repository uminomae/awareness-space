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

- 参照ファイル:
  - `path/a`
  - `path/b`
- 出力先:
  - `.cache/outbox/...`
- この worker がやらないこと:
  - ...

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
4. issue close が `する` の場合のみ close
5. close 後に state を再確認

## 完了条件

- [ ] 出力ファイルがある
- [ ] Issue comment がある
- [ ] DONE / REVIEW / PLAN の必要ファイルがある
- [ ] Issue state を確認している
```

