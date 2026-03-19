# Summary-Report Pairing Principle

**更新日**: 2026-03-19
**関連 Issue**: `#68`, `#67`, `#66`

## 位置づけ

この文書は、`awareness-space` における
**解説(summary) と論拠(report / survey / design memo) の対応原則** の正本。

guide だけの局所ルールではなく、
UI、調査、ファイルシステム、reader-rules、レビュー基準に横断して適用する。

## 原則

`awareness-space` では、解説は独立した散文ではなく **summary** として書く。
summary の各要点には、対になる調査と reader-facing な report が必要である。

### 許される例外

- 起点仮説そのものは探索的でよい
- ただし仮説以外の説明、整理、見立ては、原則として検証されるべき
- まだ対になる調査や report がない場合は、確定した説明として書かず、調査中または計画中であることを明記する

## 4つの層

| 層 | 主な置き場 | 役割 |
|---|---|---|
| summary | `knowledge/guides/` | 読者に全体像を渡す。論拠の入口を示す |
| report | `knowledge/domains/` | reader-facing な論拠。summary の各要点に対応する公開本文 |
| survey | `evidence/survey-status.md`, `evidence/survey-domain-index.md` | 調査の現在地、進行状況、入口整理 |
| design memo | `evidence/review/*.md` | 未検証・設計中の論点、今後の調査計画 |

## summary に書いてよいこと

1. 起点仮説
2. 公開済み report に支えられた整理
3. survey に支えられた現在地
4. design memo に支えられた「調査中」または「計画中」の記述

## summary にそのまま書いてはいけないこと

- report や調査がないのに、調査済みの説明のように書くこと
- design memo 段階の論点を、reader-facing な既知として扱うこと
- guide を report の代用にすること

## UI 原則

- guide は summary として表示する
- summary から REPORTS / survey / design memo へ辿れる導線を持たせる
- 読者が「仮説」「公開済み report」「調査中」「計画中」を見分けられること

## 運用原則

- guide の各主要段落には、対応する report / survey / design memo の有無を判別できるようにする
- report がある主張は guide から辿れるようにする
- report がない主張は「未検証」「調査中」「計画中」と明記する
- 対応する調査やコンテンツがない要点は Issue に分解する

## `awareness-general.md` の初期対応表

| summary の節 | 基本区分 | 現在の主な対応先 | 現状 |
|---|---|---|---|
| この guide が説明すること | summary の役割説明 | `knowledge/guides/awareness-general.md`, `evidence/survey-status.md` | summary として成立 |
| モデルの中心仮説 | 起点仮説 + report-backed 整理 | `knowledge/domains/fo-axis/ja/report.md`, `knowledge/domains/four-layers/ja/report.md`, `knowledge/domains/withhold/ja/report.md` | 一部 report-backed |
| その仮説を確かめるために何を調査しているか | survey + design memo | `evidence/survey-status.md`, `evidence/review/core-source-map.md`, `evidence/review/neurophenomenology-design.md`, `evidence/review/developmental-psychology-design.md` | 調査中 / 設計段階を含む |
| 現時点で何が見えているか | report-backed 整理 + 暫定統合 | `knowledge/domains/fo-axis/ja/report.md`, `knowledge/domains/four-layers/ja/report.md`, `knowledge/domains/m1-consciousness-os/ja/report.md`, `knowledge/domains/concept-notes/ja/report.md` | 一部は暫定統合 |
| どこまで進んでいるか | survey | `evidence/survey-status.md`, `knowledge/reports-overview.md` | survey-backed |
| 何がまだ未解決か | survey + design memo | `evidence/survey-status.md`, `evidence/review/*.md` | 調査中 / 設計段階を含む |
| 次の入口 | UI / 読書導線 | `knowledge/reports-overview.md`, `evidence/survey-domain-index.md`, `knowledge/domains/` | 要強化 |

## 完了基準

- この原則が docs / rules の正本に書かれている
- guide の主張ごとに、対応する report / survey / design memo を説明できる
- UI が summary と論拠の関係を誤魔化さない
- 未対応の要点は調査計画 issue に落ちる
