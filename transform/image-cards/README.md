# transform/image-cards/ — 画像解釈カード workflow

## 5W1H

- **What**: `pjdhiro/assets/awareness/image-cards/items/` に置いた画像を、解釈コメント付きカードとして公開する workflow。
- **Why**: 画像を個別ファイルのまま埋め込むのではなく、一覧導線と解釈コメントを持つ公開カードとして扱うため。
- **Who**: 画像を追加する人、manifest を再生成する CLI、公開 UI を確認する人。
- **When**: 新しい画像カードを追加・更新するとき。
- **Where**: 画像と sidecar は `pjdhiro/assets/awareness/image-cards/items/`、manifest は `pjdhiro/assets/awareness/manifests/image-cards.json`。
- **How**: 画像を置いたら `node transform/scripts/ingest-awareness-image-cards.mjs` を実行し、missing sidecar を draft として自動生成する。解説は「何が描かれているか / どう読むか / 何を主張しているか」を 1-2 文で書き、`review_status: "ready"` にしてから manifest を再生成する。

## 位置づけ

- この workflow は awareness-space 固有であり、`creation-space` に direct 対応する `transform/image-cards/` はない。
- `creation-space` 模倣の対象というより、awareness 固有の MODEL セクション運用として扱う。

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
  "review_status": "ready",
  "sort_order": 10
}
```

## 手順

1. `pjdhiro/assets/awareness/image-cards/items/` に画像を置く
2. `node transform/scripts/ingest-awareness-image-cards.mjs` を実行する
3. missing sidecar があれば `draft` sidecar が自動生成される
4. sidecar の `title_*` / `comment_*` / `alt_*` を人手で記述し、`review_status` を `"ready"` にする
5. 再度 `node transform/scripts/ingest-awareness-image-cards.mjs` を実行して `pjdhiro/assets/awareness/manifests/image-cards.json` を再生成する
6. `awareness-space` の UI を確認する
7. 必要なら `pjdhiro/main` を更新する

## 解説生成ルール

- `comment_*` は、`この図が何を表現しているか` がざっくり分かる短い要約を 1 文、必要でも 2 文までで書く
- title を手がかりにして、図の主題を先に述べる
- 冒頭で可視要素を列挙しない。細部は title だけでは意味が伝わらないときだけ補う
- `図として読める` `図解として読める` `〜を考えるためのメモ` のようなメタな言い回しは避ける
- `alt_*` は解釈ではなく、見えている内容を簡潔に記述する
- internal slug や asset 名が title に残っているなら、公開前に図の主題を示す見出しへ直す
- `画像カードとして自動取り込みしています` のような運用文を入れない

## NG / OK

- NG: `Intent Gorilla をテーマにした追加画像です。画像カードとして自動取り込みしています。`
- NG: `ゴリラとバナナ、検索バー、AI などの語を矢印でつなぎ、直観から検証までの往復を並べた発散ノートです。人が対象を強く掴んだ瞬間の衝動が、言語化・探索・批判を通って組み替わる流れを考える図として読めます。`
- OK: `対象に飛びつく衝動が、検索・反証・構築を経て検証へ組み替わっていく流れを示す図。`

## 出力

- manifest: `pjdhiro/assets/awareness/manifests/image-cards.json`
- UI: `awareness-space` の MODEL セクション内 `発散思考時note`

## 注意

- 画像だけ置いた場合でも ingest script が初期 sidecar を自動生成するが、これは draft であり公開されない
- `title_ja` と `comment_ja` は必須
- `title_en` / `comment_en` / `alt_*` は省略可。未設定時は日本語または空文字へ fallback する
- `review_status: "draft"` の sidecar と、旧来の generic 自動コメントは manifest から除外される
- `review_status: "ready"` のカードでも、theme-only / auto-ingest 型の weak commentary は builder が reject する
- 自動生成された comment は公開用ではない。必ず手で書き換えてから `review_status: "ready"` にする
