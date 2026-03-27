import fs from 'node:fs/promises';
import path from 'node:path';

export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
export const AUTO_TITLE_PRESETS = {
    intent: {
        title_ja: '意',
        title_en: 'Intent',
        alt_ja: '意を示す画像',
        alt_en: 'Image representing intent',
    },
};
export const DRAFT_REVIEW_STATUSES = new Set(['draft', 'needs_review', 'todo']);
export const LEGACY_PROVISIONAL_COMMENT_PATTERNS = [
    /画像カードとして自動取り込みしています。$/,
    /imported automatically into the image-card collection\.$/,
];
export const COMMENTARY_REJECTION_PATTERNS = [
    {
        field: 'comment_ja',
        pattern: /をテーマにした(?:追加)?画像です。?$/,
        issue: 'comment_ja must interpret the image, not just restate the theme',
    },
    {
        field: 'comment_ja',
        pattern: /画像カードとして自動取り込みしています。?$/,
        issue: 'comment_ja must not mention auto-ingest',
    },
    {
        field: 'comment_en',
        pattern: /^An additional image card centered on .+$/i,
        issue: 'comment_en must interpret the image, not just restate the theme',
    },
    {
        field: 'comment_en',
        pattern: /imported automatically into the image-card collection\.?$/i,
        issue: 'comment_en must not mention auto-ingest',
    },
    {
        field: 'comment_ja',
        pattern: /(?:図|図解)として読(?:め|めら)/,
        issue: 'comment_ja must summarize what the figure expresses, not say it can be read as a diagram',
    },
    {
        field: 'comment_ja',
        pattern: /を考えるための(?:メモ|図)です。?$/,
        issue: 'comment_ja should state the figure summary directly',
    },
    {
        field: 'comment_en',
        pattern: /\bcan be read as\b/i,
        issue: 'comment_en must summarize what the figure expresses directly',
    },
    {
        field: 'comment_en',
        pattern: /\bto think (?:through|about)\b/i,
        issue: 'comment_en should state the figure summary directly',
    },
];
export const MIN_JA_COMMENT_LENGTH = 24;

function isImageFile(filename) {
    return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

export function formatLocalDate(date = new Date()) {
    const value = date instanceof Date ? date : new Date(date);
    const year = String(value.getFullYear());
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function slugToTitleCase(slug = '') {
    return String(slug || '')
        .replace(/([A-Za-z])([0-9])/g, '$1 $2')
        .replace(/([0-9])([A-Za-z])/g, '$1 $2')
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function createAutoCardMeta(slug, { generatedAt = formatLocalDate() } = {}) {
    const preset = AUTO_TITLE_PRESETS[slug] || null;
    const fallbackTitle = slugToTitleCase(slug) || slug;
    const titleJa = preset?.title_ja || fallbackTitle;
    const titleEn = preset?.title_en || fallbackTitle;
    const altJa = preset?.alt_ja || titleJa;
    const altEn = preset?.alt_en || titleEn;

    return {
        title_ja: titleJa,
        title_en: titleEn,
        comment_ja: 'TODO: この図が何を表現しているかを短く要約する。冒頭で可視要素を列挙せず、「図として読める」とも書かない。',
        comment_en: 'TODO: Summarize what the figure expresses. Do not open with a list of visible elements and do not say it can be read as a diagram.',
        alt_ja: altJa,
        alt_en: altEn,
        source_url: '',
        generated: generatedAt,
        generator_model: 'codex:auto-ingest-draft',
        review_status: 'draft',
        review_notes: 'Before publish, replace the draft with a short summary of what the figure expresses. Use the title as a clue, avoid visible-element listing at the start, and do not write that it can be read as a diagram.',
        sort_order: Number.MAX_SAFE_INTEGER,
    };
}

export function sortCards(cards = []) {
    return [...cards].sort((a, b) => {
        const orderA = Number.isFinite(Number(a?.sort_order)) ? Number(a.sort_order) : Number.MAX_SAFE_INTEGER;
        const orderB = Number.isFinite(Number(b?.sort_order)) ? Number(b.sort_order) : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return String(a?.slug || '').localeCompare(String(b?.slug || ''), 'en');
    });
}

function stripManifestGeneratedAt(payload = {}) {
    const { generated_at: _generatedAt, ...rest } = payload;
    return rest;
}

async function readExistingManifest(manifestPath) {
    try {
        return JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    } catch (error) {
        if (error?.code === 'ENOENT' || error instanceof SyntaxError) {
            return null;
        }
        throw error;
    }
}

export function normalizeCardMeta(meta = {}) {
    if (typeof meta !== 'object' || !meta) {
        throw new Error('image card meta must be an object');
    }
    if (typeof meta.title_ja !== 'string' || !meta.title_ja.trim()) {
        throw new Error('title_ja is required');
    }
    if (typeof meta.comment_ja !== 'string' || !meta.comment_ja.trim()) {
        throw new Error('comment_ja is required');
    }

    return {
        title_ja: meta.title_ja.trim(),
        title_en: typeof meta.title_en === 'string' && meta.title_en.trim() ? meta.title_en.trim() : meta.title_ja.trim(),
        comment_ja: meta.comment_ja.trim(),
        comment_en: typeof meta.comment_en === 'string' && meta.comment_en.trim() ? meta.comment_en.trim() : meta.comment_ja.trim(),
        alt_ja: typeof meta.alt_ja === 'string' ? meta.alt_ja.trim() : '',
        alt_en: typeof meta.alt_en === 'string' && meta.alt_en.trim() ? meta.alt_en.trim() : (typeof meta.alt_ja === 'string' ? meta.alt_ja.trim() : ''),
        source_url: typeof meta.source_url === 'string' ? meta.source_url.trim() : '',
        generated: typeof meta.generated === 'string' && meta.generated.trim() ? meta.generated.trim() : '',
        generator_model: typeof meta.generator_model === 'string' && meta.generator_model.trim() ? meta.generator_model.trim() : 'not_applicable',
        review_status: typeof meta.review_status === 'string' && meta.review_status.trim() ? meta.review_status.trim() : '',
        review_notes: typeof meta.review_notes === 'string' ? meta.review_notes.trim() : '',
        sort_order: Number.isFinite(Number(meta.sort_order)) ? Number(meta.sort_order) : Number.MAX_SAFE_INTEGER,
    };
}

export function isDraftCardMeta(meta = {}) {
    const reviewStatus = typeof meta.review_status === 'string' ? meta.review_status.trim().toLowerCase() : '';
    if (DRAFT_REVIEW_STATUSES.has(reviewStatus)) {
        return true;
    }
    return [meta.comment_ja, meta.comment_en]
        .filter((value) => typeof value === 'string' && value.trim())
        .some((value) => LEGACY_PROVISIONAL_COMMENT_PATTERNS.some((pattern) => pattern.test(value.trim())));
}

export function getImageCardCommentaryIssues(meta = {}) {
    const commentJa = typeof meta.comment_ja === 'string' ? meta.comment_ja.trim() : '';
    const commentEn = typeof meta.comment_en === 'string' ? meta.comment_en.trim() : '';
    const titleJa = typeof meta.title_ja === 'string' ? meta.title_ja.trim() : '';
    const issues = [];

    if (commentJa && commentJa.length < MIN_JA_COMMENT_LENGTH) {
        issues.push(`comment_ja must be at least ${MIN_JA_COMMENT_LENGTH} characters`);
    }
    if (commentJa && titleJa && commentJa === titleJa) {
        issues.push('comment_ja must not repeat the title only');
    }

    for (const rule of COMMENTARY_REJECTION_PATTERNS) {
        const value = rule.field === 'comment_en' ? commentEn : commentJa;
        if (value && rule.pattern.test(value)) {
            issues.push(rule.issue);
        }
    }

    return [...new Set(issues)];
}

export async function findOrphanImages(itemsDir) {
    const dirEntries = await fs.readdir(itemsDir, { withFileTypes: true });
    return dirEntries
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .filter((entry) => !dirEntries.some((candidate) => candidate.isFile() && candidate.name === `${path.basename(entry.name, path.extname(entry.name))}.json`))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, 'en'));
}

export async function buildImageCardsManifest({
    itemsDir,
    manifestPath,
    awarenessBasePath = 'image-cards/items',
    generatedAt = formatLocalDate(),
} = {}) {
    const dirEntries = await fs.readdir(itemsDir, { withFileTypes: true });
    const imageEntries = dirEntries
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .map((entry) => entry.name);

    const cards = [];
    const skippedDrafts = [];

    for (const imageName of imageEntries) {
        const slug = path.basename(imageName, path.extname(imageName));
        const metaPath = path.join(itemsDir, `${slug}.json`);
        let metaRaw;
        try {
            metaRaw = await fs.readFile(metaPath, 'utf8');
        } catch (error) {
            throw new Error(`missing sidecar json for ${imageName}`);
        }

        let parsed;
        try {
            parsed = JSON.parse(metaRaw);
        } catch (error) {
            throw new Error(`invalid json for ${slug}.json`);
        }

        const meta = normalizeCardMeta(parsed);
        if (isDraftCardMeta(meta)) {
            skippedDrafts.push({
                slug,
                review_status: meta.review_status || 'legacy_provisional',
            });
            continue;
        }
        const commentaryIssues = getImageCardCommentaryIssues(meta);
        if (commentaryIssues.length) {
            throw new Error(`weak commentary for ${slug}.json: ${commentaryIssues.join('; ')}`);
        }
        const {
            review_status: _reviewStatus,
            review_notes: _reviewNotes,
            ...publicMeta
        } = meta;
        cards.push({
            slug,
            image: `${awarenessBasePath}/${imageName}`,
            ...publicMeta,
        });
    }

    const payload = {
        version: '0.1',
        generated_at: generatedAt,
        namespace: 'awareness',
        cards: sortCards(cards).map((card, index) => ({
            id: `IC${String(index + 1).padStart(2, '0')}`,
            ...card,
        })),
    };

    const existingPayload = await readExistingManifest(manifestPath);
    if (existingPayload) {
        const nextComparable = JSON.stringify(stripManifestGeneratedAt(payload));
        const existingComparable = JSON.stringify(stripManifestGeneratedAt(existingPayload));
        if (nextComparable === existingComparable) {
            return {
                payload: existingPayload,
                skippedDrafts,
            };
        }
    }

    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    return {
        payload,
        skippedDrafts,
    };
}

async function main() {
    const awarenessAssetsRoot = '/Users/uminomae/dev/pjdhiro/assets/awareness';
    const itemsDir = path.join(awarenessAssetsRoot, 'image-cards/items');
    const manifestPath = path.join(awarenessAssetsRoot, 'manifests/image-cards.json');
    const { payload, skippedDrafts } = await buildImageCardsManifest({ itemsDir, manifestPath });
    console.log(`image cards manifest updated: ${payload.cards.length} cards / skipped ${skippedDrafts.length} drafts`);
    for (const draft of skippedDrafts) {
        console.log(`skipped draft: ${draft.slug}`);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
}
