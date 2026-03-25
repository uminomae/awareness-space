# domains terminology migration plan

**状態**: draft  
**更新日**: 2026-03-24
**関連**: `#95`

## 目的

`awareness-space` に残っている `domains` という legacy 名を、
実態に近い用語へどう移行するかを段階的に整理する。

現時点では、
`domains` は true domain ではなく、
**統合的な全体調査報告を組むための調査トピック束**
として扱う方が実態に近い。

## 方針

- いきなり path / manifest / script を rename しない
- 先に reader-facing な意味づけを `調査トピック` へ揃える
- internal contract の `domains` は、影響範囲が読めるまで legacy 名として維持する
- rename の実施は、survey / report / manifest / scripts の整合計画が揃ってから行う

## 移行フェーズ

### Phase 0. 観測

目的:
- `domains` が repo 内で何を指しているかを把握する

成果:
- `evidence/review/domains-terminology-audit.md`

状態:
- 実施済み

### Phase 1. 意味づけの先行修正

目的:
- path 名を維持したまま、reader-facing / docs / transform の意味づけを `調査トピック` へ寄せる

対象:
- UI 文言
- docs 正本
- transform の reader-rules / template / README
- survey / pairing / reports overview

状態:
- 進行中
- `survey-domain-index` の reader-facing 名は `survey-topic-index` へ寄せ始めた

### Phase 2. internal contract の棚卸し

目的:
- rename 時に壊れる contract を明示する

確認対象:
- `transform/topics/publish/topics/index.json`
- `pjdhiro/assets/awareness/manifests/topics.json`
- `transform/scripts/publish-awareness-topics.sh`
- `transform/scripts/build-pdf-guide.sh`
- `src/reports/data.js`
- `survey-domain-index.md`（legacy alias）
- `knowledge/topics/` path

成果物:
- 変更対象一覧
- 依存順序
- backwards compatibility が必要な箇所

参照:
- `evidence/review/domains-terminology-impact-inventory.md`

### Phase 3. 命名判断

候補:
- `topics`
- `research-topics`
- `integration-topics`

reader-facing 日本語候補:
- 調査トピック
- 統合トピック
- 調査トピック束

判断基準:
- report / survey / guide の役割分担と矛盾しないか
- 原著文書群や concept notes を同列に収めても不自然でないか
- 統合報告へ返す中間単位として読めるか

### Phase 4. rename 実装

可能な実装単位:

1. reader-facing 名称だけ変更
2. docs / workflow 名称変更
3. manifest key / file name 変更
4. scripts / data loader / path 変更

推奨順:

1. reader-facing
2. docs / workflow
3. manifest / script / path

## 非目標

- ただちに `knowledge/topics/` を rename すること
- ただちに `survey-domain-index.md` を rename すること
- `creation-space` と同じ `domains` 概念へ揃えること

## 当面の推奨

- reader-facing では `調査トピック` を使う
- internal では `domains` を legacy contract として明示する
- `#95` では Phase 2 の棚卸しを次の主作業にする
