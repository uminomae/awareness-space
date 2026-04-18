/**
 * wiki-links.js
 *
 * ブラウザ render-time で HTML 内の wiki 用語初出をリンクに置換する。
 * 用語マップは pd (project-design) wiki の正本から生成。
 *
 * Usage:
 *   import { injectWikiLinks } from './wiki-links.js';
 *   const html = injectWikiLinks(parsedHtml);
 */

export const WIKI_BASE = '/project-design/wiki';
export const WIKI_INDEX_URL = `${WIKI_BASE}/`;

// pd wiki/concepts/ + wiki/entities/ から生成（長い順にソート済み）
const TERM_MAP = [
  { term: 'シュワルツの基本的価値理論', category: 'entities' },
  { term: 'PDブリッジ保持論点', category: 'concepts' },
  { term: 'Value-Sensitive-Design', category: 'entities' },
  { term: 'ウィキッド・プロブレム', category: 'entities' },
  { term: 'デイヴィッド・グレーバー', category: 'entities' },
  { term: 'ネガティブケイパビリティ', category: 'entities' },
  { term: 'アウェアネスモデル', category: 'concepts' },
  { term: 'プロジェクトデザイン', category: 'concepts' },
  { term: 'アネット・ベイアー', category: 'entities' },
  { term: '創造の5段階モデル', category: 'entities' },
  { term: '信頼の多元的記述', category: 'concepts' },
  { term: 'ドナルド・ショーン', category: 'entities' },
  { term: 'ナイジェル・クロス', category: 'entities' },
  { term: 'ニクラス・ルーマン', category: 'entities' },
  { term: 'ピエール・ブルデュー', category: 'entities' },
  { term: 'Love 駆動開発', category: 'concepts' },
  { term: '信頼の定義仮説', category: 'concepts' },
  { term: 'プロスペクト理論', category: 'entities' },
  { term: '欠損駆動思考', category: 'entities' },
  { term: 'デザイン思考', category: 'entities' },
  { term: '測定設計原則', category: 'concepts' },
  { term: '内受容感覚', category: 'entities' },
  { term: '山岸俊男', category: 'entities' },
  { term: '情動の構成', category: 'entities' },
  { term: '愛着理論', category: 'entities' },
  { term: '間主観性', category: 'entities' },
  { term: 'アブダクション', category: 'entities' },
  { term: '感情処理', category: 'concepts' },
  { term: '4層モデル', category: 'entities' },
  { term: '欠損', category: 'entities' },
  { term: '抱持', category: 'entities' },
].map(({ term, category }) => ({
  term,
  url: `${WIKI_BASE}/${category}/${encodeURIComponent(term)}`,
}));

/**
 * 文字列内に含まれる wiki 用語を長い順に走査し、最初に見つかった用語の URL を返す。
 * 見つからない場合は null。TERM_MAP は長さ降順にソート済みなので、より具体的な用語が優先される。
 *
 * @param {string} text - 検索対象の文字列（例: report.nameJa + report.summaryJa）
 * @returns {string | null}
 */
export function findWikiUrlByText(text) {
  if (!text) return null;
  for (const { term, url } of TERM_MAP) {
    if (text.includes(term)) return url;
  }
  return null;
}

/**
 * parsed HTML 内の用語初出を wiki リンクに置換する。
 * - <a> タグ内部はスキップ
 * - <h1>-<h6> 内部はスキップ
 * - 各用語は最初の1回だけ置換
 *
 * @param {string} html - marked.parse() 済みの HTML 文字列
 * @returns {string} wiki リンクが注入された HTML
 */
export function injectWikiLinks(html) {
  if (!html) return html;

  const linked = new Set();

  // タグ内部 / 既存リンク / 見出しを退避
  const placeholders = [];
  let safe = html
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `\x00PH${idx}\x00`;
    })
    .replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `\x00PH${idx}\x00`;
    })
    .replace(/<[^>]+>/g, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `\x00PH${idx}\x00`;
    });

  for (const { term, url } of TERM_MAP) {
    if (linked.has(term)) continue;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped);
    if (regex.test(safe)) {
      const link = `<a href="${url}" data-wiki="1">${term}</a>`;
      const phIdx = placeholders.length;
      placeholders.push(link);
      safe = safe.replace(regex, `\x00PH${phIdx}\x00`);
      linked.add(term);
    }
  }

  // 復元
  safe = safe.replace(/\x00PH(\d+)\x00/g, (_, idx) => placeholders[Number(idx)]);
  return safe;
}
