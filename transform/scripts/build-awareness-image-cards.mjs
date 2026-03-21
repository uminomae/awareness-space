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

function isImageFile(filename) {
    return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

export function slugToTitleCase(slug = '') {
    return String(slug || '')
        .split(/[-_]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function createAutoCardMeta(slug, { generatedAt = new Date().toISOString().slice(0, 10) } = {}) {
    const preset = AUTO_TITLE_PRESETS[slug] || null;
    const fallbackTitle = slugToTitleCase(slug) || slug;
    const titleJa = preset?.title_ja || fallbackTitle;
    const titleEn = preset?.title_en || fallbackTitle;
    const altJa = preset?.alt_ja || titleJa;
    const altEn = preset?.alt_en || titleEn;

    return {
        title_ja: titleJa,
        title_en: titleEn,
        comment_ja: `${titleJa} を追加画像として自動取り込みした初期カードです。解釈コメントは自動生成の初期文なので、必要に応じて後で調整してください。`,
        comment_en: `This is an initial card created automatically when ${titleEn} was added to the image directory. The interpretation comment is a provisional auto-generated note and can be refined later if needed.`,
        alt_ja: altJa,
        alt_en: altEn,
        source_url: '',
        generated: generatedAt,
        generator_model: 'codex:auto-ingest',
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
        sort_order: Number.isFinite(Number(meta.sort_order)) ? Number(meta.sort_order) : Number.MAX_SAFE_INTEGER,
    };
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
    generatedAt = new Date().toISOString().slice(0, 10),
} = {}) {
    const dirEntries = await fs.readdir(itemsDir, { withFileTypes: true });
    const imageEntries = dirEntries
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .map((entry) => entry.name);

    const cards = [];

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
        cards.push({
            slug,
            image: `${awarenessBasePath}/${imageName}`,
            ...meta,
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

    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    return payload;
}

async function main() {
    const awarenessAssetsRoot = '/Users/uminomae/dev/pjdhiro/assets/awareness';
    const itemsDir = path.join(awarenessAssetsRoot, 'image-cards/items');
    const manifestPath = path.join(awarenessAssetsRoot, 'manifests/image-cards.json');
    const payload = await buildImageCardsManifest({ itemsDir, manifestPath });
    console.log(`image cards manifest updated: ${payload.cards.length} cards`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
}
