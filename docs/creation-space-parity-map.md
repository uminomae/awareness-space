# creation-space parity map

**状態**: 進行中  
**更新日**: 2026-03-24

## 目的

`creation-space` を `awareness-space` の実装上のお手本として使うときに、
どこを参照し、
何をどこへ模倣し、
どこから先を awareness 固有仕様として分岐させるかを固定する。

この文書は次の2用途を兼ねる。

1. parity 調査・模倣実装のバックログ入口
2. セッションを跨いで再利用する参照地図

## 強い前提

- 見た目だけではなく、workflow / metadata / manifest / i18n / docs 契約まで確認する
- `creation-space` の D01-D30 調査をそのまま持ち込まない
- `awareness-space` の主題は意識モデルに限定する
- 差分は「未実装」か「awareness 固有分岐」かを必ず書き分ける

## 使い方

1. 新しい模倣実装を始める前に、本書の対象領域を確認する
2. `creation-space` の参照元ファイルを読んで、`awareness-space` 側の対応ファイルへ反映する
3. 差分が `awareness-space` 固有仕様なら「分岐理由」を本書か関連 Issue に残す
4. 実装を見送る場合でも、「次に見るファイル」を本書へ追記する

## parity 対象マップ

| 領域 | awareness-space 側の主対象 | creation-space 側の参照元 | 状態 | メモ |
|---|---|---|---|---|
| shell / topbar / footer | `index.html`, `src/styles/shell.css`, `src/page-language.js`, `src/i18n/dict.js` | `index.html`, `src/styles/shell.css`, `src/page-language.js`, `src/i18n/dict.js` | 進行中 | 見た目の parity は概ねある。2026-03-23 に footer の `dev` 導線、footer signature / section heading aria、topbar link aria、topbar `RESEARCH` 表記、model summary note、offcanvas link 文言の同期、topbar `develop` バッジの撤去、topbar/nav control aria の言語同期を反映済み。`dev` は topbar ではなく footer 側の導線として扱う。status line 的 UI はこの repo では対象外 |
| reports 導線 | `src/reports/`, `index.html` reports section, `transform/reports/README.md` | `src/reports/`, `index.html` reports section | 進行中 | domains / status modal は追随中。新 UI を追加するときは reports との干渉確認が必要。2026-03-24 に `transform/reports/README.md` から D01-D30 記述を除去し、awareness 固有スコープへ是正済み。README から `src/reports/*` と `#reports-section` へ辿れる入口も追加済み |
| docs / metadata 契約 | `docs/README.md`, `docs/evidence-metadata-awareness.md`, `transform/PRINCIPLES.md`, `transform/README.md` | `docs/README.md`, `docs/evidence-metadata-creation.md`, `transform/README.md` | 進行中 | awareness 固有の契約は維持しつつ、参照元ファイルを明示する。2026-03-24 に `transform/README.md` へ `参照先` を追加済み |
| domains workflow | `transform/domains/`, `transform/scripts/build-pdf-guide.sh` | `transform/domains/`, `transform/scripts/build-pdf-guide.sh` | 概ね整備済み | 追加実装時は `transform/domains/WORKFLOW.md` との差分検査を先に行う。2026-03-24 に `transform/domains/README.md` へ既存公開物の配置先を明記済み |
| guides / survey workflow | `transform/guides/`, `transform/survey/` | `transform/guides/`, `transform/survey/` | 進行中 | reader-rules と publish 契約の parity を継続監視する。2026-03-24 に `guides/README.md` へ audience 別正本、`survey/README.md` へ domains 導線を追記済み |
| image-cards workflow | `transform/image-cards/README.md`, `transform/scripts/ingest-awareness-image-cards.mjs` | direct 対応なし | awareness 固有 | 2026-03-24 に `transform/image-cards/README.md` へ creation-space に direct 対応がない awareness 固有 workflow だと明記済み |
| dev / runtime 補助 | `src/main.js`, `src/dev-*`, `src/background-mode.js` | `src/main.js`, `src/dev-*`, `src/background-mode.js` | 進行中 | shell chrome を追加するときは dev mode 表示と競合させない |

## 実装優先順

### P1. shell parity の残差を埋める

- topbar / offcanvas / footer の細部差分を潰す
- 言語切替と連動する chrome 文言 / aria の残差を整理する
- `creation-space` の shell で学べる要素が `awareness-space` に未反映なら task 化する

### P2. workflow parity の点検を定期化する

- `transform/` 配下の README / WORKFLOW / scripts を対応表で確認する
- `creation-space` に追加された公開契約が awareness 側へ未反映なら ops/task を切る
- `transform/reports/README.md` のような独自 workflow 入口も、UI 実装先が README から辿れる状態にする

### P3. awareness 固有分岐を明文化する

- 同じ見た目でも主題差分で分岐した箇所は「意図的差分」として残す
- 調査対象や terminology が違う箇所は parity から除外する理由を書く
- `image-cards` のように direct 対応がない workflow は awareness 固有と明記する

## 直近の着手候補

### 1. creation-space 差分の棚卸し issue を継続する

- parity 未反映箇所を見つけたら本書に追記し、必要なら個別 issue を切る
- `creation-space` を更新したら、本書の参照元パスと状態を見直す

### 2. transform docs parity を README 単位で継続する

- `transform/` 配下の README を `creation-space` と1ファイルずつ照合する
- 正本 / 公開配置 / 周辺 workflow への導線が弱い箇所を小さく追記する

### 3. issue #94 のスコープを current state に追従させる

- 初期案に残っている stale な実装項目を削る
- 実際に進めている shell / workflow / reports 導線の整備へ説明を寄せる
