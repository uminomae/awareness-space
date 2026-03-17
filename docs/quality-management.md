# docs/quality-management.md

## 目的

`awareness-space` の文書・UI・変換物の品質基準を定める。

## 1. 文書品質

- 正本は `docs/`, `evidence/PROJECT.md`, `knowledge/` の役割分離に従う
- 入口文書は「何が置かれるか」「どこから来るか」「次にどこを読むか」を明記する
- 計画書と report を混同しない
- 移設元がある場合、移設元パスを明記する

## 2. report 品質

- report は読者向け整理であり、単なる作業計画ではない
- 一覧 / カード / 詳細の3層を持つ
- report は `knowledge/domains/` を主な受け皿とする

## 3. UI 品質

- `creation-space` と同じサイトの別ページに見えること
- topbar / offcanvas / section 導線が 3本柱と一致すること
- 背景試作は `.cache` と `src/backgrounds/` を混同しないこと

## 4. 変更時チェック

- 正本を触ったら `docs/README.md` の導線を確認する
- topbar / offcanvas を触ったら section anchor と整合するか確認する
- `knowledge/`, `evidence/`, `transform/` の役割が崩れていないか確認する
