# transform/image-cards/ — 画像解釈カード workflow

## 5W1H

- **What**: `pjdhiro/assets/awareness/image-cards/items/` に置いた画像を、解釈コメント付きカードとして公開する workflow。
- **Why**: 画像を個別ファイルのまま埋め込むのではなく、一覧導線と解釈コメントを持つ公開カードとして扱うため。
- **Who**: 画像を追加する人、manifest を再生成する CLI、公開 UI を確認する人。
- **When**: 新しい画像カードを追加・更新するとき。
- **Where**: 画像と sidecar は `pjdhiro/assets/awareness/image-cards/items/`、manifest は `pjdhiro/assets/awareness/manifests/image-cards.json`。
- **How**: 画像を置いたら `node transform/scripts/ingest-awareness-image-cards.mjs` を実行し、missing sidecar を自動生成したうえで manifest を再生成する。

## 入力契約

完成形では各カードは次の 2 ファイルを同じ basename で持つ。

- 画像: `{slug}.{png|jpg|jpeg|webp|gif}`
- sidecar: `{slug}.json`

sidecar の最小例:

```json
{
  "title_ja": "風神雷神図",
  "title_en": "Fujin-Raijin Screen",
  "comment_ja": "境界を二項対立ではなく緊張の共存として読むための観察カード。",
  "comment_en": "An observation card for reading the image as coexisting tension rather than a binary split.",
  "alt_ja": "俵屋宗達の風神雷神図屏風",
  "alt_en": "Sotatsu Tawaraya's Fujin-Raijin folding screen",
  "generated": "2026-03-21",
  "generator_model": "not_applicable",
  "sort_order": 10
}
```

## 手順

1. `pjdhiro/assets/awareness/image-cards/items/` に画像を置く
2. `node transform/scripts/ingest-awareness-image-cards.mjs` を実行する
3. missing sidecar があれば自動生成される
4. `pjdhiro/assets/awareness/manifests/image-cards.json` が再生成される
5. `awareness-space` の UI を確認する
6. 必要なら `pjdhiro/main` を更新する

## 出力

- manifest: `pjdhiro/assets/awareness/manifests/image-cards.json`
- UI: `awareness-space` の MODEL セクション内 `Interpretation Cards`

## 注意

- 画像だけ置いた場合でも ingest script が初期 sidecar を自動生成する
- `title_ja` と `comment_ja` は必須
- `title_en` / `comment_en` / `alt_*` は省略可。未設定時は日本語または空文字へ fallback する
- 自動生成された comment は暫定文なので、必要なら後で直接 sidecar を編集してよい
