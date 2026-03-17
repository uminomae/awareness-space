# 調査報告の構造メモ

`awareness-space` の調査報告をどう整理するかの入口メモ。

## 1. 目的

`creation-space` の REPORTS に対応する形で、
`awareness-space` 側でも調査結果を一覧・詳細・将来の再生成へつなげる。

## 2. 想定する層

1. 一覧
2. カード
3. 詳細

### 一覧

何が調査済みで、何が未整理かを俯瞰するための層。

### カード

個別の報告単位に入る前の入口。
主題、進捗、関連モデル、参照先を示す。

### 詳細

report 本文、根拠、参照、関連 evidence へのリンクを持つ。

## 3. 置き場

- 調査原本: `evidence/`
- report 向け変換 workflow: `transform/reports/`
- 公開向けの整理済み受け皿: `knowledge/`
- UI 導線: `src/` と `index.html`

## 4. 当面の方針

- まずは report 入口セクションを定義する
- D01-D30 evidence の取り込み方針が固まってから、個別 report 単位へ落とす
- `creation-space` の REPORTS と同じく、一覧 → 詳細へ入る構造を採る
