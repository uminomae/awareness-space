# docs/quality-management.md

## 目的

`awareness-space` の文書・UI・変換物の品質基準を定める。

## 1. 文書品質

- 正本は `docs/`, `evidence/PROJECT.md`, `knowledge/` の役割分離に従う
- 入口文書は「何が置かれるか」「どこから来るか」「次にどこを読むか」を明記する
- 計画書と report を混同しない
- guide は summary として書き、主要な要点に対になる report / survey / design memo を持つ
- report のない主張は「未検証」「調査中」「計画中」と明記する
- 移設元がある場合、移設元パスを明記する

## 2. report 品質

- report は読者向け整理であり、単なる作業計画ではない
- 一覧 / カード / 詳細の3層を持つ
- report は `knowledge/domains/` を主な受け皿とする
- guide の summary を支える reader-facing な論拠になること

## 3. UI 品質

- `creation-space` と同じサイトの別ページに見えること
- topbar / offcanvas / section 導線が 3本柱と一致すること
- guide が summary であり、REPORTS / survey が論拠と現在地であることを読者が判別できること
- 背景試作は `.cache` と `src/backgrounds/` を混同しないこと

## 4. 変更時チェック

- 正本を触ったら `docs/README.md` の導線を確認する
- topbar / offcanvas を触ったら section anchor と整合するか確認する
- `knowledge/`, `evidence/`, `transform/` の役割が崩れていないか確認する
- guide 更新時は `docs/summary-report-pairing.md` の対応原則を確認する
