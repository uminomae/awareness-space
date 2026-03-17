# evidence

意識探索のための evidence と素材置き場。

## 入口

- `PROJECT.md`: 調査憲章。目的、起点仮説、現在地の正本
- `research-overview.md`: 調査内容セクションの総覧
- `d01-d30-intake-plan.md`: D01-D30 evidence の取り込み方針

## 役割

- 調査原本
- 素材の整理
- 調査方針と現在地の管理

## 位置づけ

このディレクトリは `awareness-space` の「調査原本（evidence）」の置き場であり、公開向けに整形された記述を置く `knowledge/` と、公開時に使う変換手順群を置く `transform/` の間に位置する中間層である。

- `PROJECT.md`: 調査の正本。方針、現在地、前提を定義する。
- サブディレクトリ:
  - `review/`: 計画、横断レビュー、意思決定ログ、レビュー成果
  - `work/`: 初期スキャン結果、中間素材、一次整理
  - `deepdive/`: Level 2以上の深掘り探索（現時点ではプレースホルダ）
  - `archive/`: evidence の Revise 前スナップショット
- `knowledge/`: 解説・記事化・公開説明に向けた解像度の高い知識層
- `transform/`: `research-overview.md` や調査結果を公開配信用に変換する処理層

## 5W1H

### What

`awareness-space` の調査原本、検証ログ、将来の深掘り素材を一元管理する。

### Why

創造5段階モデルを踏襲して、研究記録を「意思決定過程」「中間素材」「公開前提」と分離し、後追い更新に耐える構造を作るため。

### Where

現在地は `awareness-space/evidence/`。

### How

`evidence/` を正本ソースとして維持し、必要時に `knowledge/` へ移植、`transform/` から公開表現へ出力する。
