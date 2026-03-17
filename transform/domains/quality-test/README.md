# quality-test 目録

## 役割

`transform/domains` で生成する report をレビューするための簡易チェック一覧を保持する。

- `quality-test-awareness-report.md`: 判定項目本体

## 実行順序

1. 生成後の report を読む
2. `quality-test-awareness-report.md` のカテゴリ別チェックを実施
3. PASS / WARN / FAIL を記録
4. WARN 3件以上、または FAIL がある場合は再生成

## チェック方針

- 機械的 grep で表記不整合を先に潰す
- 目視で対象と論点整合を確認
- `creation-space` 由来のルールとの誤読を避ける（本 repo の `domains` 定義に合わせる）
