# 変換ルール: awareness survey版 v0.2

**対象コンテンツ**: awareness-space の調査目的、方法、素材、導線  
**対象読者**: `awareness-space` の「調査内容」ボタンから到達する読者  
**目的**: 何をどのように調査しているのか、どこを読めば詳細に進めるのかを示す  
**性格**: 読者向けの調査概要と索引。内部進捗ログではない

## 参照すべき source

- `awareness-space/evidence/PROJECT.md`
- `awareness-space/docs/material-inventory.md`
- `awareness-space/evidence/d01-d30-intake-plan.md`
- `awareness-space/evidence/review/survey-5w1h-source-map.md`
- `creation-space/transform/survey/reader-rules/reader-rules-creation-survey.md`

## 1. survey-status.md の役割

`survey-status.md` は、
この repo が何を調査し、なぜそれを調査し、どの素材を使い、
いまどこまで進んでいるかを説明する入口文書である。

含めるべき要素:

1. 調査の目的
2. 調査対象
3. 調査方法
4. 現在の主要素材
5. guide / report / source への導線
6. 限界と未解決のこと
7. 何が report-backed で、何が design memo / plan 段階かの区別

調査対象の重心は次に置く。

- 意識のモデル
- 神経現象学を中心とした知見
- 発達心理を含む心理学領域の知見
- 生存-信頼軸（生存と間主観性）がコア仮説として妥当かどうか

## 2. survey-domain-index.md の役割

`survey-domain-index.md` は、
読者が「次にどこを読むか」を決めるための索引である。

awareness では D01-D30 一覧ではなく、次の系統を整理する。

- guide
- overview
- report
- source
- 比較素材（D01-D30）

## 3. 声の設計

基本の声は、調査を依頼された人に報告するコンサルタントの声。

- 明快
- 正直
- 内部管理情報を出さない
- 次の導線を具体的に示す
- 「意識モデルの統合的探索」を主語にする

## 4. awareness 固有ルール

- `欠損駆動思考`, `Kesson`, `D1-D4`, `kesson-driven-thinking` を本文の主題にしない
- `awareness-space` は意識モデル単独の探索として説明する
- D01-D30 は本体調査ではなく、比較素材・参照系譜として扱う
- guide / 調査内容 / report の三層を混同しない
- guide は summary、report は論拠、design memo は未検証・設計中の層として区別する
- 神経現象学と心理学的知見の統合を中心に据える
- 生存-信頼軸は「この repo の特徴的仮説」であり、是非の検証対象として扱う
- `抱持` は独立概念として前提にせず、「すぐ反応しない」現象群を束ねていた仮ラベルとして扱う
- 過去素材は歴史的 source としてのみ参照し、現在の正本・命名源・理論権威として扱わない
- 公開版 front matter には `source`, `rules`, `generator_model` を出さない
- repo 内の相対パスや公開で到達できないリンクを本文に出さない
- `reader-facing`, `report-backed`, `design memo` など制作工程の語を本文の主役にしない

## 5. front matter

### survey-status.md

```md
---
id: survey-status
title: "意識モデル探索: 調査概要"
lang: ja
audience: survey
version: 0.1
date: {YYYY-MM-DD}
---
```

### survey-domain-index.md

```md
---
id: survey-domain-index
title: "意識モデル探索: 調査索引"
lang: ja
audience: survey
version: 0.1
date: {YYYY-MM-DD}
---
```

## 6. 品質チェック

- 調査目的と調査方法が 3 段落以内に出てくる
- source / guide / report の役割分離が崩れていない
- report-backed と plan-only の区別が読者に見える
- D01-D30 の扱いが「比較素材」であると明記されている
- 神経現象学 / 発達心理を含む心理学領域が調査重心として書かれている
- 生存-信頼軸が仮説検証対象として記述されている
- 次に読むべき文書への導線がある
- 内部 Issue 番号や phase 進捗の羅列になっていない
