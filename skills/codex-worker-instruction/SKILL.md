---
name: codex-worker-instruction
description: |
  Codex background worker 向けの指示書を作るときの標準手順。
  現行の CLI 指示書テンプレートが Claude 寄りであるため、
  Codex の非対話実行・別セッション実行・outbox中心運用に合わせた IF 分岐を定める。
triggers: |
  「Codex 向けの指示書」「background worker に投げたい」「別セッションで回したい」
  「この会話のコンテキストを増やさずに進めたい」「Codex worker 用テンプレ」
applyTo: ".cache/inbox/, docs/templates/"
agent: "Codex"
---

# Codex worker 指示書スキル

**バージョン**: 1.1
**作成日**: 2026-03-26  
**参照元**:
- `skills/cli-instruction/SKILL.md`
- `/Users/uminomae/dev/creation-space/skills/project-management/SKILL.md`
- `/Users/uminomae/dev/creation-space/skills/commit-review-with-log/SKILL.md`

## 0. このスキルの役割

Codex を background worker や別 session で動かすときに、
どの粒度で文脈を渡し、どこへ結果を返し、close するかを固定する。

### 現行テンプレとの差分

- `docs/templates/cli-instruction.md` は Claude Code CLI 向けの end-to-end 実行テンプレ
- 本スキルは Codex の **非対話 / 別 session / outbox first** 運用向け
- tracked file を触る worker と、調査だけする worker を最初に分岐する

## 1. 基本原則

1. **1 worker = 1 Issue = 1成果物**
2. 親セッションには結果だけ返し、途中 reasoning を持ち帰らない
3. 共有は会話ではなく `Issue comment` と `.cache/outbox/*.md` で行う
4. worker が扱う参照ファイルは、最初は **5〜10件以内** に絞る
5. 背景 worker は「close する worker」と「close しない worker」を明示的に分ける
6. close 判定は親セッションが持ち、review 未完了のまま close しない

## 2. IF 分岐

### A. 調査のみ worker

条件:
- tracked file を編集しない
- 初期分析 / parity 調査 / 構想メモ / review 専任

出力:
- `.cache/outbox/PLAN-*.md` または `.cache/outbox/REVIEW-*.md`
- Issue comment
- `DONE-*`（必要なら）

禁止:
- commit / push
- Issue close（指示書で明示されない限り）

### B. docs / rule 更新 worker

条件:
- docs / transform / skill / template の更新を行う
- repo の契約や workflow を変える

出力:
- tracked file 変更
- commit / push
- `REVIEW-*`
- `DONE-*`
- Issue comment / close

注意:
- ファイル移動・削除を含む場合は commit 影響レビューを必須にする

### C. 実装 worker

条件:
- script / UI / manifest / assets の変更を行う

出力:
- tracked file 変更
- 必要な検証結果
- commit / push
- Issue comment / close

### D. レビュー専任 worker

条件:
- 別 worker の commit 後レビュー

出力:
- `.cache/outbox/REVIEW-*.md`
- Issue comment

禁止:
- 本体実装
- commit

### review worker を必須にする条件

- ファイル移動・削除・リネームを含む
- path 変更で参照切れリスクがある
- cross-repo 参照を更新する
- publish 契約 / public contract / manifest / workflow を変更する
- UI 導線と docs 契約を同時に変更する

## 3. 指示書の必須項目

### 全 worker 共通

- 対象 Issue
- worker の種別（調査 / docs / 実装 / レビュー）
- tracked file を触るかどうか
- 参照ファイル一覧
- 出力先ファイル
- Issue を close するかどうか
- role table（parent / current worker / close 権限）
- failure handling（無応答 / 出力不足 / FAIL / WARN / state 不整合）
- target layer（guide / report / survey / design memo / docs/workflow）

### 調査のみ worker の追加必須

- `.cache/outbox/PLAN-*.md` の出力先
- OPEN のまま残す理由
- 親へ返す要約フォーマット
- close しない理由

### commit を伴う worker の追加必須

- commit message
- `Co-Authored-By: Codex <noreply@openai.com>`
- `git pull --rebase origin develop`
- `git push origin develop`
- `git status --short --branch`
- `git diff --stat`
- review worker 必須条件に当てはまるかの判定
- review 完了前は close しない条件

## 4. 結果の返し方

### 親セッションへ返す最小情報

- 何を作ったか
- 出力ファイル
- close したか
- 次の自然な着手先

### Issue comment の最小情報

1. 何を見たか
2. 何を追加/更新したか
3. 判定（PASS / WARN / FAIL）
4. 次の自然な着手先

## 5. 失敗時の再投入ルール

| 失敗 | 対応 |
|---|---|
| worker 無応答 | write set を狭めて再投入 |
| 出力不足 | 欠落項目を明示して同 worker 再投入 |
| FAIL | close 禁止。修正 worker を起動 |
| WARN | follow-up Issue または対応先を固定して OPEN 継続 |
| state 不整合 | `DONE-*` と Issue state を親が同期 |

補足:

- review worker は実装しない。検出と報告だけを返す
- 調査 worker / review worker は原則 Issue を close しない
- commit を伴う worker でも、review 必須条件に当てはまる変更では `REVIEW-*` 完了前 close 禁止

## 6. テンプレート正本

Codex worker 用テンプレート正本:

- `docs/templates/codex-worker-instruction.md`

## 7. チェックリスト

- [ ] worker 種別が明記されている
- [ ] tracked file を触るかどうかが明記されている
- [ ] close する / しない が明記されている
- [ ] `.cache/outbox/` の出力先が明記されている
- [ ] 参照ファイルが 5〜10 件程度に絞られている
- [ ] role table と failure handling が指示書に入っている
- [ ] target layer が明記されている
- [ ] commit を伴う場合のみ commit 手順が書かれている
- [ ] 調査のみ worker に commit / push が混ざっていない
- [ ] review worker が必要な条件に当てはまるか判断している
- [ ] review 必須変更では close guard が書かれている
