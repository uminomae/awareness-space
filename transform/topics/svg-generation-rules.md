# SVG 生成ルール — awareness topics

`awareness-space` の topics report に添える overview SVG を生成する際の最小ルール。
初期導入では `1 topic = 1 SVG` を原則とし、まず `survival-trust-axis` と `four-layers` を対象にする。

## 1. 基本仕様

| 項目 | 値 |
|---|---|
| フォーマット | SVG 1.1 |
| エンコーディング | UTF-8 |
| 外部リソース | 不使用 |
| viewBox | 必須 |
| 推奨サイズ | `viewBox="0 0 1200 800"` |
| 主力モデル | `gemini-2.5-pro` |
| fallback | 既存 SVG を bootstrap / fallback として残してよい |

## 2. 出力先

初期導入では public asset を正本とする。

```text
/Users/uminomae/dev/pjdhiro/assets/awareness/img/svg/topics/{lang}/{slug}-01-overview-svg.svg
```

## 3. 命名規約

- 初期は 1 topic 1 SVG のみ
- suffix は `01-overview-svg`
- 例:
  - `survival-trust-axis-01-overview-svg.svg`
  - `four-layers-01-overview-svg.svg`

## 4. 埋め込み位置

- topics report の `## 1.` 見出し直後に画像リンクを置く
- JA は JA SVG、EN は EN SVG を優先
- EN SVG が未整備なら JA SVG fallback を許可する

Markdown 例:

```markdown
## 1. この文書の目的と問い

![生存-信頼軸の概要図](https://uminomae.github.io/pjdhiro/assets/awareness/img/svg/topics/ja/survival-trust-axis-01-overview-svg.svg)
```

## 5. 品質ゲート

- `</svg>` がある
- `viewBox` がある
- `xmlns="http://www.w3.org/2000/svg"` がある
- 禁止要素を含まない
  - `foreignObject`
  - `script`
  - `animate`
  - `image`
  - `filter`
  - `style`
- テキストが読めるサイズである

## 6. 初期導入の設計方針

- creation-space の TYPE A/B/C はそのまま移植しない
- awareness 側はまず overview 1 枚だけを扱う
- `survival-trust-axis` は二軸構造が 1 枚に落としやすいため最初の対象とする
- `four-layers` は 4層の連鎖を overview 1 枚で示し、同一契約で横展開する
