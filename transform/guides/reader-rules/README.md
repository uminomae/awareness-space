# reader-rules 目録

## 役割

このディレクトリは `transform/guides` の audience 別変換ルールを固定化する場所。
guide は単なる入口文ではなく、**調査結果を踏まえた意識モデルの解説文書**として扱う。
ただし、guide は report の代用ではなく **summary** であり、
主要な要点は report / survey / design memo に対応づけて書く。

- `reader-rules-awareness-general.md`: 一般読者向け guide
- `reader-rules-awareness-designer.md`: 教育者・支援者・チーム設計者向け guide
- `reader-rules-awareness-academic.md`: 学際的探索者向け guide

## 使用順序

1. `../guide-rebuild-plan.md` を読む
2. audience に対応する reader-rules を読む
3. `evidence/PROJECT.md` / `evidence/review/research-design-baseline.md` / `evidence/review/core-source-map.md` / `/Users/uminomae/dev/pjdhiro/assets/awareness/survey/ja/md/survey-status.md` を読む
4. 関連する overview / report を読む
5. `knowledge/guides/` 向け guide を生成する

## 前提

- guide は 3 audience を前提に分ける
- guide は source の写しでも report の代用でもない
- `awareness-space` では意識モデル単独の論として書く
- すべての guide は、少なくとも「仮説 / 調査 / 現在地 / 未解決」を含む
- guide / survey / report の境界を崩さない
- report のない主張を、調査済みの説明として書かない
- 対応先が design memo しかない論点は「調査中」「計画中」とわかる形で書く
