import { normalizeLang } from './i18n.js';

const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const AWARENESS_PATH = '/assets/awareness';
const PJDHIRO_AWARENESS_PAGES = `${PJDHIRO_PAGES_BASE}${AWARENESS_PATH}`;
const PJDHIRO_AWARENESS_RAW = `${PJDHIRO_RAW_BASE}${AWARENESS_PATH}`;
const IMAGE_CARDS_MANIFEST_URL = `${PJDHIRO_AWARENESS_RAW}/manifests/image-cards.json`;

const STRINGS = {
    ja: {
        empty: '公開中の画像カードはまだありません。',
        error: '画像カード manifest の読み込みに失敗しました。',
        openImage: '画像を開く',
        openSource: '出典',
        generatedPrefix: 'manifest',
    },
    en: {
        empty: 'No image cards are published yet.',
        error: 'Failed to load the image cards manifest.',
        openImage: 'Open Image',
        openSource: 'Source',
        generatedPrefix: 'manifest',
    },
};

const state = {
    lang: 'ja',
    generatedAt: '',
    cards: [],
    loadError: false,
    dom: {
        grid: null,
        generated: null,
    },
};

function getStrings(lang = 'ja') {
    return STRINGS[normalizeLang(lang)] || STRINGS.ja;
}

export function localizeImageCard(card, lang = 'ja') {
    const normalizedLang = normalizeLang(lang);
    const useEnglish = normalizedLang === 'en';
    return {
        title: useEnglish ? (card.title_en || card.title_ja || '') : (card.title_ja || card.title_en || ''),
        comment: useEnglish ? (card.comment_en || card.comment_ja || '') : (card.comment_ja || card.comment_en || ''),
        alt: useEnglish ? (card.alt_en || card.alt_ja || card.title_en || card.title_ja || '') : (card.alt_ja || card.alt_en || card.title_ja || card.title_en || ''),
    };
}

export function sortImageCards(cards = []) {
    return [...cards].sort((a, b) => {
        const orderA = Number.isFinite(Number(a?.sort_order)) ? Number(a.sort_order) : Number.MAX_SAFE_INTEGER;
        const orderB = Number.isFinite(Number(b?.sort_order)) ? Number(b.sort_order) : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return String(a?.slug || '').localeCompare(String(b?.slug || ''), 'en');
    });
}

function resolvePublishedAssetUrl(relativePath = '') {
    if (!relativePath) return '';
    return `${PJDHIRO_AWARENESS_PAGES}/${relativePath.replace(/^\/+/, '')}`;
}

function cacheDom() {
    state.dom.grid = document.getElementById('image-card-grid');
    state.dom.generated = document.getElementById('image-cards-generated');
}

function createLink(label, href) {
    const link = document.createElement('a');
    link.className = 'awareness-card-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = label;
    return link;
}

function renderImageCards() {
    if (!state.dom.grid) return;
    const strings = getStrings(state.lang);
    state.dom.grid.innerHTML = '';

    if (state.dom.generated) {
        state.dom.generated.textContent = state.generatedAt
            ? `${strings.generatedPrefix}: ${state.generatedAt.slice(0, 10)}`
            : '';
    }

    if (state.loadError) {
        const node = document.createElement('div');
        node.className = 'col-12 text-warning-emphasis';
        node.textContent = strings.error;
        state.dom.grid.appendChild(node);
        return;
    }

    if (!state.cards.length) {
        const node = document.createElement('div');
        node.className = 'col-12 text-body-secondary';
        node.textContent = strings.empty;
        state.dom.grid.appendChild(node);
        return;
    }

    const fragment = document.createDocumentFragment();
    sortImageCards(state.cards).forEach((card) => {
        const col = document.createElement('div');
        col.className = 'col';

        const article = document.createElement('article');
        article.className = 'card kesson-card awareness-card awareness-image-card h-100';

        const copy = localizeImageCard(card, state.lang);
        const imageUrl = resolvePublishedAssetUrl(card.image);
        if (imageUrl) {
            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.src = imageUrl;
            img.alt = copy.alt;
            article.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column gap-2';

        const kicker = document.createElement('div');
        kicker.className = 'awareness-card-kicker';
        kicker.textContent = 'Interpretation';

        const title = document.createElement('h3');
        title.className = 'card-title h6';
        title.textContent = copy.title;

        const comment = document.createElement('p');
        comment.className = 'card-text awareness-image-card-comment mb-0';
        comment.textContent = copy.comment;

        const links = document.createElement('div');
        links.className = 'awareness-image-card-links d-flex flex-wrap gap-3 pt-2';
        if (imageUrl) {
            links.appendChild(createLink(strings.openImage, imageUrl));
        }
        if (typeof card.source_url === 'string' && card.source_url.trim()) {
            links.appendChild(createLink(strings.openSource, card.source_url.trim()));
        }

        body.append(kicker, title, comment);
        if (links.childNodes.length > 0) body.appendChild(links);
        article.appendChild(body);
        col.appendChild(article);
        fragment.appendChild(col);
    });

    state.dom.grid.appendChild(fragment);
}

export async function initImageCards({ lang = 'ja', dataUrl = IMAGE_CARDS_MANIFEST_URL } = {}) {
    cacheDom();
    state.lang = normalizeLang(lang);
    state.generatedAt = '';
    state.cards = [];
    state.loadError = false;
    renderImageCards();

    try {
        const response = await fetch(dataUrl, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`image cards manifest load failed: ${response.status}`);
        }
        const payload = await response.json();
        state.generatedAt = typeof payload?.generated_at === 'string' ? payload.generated_at : '';
        state.cards = Array.isArray(payload?.cards) ? payload.cards : [];
        state.loadError = false;
    } catch (error) {
        state.generatedAt = '';
        state.cards = [];
        state.loadError = true;
        console.warn('[awareness-space][image-cards] load failed:', error);
    }

    renderImageCards();
}

export function setImageCardsLanguage(lang) {
    state.lang = normalizeLang(lang);
    renderImageCards();
}
