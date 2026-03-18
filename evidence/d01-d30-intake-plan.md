# D01-D30 取り込み方針

`awareness-space` における D01-D30 evidence の取り込み方針を整理した文書。

## 1. 位置づけ

Issue `kesson-driven-thinking#280` では、D01-D30 の調査結果を
`awareness-space` に初期コピーする方針が決まっている。

ただし、何を evidence 本体とみなし、何を補助系譜とみなすかは整理が必要である。

## 2. 一次候補

### `creation-space/evidence/`

現時点では、D01-D30 evidence 本体の第一候補は以下とする。

- `~/dev/creation-space/evidence/`

理由:
- `kesson-driven-thinking/base/evidence/README.md` によると、構造類似調査データ本体は `creation-space` に移動済み
- `creation-space` 側が現在の独立モジュールとして運用されている

## 3. 補助系譜

### `kesson-driven-thinking/chatgpt/output/`

以下は本体コピー元ではなく、review / reconcile / DR 系譜として扱う。

- `~/dev/kesson-driven-thinking/chatgpt/output/`

使い方:
- 取り込み後の照合
- 根拠の追跡
- 調査報告UIを作る際の補助素材

## 4. 取り込み単位

現時点では、次の単位で扱う。

1. evidence 本体
2. review / reconcile 系譜
3. 横断メモ / inventory

この区別を曖昧にしたまま混在させない。

## 5. 今後の作業

- D01-D30 のファイル粒度を確認する
- `awareness-space` 側の置き場を決める
- Issue `#46` で取り込みポリシーを固定する
- Issue `#45` の source map と接続して、比較素材としての見せ方を決める
