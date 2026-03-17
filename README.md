# awareness-space

`awareness-space` は、「意識とは何か」を独立に探索するための作業リポジトリです。

## 入口

- プロジェクト憲章: `PROJECT.md`
- Codex 作業ルール: `CLAUDE.md`
- 管理ハブ: `docs/README.md`
- Issue 運用ルール: `docs/issue-management.md`

## ブランチ運用

- `main`: GitHub Pages 公開用
- `develop`: 日常作業用

ローカル確認は `develop` ブランチで行い、既定ポートは `3003`。
`bash server.sh` で `http://localhost:3003/` を起動できる。

## 体制

- **Claude が主プロジェクト管理者**
- **`awareness-space` は Codex の担当リポジトリ**
- Codex はこの repo の bootstrap、実装、構造化、日常作業を担う
- Claude は親 Issue、優先順位、依存関係、全体進行を管理する
- この体制変更は pjdhiro の明示指示がある場合のみ
