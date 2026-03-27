# Issue Management

## 役割分担

- **現在、Claude のプロジェクト管理対象は `awareness-space` のみ**
- **`awareness-space` は Codex の担当リポジトリ**
- Claude は親 Issue、優先順位、依存順、repo 横断判断を管理する
- Codex は `awareness-space` 内の実装系 Issue を起票、更新、完了する

## 基本ルール

自明でない作業は GitHub Issue を基本の追跡単位とする。
1回の小変更で終わらない作業は、先に Issue を作るか既存 Issue を更新する。

## スコープ原則

- `awareness-space` の Issue は **意識のモデル** に関する作業へ限定する
- 欠損駆動思考そのものの調査・整理・公開は別 repo の担当とする
- 意識モデルに直接寄与しない理論や、欠損駆動思考由来の記述を見つけたら削除する
- 生存-信頼軸（生存と間主観性）は、この repo では仮説検証対象として扱う
- 未検証の周辺仮説を repo 全体の中心概念として先取りしない
- 調査、reader-rules、公開文書、PDF workflow は上記原則に従って見直す
- guide の要点に対になる report / survey / design memo がない場合は、Issue に分解する

## Issue 種別

- `task`: 範囲が明確な実装・整備作業
- `exploration`: 開いた理論探索・調査作業
- `ops`: ルール、ツール、運用、保守

## bottom-up 段階

`awareness-space` の主作業は、原則として次の順で進める。

| 段階 | 目的 | 主な置き場 | Issue を分ける目安 |
|---|---|---|---|
| 仮説 | 何を検証するか、反証条件、スコープを置く | `evidence/review/*-design*.md`, `knowledge/survival-trust-axis-starting-memo.md` | 仮説が複数 topic に跨る時点 |
| 調査 | source を読み、未確定論点を survey / design memo 側へ退避する | `evidence/review/*-source-map.md`, `*-intake-map.md`, `intake-return-map.md` | 調査クラスタが分かれた時点 |
| 事実 / 洞察 | reader-facing report に返せる整理を作る | `knowledge/topics/*/{ja,en}/report.md` | topic ごとに publish 可否が見えた時点 |
| 整理 | summary / report / survey / design memo の対応を固定する | `docs/summary-report-pairing.md`, `docs/report-structure.md`, manifest | docs 契約変更と UI 契約変更が分離できる時点 |
| 公開 | public asset と UI 導線へ反映する | `pjdhiro/assets/awareness/*`, `transform/scripts/*`, `src/reports/*` | publish 単位ごと |

原則:
- 完了していない仮説を先に公開しない
- 調査で得た事実 / 洞察から順に bottom-up で返す
- `guide / survey / report / design memo` の境界を越えるときは、新しい Issue に分ける

## Issue 分割ルール

以下に当てはまるとき、同じ親からでも別 Issue に分ける。

1. 仮説整理と調査設計が同時に走る
2. 調査クラスタが異なる（例: 神経現象学 / 発達心理学）
3. docs 契約変更と UI 実装変更が同時に発生する
4. publish 単位が topic ごとに分かれる
5. review worker が必要な変更と不要な変更が混ざる

## マルチ worker 役割

Issue を並行処理するときは、親セッションと worker の責務を分ける。

| role | 主な責務 | close 権限 |
|---|---|---|
| 親（manager） | worker 起動、統合判断、Issue 状態更新 | あり |
| 調査 worker | 現状分析、parity 調査、構想メモ、仕様未固定論点の整理 | 原則なし |
| 実装 worker | docs / script / UI / workflow の変更、検証、commit/push | 条件付き |
| review worker | commit 後レビュー、`REVIEW-*` 作成、PASS/WARN/FAIL コメント | なし |

原則:
- 1 worker = 1 Issue = 1成果物
- 調査 worker / review worker は原則 OPEN のまま返す
- close 判定は親（manager）が最終統合後に行う

## worker 起動トリガー

1. 仕様未固定・依存曖昧:
   調査 worker を先行起動する
2. tracked file 編集を伴う:
   実装 worker を起動する
3. ファイル移動・削除・横断変更・公開契約変更:
   review worker を必須起動する
4. close 前:
   親が Issue state / `DONE-*` / `REVIEW-*` を最終確認する

補足:
- path 変更、リネーム、cross-repo 参照更新も 3 に含める
- UI 導線変更と docs 契約変更が同時に入る場合も review 必須とする

## review 判定運用

| 判定 | 扱い |
|---|---|
| PASS | close 条件を満たすなら close してよい |
| WARN | 影響が別 Issue で追跡可能な場合のみ許容。対応先 Issue または未解決理由を固定したまま OPEN 継続、または follow-up Issue 作成後に進行 |
| FAIL | close 禁止。修正実装 worker を起動し、修正後に review worker を再実行する |

原則:
- 調査 worker / review worker は判定を返すだけで close しない
- 実装 worker が commit 済みでも、review 必須変更で `REVIEW-*` と PASS/WARN/FAIL コメントが揃う前には close しない

## 必須項目

各 Issue には最低限以下を書く。

1. 目的
2. スコープ
3. 完了条件
4. 関連 Issue または関連素材
5. guide / report / survey / design memo のどこに効くか（必要な場合）

## repo 横断ルール

- `awareness-space` の Issue が `kesson-driven-thinking` に依存する場合、親または関連 Issue をリンクする
- より具体的な親ができるまでは `kesson-driven-thinking#280` を bootstrap 親として使う
- repo ローカル Issue の進捗が親プロジェクトに影響する場合は、親 Issue にコメントを返す

## 親 Issue 返却ルール

### 親 Issue

- 親 Issue の既定値は `uminomae/kesson-driven-thinking#280`

### 返却トリガー

次のいずれかに当てはまるとき、Codex は親 Issue にコメントを返す。

1. repo bootstrap や公開設定など、repo の運用状態が変わったとき
2. `awareness-space` 側の Issue を close し、その成果が親プロジェクトの進行状態を変えるとき
3. 素材選定、コピー元、参照関係など、repo 横断前提を新たに固定したとき
4. Claude / pjdhiro 側の判断が必要な論点が露出したとき

### 親 Issue に返さなくてよいもの

- repo 内だけで完結し、親プロジェクトの状態を変えない小修正
- 途中メモや下書きで、判断や依存関係を更新しない作業

### 最小報告フォーマット

親 Issue へのコメントは、原則として以下を含める。

1. 何が完了したか
2. どのファイルまたは Issue が追加・更新・close されたか
3. commit SHA
4. 親から見た意味
5. 次の自然な着手先

テンプレート:

```md
## awareness-space#{番号} 完了（Codex, YYYY-MM-DD）

- 追加/更新: `path/to/file`
- commit: `abcdef0`
- 状態: awareness-space#{番号} CLOSED

要点:
- ...
- ...

次の自然な着手先は `awareness-space#{次番号}`。
```

## 運用ルール

- Codex は `awareness-space` 内の Issue を起票・更新してよい
- repo 横断の優先順位と順序づけは Claude を正本とする
- GitHub Issues と矛盾する別のローカル backlog を育てない
- guide の未対応要点を見つけたら、「説明を弱める」か「調査計画 issue を立てる」のどちらかを行う
