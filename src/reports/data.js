const DEFAULT_BASE_URL = './';
const DOMAIN_ID_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/i;
const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const AWARENESS_PATH = '/assets/awareness';
const PJDHIRO_AWARENESS_PAGES = `${PJDHIRO_PAGES_BASE}${AWARENESS_PATH}`;
const PJDHIRO_AWARENESS_RAW = `${PJDHIRO_RAW_BASE}${AWARENESS_PATH}`;
const AWARENESS_DOMAINS_MANIFEST_URL = `${PJDHIRO_AWARENESS_RAW}/manifests/domains.json`;

export const DEFAULT_REPORTS_DATA_URL = AWARENESS_DOMAINS_MANIFEST_URL;
export const DEFAULT_REPORTS_ASSET_BASE = DEFAULT_BASE_URL;

export const STATUS_REPORT_LINKS = {
    ja: {
        mdUrl: `${PJDHIRO_AWARENESS_RAW}/survey/ja/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/survey/ja/pdf/survey-status.pdf`,
    },
    en: {
        mdUrl: `${PJDHIRO_AWARENESS_RAW}/survey/en/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/survey/en/pdf/survey-status.pdf`,
    },
};

export const MODEL_GUIDE_LINKS = [
    {
        key: 'general',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/ja/md/awareness-general.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/ja/pdf/awareness-general.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/en/md/awareness-general.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/en/pdf/awareness-general.pdf`,
            },
        },
    },
    {
        key: 'designer',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/ja/md/awareness-designer.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/ja/pdf/awareness-designer.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/en/md/awareness-designer.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/en/pdf/awareness-designer.pdf`,
            },
        },
    },
    {
        key: 'academic',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/ja/md/awareness-academic.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/ja/pdf/awareness-academic.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_AWARENESS_RAW}/guides/en/md/awareness-academic.md`,
                pdfUrl: `${PJDHIRO_AWARENESS_PAGES}/guides/en/pdf/awareness-academic.pdf`,
            },
        },
    },
];

export const DEFAULT_PROGRESS_TAXONOMY = [
    {
        id: 'planned',
        labelJa: '設計中',
        labelEn: 'Planned',
        descriptionJa: 'domain 定義のみ。読者向け report は未配置',
        descriptionEn: 'Domain defined, but no reader-facing report yet',
        tone: 'secondary',
        order: 10,
    },
    {
        id: 'source_ready',
        labelJa: '素材移設済',
        labelEn: 'Source ready',
        descriptionJa: '移設済み素材または overview を参照できる',
        descriptionEn: 'Imported source material or overview is available',
        tone: 'warning',
        order: 20,
    },
    {
        id: 'report_ready',
        labelJa: '公開中',
        labelEn: 'Published',
        descriptionJa: '読者向け report を参照できる。理論統合の完了は未保証',
        descriptionEn: 'A reader-facing report is available. Integrated synthesis is not yet guaranteed',
        tone: 'success',
        order: 30,
    },
];

export function normalizeLang(lang) {
    return lang === 'en' ? 'en' : 'ja';
}

export function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeDomainId(value) {
    if (!hasText(value)) return '';
    const normalized = value.trim().toUpperCase();
    return DOMAIN_ID_PATTERN.test(normalized) ? normalized : '';
}

export function normalizeProgressLevelId(value) {
    return hasText(value) ? value.trim().toLowerCase() : '';
}

export function formatDate(value) {
    if (!hasText(value)) return '';
    const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : value.trim();
}

export function parseFrontmatter(text) {
    const match = String(text || '').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: String(text || '').trim() };

    const meta = {};
    match[1].split('\n').forEach((line) => {
        const index = line.indexOf(':');
        if (index <= 0) return;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
        meta[key] = value;
    });

    return {
        meta,
        body: match[2].trim(),
    };
}

export function looksLikeHtmlDocument(text) {
    const sample = String(text || '').trimStart().slice(0, 1024).toLowerCase();
    return sample.startsWith('<!doctype html') || sample.startsWith('<html');
}

export function safeUrl(rawUrl, fallback = '', baseHref = document.baseURI) {
    if (!hasText(rawUrl)) return fallback;
    try {
        return new URL(rawUrl.trim(), baseHref).toString();
    } catch {
        return fallback;
    }
}

export function normalizeAssetBaseUrl(url, fallback = DEFAULT_REPORTS_ASSET_BASE) {
    const resolved = safeUrl(url || fallback, '', document.baseURI) || safeUrl(fallback, '', document.baseURI);
    if (!resolved) return document.baseURI;
    return resolved.endsWith('/') ? resolved : `${resolved}/`;
}

export function normalizePdfBrowserUrl(rawUrl) {
    return safeUrl(rawUrl, '');
}

export function resolveLocalizedSources(links, lang = 'ja', assetBaseUrl = document.baseURI) {
    if (!links || typeof links !== 'object') return [];
    const localized = links[normalizeLang(lang)] || links.ja || links.en;
    if (!localized) return [];
    if (Array.isArray(localized.sources) && localized.sources.length) {
        return normalizeModalSources({
            sources: localized.sources,
            assetBaseUrl,
        });
    }
    return normalizeModalSources({
        mdUrl: localized.mdUrl || localized.md || '',
        pdfUrl: localized.pdfUrl || localized.pdf || '',
        generatorModel: localized.generatorModel || '',
        generated: localized.generated || '',
        assetBaseUrl,
    });
}

function getManifestProgressTaxonomy(payload) {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.progress_taxonomy)) return payload.progress_taxonomy;
    return [];
}

function getDefaultProgressTaxonomyEntry(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    return DEFAULT_PROGRESS_TAXONOMY.find((entry) => entry.id === normalizedLevel) || {
        id: normalizedLevel || 'planned',
        labelJa: normalizedLevel || 'planned',
        labelEn: normalizedLevel || 'planned',
        descriptionJa: '',
        descriptionEn: '',
        tone: 'secondary',
        order: Number.MAX_SAFE_INTEGER,
    };
}

export function normalizeProgressTaxonomy(rawTaxonomy = [], reports = []) {
    const source = Array.isArray(rawTaxonomy) && rawTaxonomy.length ? rawTaxonomy : DEFAULT_PROGRESS_TAXONOMY;
    const normalized = [];
    const seen = new Set();

    source.forEach((entry, index) => {
        const id = normalizeProgressLevelId(entry?.id);
        if (!id || seen.has(id)) return;
        const fallback = getDefaultProgressTaxonomyEntry(id);
        normalized.push({
            id,
            labelJa: hasText(entry?.label_ja) ? entry.label_ja.trim() : fallback.labelJa,
            labelEn: hasText(entry?.label_en) ? entry.label_en.trim() : fallback.labelEn,
            descriptionJa: hasText(entry?.description_ja) ? entry.description_ja.trim() : fallback.descriptionJa,
            descriptionEn: hasText(entry?.description_en) ? entry.description_en.trim() : fallback.descriptionEn,
            tone: hasText(entry?.tone) ? entry.tone.trim().toLowerCase() : fallback.tone,
            order: Number.isFinite(Number(entry?.order)) ? Number(entry.order) : (fallback.order + index),
        });
        seen.add(id);
    });

    reports.forEach((report, index) => {
        const id = normalizeProgressLevelId(report?.progressLevel);
        if (!id || seen.has(id)) return;
        const fallback = getDefaultProgressTaxonomyEntry(id);
        normalized.push({
            ...fallback,
            order: fallback.order === Number.MAX_SAFE_INTEGER ? 1000 + index : fallback.order,
        });
        seen.add(id);
    });

    return normalized.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id, 'en'));
}

function normalizeReport(report, index, assetBaseUrl) {
    const id = normalizeDomainId(report?.id) || `A${String(index + 1).padStart(2, '0')}`;
    const progressLevel = normalizeProgressLevelId(report?.progress_level || report?.progressLevel) || 'planned';
    const nameJa = hasText(report?.name_ja) ? report.name_ja.trim() : id;
    const nameEn = hasText(report?.name_en) ? report.name_en.trim() : nameJa;
    const slug = hasText(report?.slug) ? report.slug.trim() : id.toLowerCase();
    const md = typeof report?.md === 'object' && report.md ? report.md : {};
    const pdf = typeof report?.pdf === 'object' && report.pdf ? report.pdf : {};

    return {
        id,
        slug,
        nameJa,
        nameEn,
        summaryJa: hasText(report?.summary_ja) ? report.summary_ja.trim() : '',
        summaryEn: hasText(report?.summary_en) ? report.summary_en.trim() : '',
        progressLevel,
        progressNote: hasText(report?.progress_note) ? report.progress_note.trim() : '',
        generatorModel: hasText(report?.generator_model) ? report.generator_model.trim() : '',
        generated: hasText(report?.generated) ? report.generated.trim() : '',
        md: {
            ja: safeUrl(md.ja || md.default || '', '', assetBaseUrl),
            en: safeUrl(md.en || md.ja || md.default || '', '', assetBaseUrl),
        },
        pdf: {
            ja: safeUrl(pdf.ja || pdf.default || '', '', assetBaseUrl),
            en: safeUrl(pdf.en || pdf.ja || pdf.default || '', '', assetBaseUrl),
        },
    };
}

export function resolveDomainReportSources(report, { lang = 'ja' } = {}) {
    if (!report) return [];
    const normalizedLang = normalizeLang(lang);
    const mdUrl = report.md?.[normalizedLang] || report.md?.ja || report.md?.en || '';
    const pdfUrl = report.pdf?.[normalizedLang] || report.pdf?.ja || report.pdf?.en || '';
    return normalizeModalSources({
        mdUrl,
        pdfUrl,
        generatorModel: report.generatorModel,
        generated: report.generated,
    });
}

export function normalizeModalSources({
    mdUrl = '',
    pdfUrl = '',
    generatorModel = '',
    generated = '',
    sources = [],
    assetBaseUrl = document.baseURI,
} = {}) {
    const normalized = [];
    const pushSource = (source) => {
        const resolvedMd = safeUrl(source?.mdUrl || source?.md || '', '', assetBaseUrl);
        const resolvedPdf = safeUrl(source?.pdfUrl || source?.pdf || '', '', assetBaseUrl);
        if (!resolvedMd && !resolvedPdf) return;
        normalized.push({
            mdUrl: resolvedMd,
            pdfUrl: normalizePdfBrowserUrl(resolvedPdf),
            generatorModel: hasText(source?.generatorModel) ? source.generatorModel.trim() : '',
            generated: hasText(source?.generated) ? source.generated.trim() : '',
        });
    };

    if (Array.isArray(sources) && sources.length) {
        sources.forEach(pushSource);
    } else {
        pushSource({ mdUrl, pdfUrl, generatorModel, generated });
    }

    return normalized;
}

export function countReportsByProgressLevel(reports = []) {
    return reports.reduce((acc, report) => {
        const id = normalizeProgressLevelId(report?.progressLevel) || 'planned';
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
}

export async function resolveFirstAvailablePdfUrl(sources = []) {
    const match = sources.find((source) => hasText(source?.pdfUrl));
    return match?.pdfUrl || '';
}

export async function loadReportsData({
    dataUrl = DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
} = {}) {
    const resolvedAssetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    const response = await fetch(safeUrl(dataUrl, dataUrl, document.baseURI), { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`reports manifest load failed: ${response.status}`);
    }

    const payload = await response.json();
    const rawReports = Array.isArray(payload?.reports) ? payload.reports : [];
    const reports = rawReports.map((report, index) => normalizeReport(report, index, resolvedAssetBaseUrl));
    const progressTaxonomy = normalizeProgressTaxonomy(getManifestProgressTaxonomy(payload), reports);

    return {
        generatedAt: hasText(payload?.generated_at) ? payload.generated_at.trim() : '',
        reports,
        progressTaxonomy,
        progressLevelCounts: countReportsByProgressLevel(reports),
    };
}
