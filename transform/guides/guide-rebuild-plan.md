# guide rebuild plan

`awareness-space` の guide を、読者入口ではなく
**調査結果を踏まえた意識モデルの解説文書**として再定義するための設計メモ。

## 1. 役割

guide の役割は次の 3 点に限る。

1. `awareness-space` がいま何をモデル化しようとしているかを説明する
2. そのモデルがどの仮説に立ち、どの調査を根拠にしているかを説明する
3. 現時点でどこまで進んでいて、何が未解決かを説明する

guide は source の写しではない。
guide は survey の代用でもない。
guide は report 一覧の導線文でもない。

## 2. 共通骨格

すべての guide は、少なくとも次の骨格を持つ。

1. **この guide が何を説明するか**
2. **モデルの中心仮説**
3. **その仮説を確かめるために何を調査しているか**
4. **現時点で何が見えているか**
5. **どこまで進んでいるか**
6. **何がまだ未解決か**
7. **次にどこを読めばよいか**

この順序を崩して、
いきなり概念説明や活用説明に入らない。

## 3. guide / survey / report の境界

### guide

- 主題: モデル全体の解説
- 中心: 仮説、調査軸、現在地、未解決
- 役割: 読者に「この repo は何を明らかにしようとしているか」を渡す

### survey

- 主題: 調査全体の進行状況
- 中心: 何を、なぜ、どう調べているか
- 役割: 調査プロジェクトの説明

### report

- 主題: 構成要素ごとの公開ドラフト
- 中心: F-O軸、4層モデル、M1、Concept Notes など個別論点
- 役割: guide で触れた各要素を個別に深掘りする

## 4. 現在のモデル定義

guide は、現時点では次を明示する。

- 起点仮説は F-O軸である
- 意識は 4層の処理連鎖として読むのが有力である
- 神経現象学と心理学が中核参照領域である
- M1 と Concept Notes は主要 source 束である
- Withhold は中心確定概念ではなく周辺仮説である

これは `research-design-baseline.md` と `core-source-map.md` の現状整理に従う。

## 5. progress の書き方

guide は「完成理論」の顔をしない。
少なくとも次を明示する。

- いまあるのは統合理論の完成ではなく探索中のモデルである
- 公開済み report は構成要素ごとの公開ドラフトである
- 神経現象学と心理学の接続設計は進行中である
- F-O軸、Withhold、観測可能性はまだ未解決が多い

## 6. audience 別の差分

### general

- 全体像を最短で渡す
- 用語定義より「何を仮説として見ているか」を優先する
- 実感できる例を入れる

### designer

- 観察・支援・教育・チームで何が見えるかを重点化する
- ただし実践論だけに閉じず、仮説と進行中の調査も明示する

### academic

- 比較対象、方法、既知、未解決を最も明確に書く
- 探索的 guide であって査読論文ではないことを先に固定する

## 7. source 読み順

guide を生成するときの基本読み順は次の通り。

1. `evidence/PROJECT.md`
2. `evidence/review/research-design-baseline.md`
3. `evidence/review/core-source-map.md`
4. `evidence/survey-status.md`
5. 既存 guide / report / overview

個別 source は、この後で audience に応じて追加する。

## 8. 見直し計画

1. guide の役割を「モデル解説」に固定する
2. 共通骨格を reader-rules に埋め込む
3. audience 別差分だけを各 rule に残す
4. 既存 guide を新ルールで再生成する
5. survey / report UI の文言と整合を確認する

## 9. 完了条件

- guide の役割定義が rule に反映されている
- 仮説 / 調査 / 現在地 / 未解決 が全 audience で欠けない
- guide / survey / report の境界が rule 上で明記されている
- 新ルールで general / designer / academic を再生成できる
