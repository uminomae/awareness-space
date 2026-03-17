# docs/README.md

このディレクトリは `awareness-space` の管理ハブ。

## 中核文書

- `../PROJECT.md`: プロジェクト憲章
- `../CLAUDE.md`: Codex 作業ルール
- `issue-management.md`: Issue 運用ルール
- `material-inventory.md`: 初期素材インベントリ

## ブランチ / ローカルサーバー

- `main`: GitHub Pages 公開用
- `develop`: 通常作業用
- `server.sh`: ローカル確認用サーバー起動スクリプト
- `serve.py`: no-cache な静的サーバー本体
- `ops/launchd/com.uminomae.awareness-space.plist`: macOS LaunchAgent 正本
- 既定ポートは `3003`
- macOS LaunchAgent により `http://localhost:3003/` で常時起動する前提

## creation-space との構造対応

- `assets/`: 静的アセット
- `src/`: フロントエンド本体
- `transform/`: 変換 workflow
- `build/`: 生成物
- `scripts/`: 補助スクリプト
- `index.html`: Pages / ローカル入口

## 体制

- **Claude が主プロジェクト管理者**
- **`awareness-space` は Codex の担当リポジトリ**

## 現在フェーズ

- Phase 1: repo bootstrap と Issue 運用整備

## ローカル作業領域

- `.cache/threejs/`: Three.js の背景試作用ページ置き場。必要なものだけ後で追跡対象へ移す
