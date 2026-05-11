# awareness-space — DESIGN.md

> Self-contained design system entrypoint for Claude Design ingestion.
> Source of truth: `src/styles/tokens.css`. Programmatic version: `src/styles/tokens.json`.
> Format: [Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/format/) 9-section.

## 1. Visual Theme & Atmosphere
- **Mood**: 静謐で深い暗背景の上に、藍色のアクセントが意識の輪郭として浮かぶ
- **Density**: タイトめの UI 密度、タイポグラフィをコンパクトに集約
- **Philosophy**: 気づき (awareness) を主体にする、UI は前景に出ない
- **Differentiator (vs creation-space / kesson-space)**: as は **tighter UI type** + **stronger accent-backed action** (cs の surface-based action と対照)

## 2. Color Palette & Roles

| Token | Value | Role |
|-------|-------|------|
| `--ds-color-bg-body` | `#050508` | Body 背景 (深い暗) |
| `--ds-color-accent` | `rgb(100, 150, 255)` (#6496ff) | Accent (links, focus, action) |
| `--ds-color-heading` | `rgb(255, 255, 255)` | Heading 文字色 |
| `--ds-color-sub-text` | `rgb(180, 200, 230)` | Sub-text |
| `--ds-color-highlight` | `rgb(220, 230, 245)` | Highlight |
| `--ds-color-link` | `rgb(130, 170, 255)` | Link |

as 固有:
- Action は **accent-backed** (cs の surface-based と対照): `--as-action-bg: rgba(accent, 0.1)`, hover で `rgba(accent, 0.2)`
- Card bg はソリッド: `--as-card-bg: rgba(20, 25, 40, 0.9)`

## 3. Typography Rules
- **Display Serif**: `Noto Serif JP, Yu Mincho, MS PMincho, serif` (`--ds-font-serif-display`)
- **UI Sans**: `Noto Sans JP, Hiragino Sans, Yu Gothic, Meiryo, system-ui, sans-serif` (`--as-font-sans-ui`、as 固有)
- **Mono**: `SF Mono, Fira Code, Consolas, monospace` (`--ds-font-mono-ui`)

階層 (cs より tight):
- h1: `clamp(1.0rem, 5.5vmin, 2.0rem)` (`--ds-h1-size`)
- Section heading: 0.88rem
- Card title: 1.0rem / Card text: 0.92rem
- UI base: 0.85rem (xs) / 0.88rem (sm)
- Topbar link / meta / note: **0.80rem** (cs の 0.84-0.88rem より tight)

Letter spacing scale:
- tight 0.03em / normal 0.06em / wide 0.1em / heading 0.15em

## 4. Component Stylings

### Card
- bg: `--as-card-bg` (`rgba(20, 25, 40, 0.9)` ソリッド)
- border: `--ds-card-border` / hover: `--ds-card-border-strong`
- shadow: `--ds-card-shadow-soft` / `--ds-card-shadow-rich`
- radius: `--ds-radius-md` (3px)

### Topbar
- height: 3.25rem (`--as-topbar-height`)
- bg: `rgba(10, 14, 24, 0.10)` blurred 14px
- title: `clamp(0.96rem, 1.85vw, 1.38rem)`
- 詳細は `--as-topbar-*` 参照

### Action (button-like)
- bg: `rgba(accent, 0.1)` → hover で `rgba(accent, 0.2)` (**accent-backed**)
- text: sub-text 50% alpha → hover で highlight 70%
- border: `rgba(accent, 0.2)`

### Dev panels / HUD
- 暗背景 (`rgba(7, 12, 24, 0.96)`) + 藍色 border
- 詳細は `--as-dev-panel-*` / `--as-dev-hud-*` 参照

## 5. Layout Principles
- Spacing baseline: 1rem / 1.5rem (`--ds-section-content-padding: 1rem 1.5rem 0`)
- Section grid margin top: 1.5rem
- Topbar が tight、コンテンツに集中させる構成

## 6. Depth & Elevation

Z-index は `--as-z-*` semantic tokens に集約 (cs/as/ks 命名同型):

```
content (1, 2) → raised (5) → ui-low (10) → ui-mid (15-21)
→ ui-high (58) → topbar (60) → about-overlay (72) → hud (100)
→ dev-overlay (1001) → dev-panel (1200) → slides (1500-1510)
```

Shadow:
- soft: `0 4px 12px rgba(accent, 0.15)`
- rich: `0 8px 24px rgba(0, 0, 0, 0.38), 0 0 12px rgba(accent, 0.15)`

## 7. Do's and Don'ts
- ✅ **Do**: `--ds-*` で共通 token を参照 (cs/as/ks 横断対称)
- ✅ **Do**: as 固有値は `--as-*` namespace
- ✅ **Do**: action は accent-backed (cs の surface-based と対照)
- ✅ **Do**: typography は cs より **tight** (Topbar 0.80rem 等)
- ✅ **Do**: 色は `rgb()` ではなく `r, g, b` の 3 値で定義 (`rgba()` で透明度を柔軟に変えるため)
- ❌ **Don't**: 生 `rgba(100, 150, 255, ...)` を書かない (token 化必須)
- ❌ **Don't**: z-index を数値直書きしない (`--as-z-*` を使用)
- ❌ **Don't**: CDN / 多重 alias / 外部 design-system 参照 (self-contained 原則)

## 8. Responsive Behavior
- Mobile / desktop は `clamp()` ベースで自動追従
- Topbar title: `clamp(0.96rem, 1.85vw, 1.38rem)`
- h1: `clamp(1.0rem, 5.5vmin, 2.0rem)`
- 明示的 breakpoint は最小限、`vmin` / `vw` による流動スケーリング優先

## 9. Agent Prompt Guide

awareness-space スタイルで UI を生成するプロンプト雛形:

> 「awareness-space スタイルで [コンポーネント名] を作って。
> bg は `--ds-color-bg-body` (#050508)、accent は `--ds-color-accent` (#6496ff)、
> action は **accent-backed** (`rgba(accent, 0.1)`、hover で 0.2)、
> font は UI なら `--as-font-sans-ui`、display は `--ds-font-serif-display`。
> Topbar 系は **tight** (0.80rem)、cs より小さめ。
> radius は `--ds-radius-md` (3px)、
> z-index は `--as-z-*` semantic tokens から選ぶ。」

色クイック参照:
- BG: `#050508`
- Accent: `#6496ff`
- Heading: `#ffffff`
- Sub-text: `rgb(180, 200, 230)`
- Link: `rgb(130, 170, 255)`
