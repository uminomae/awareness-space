import { normalizeLang } from './i18n.js';
import { formatDate, hasText } from './reports/data.js';
import { getReportsStrings } from './reports/render.js';

const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const AWARENESS_PATH = '/assets/awareness';
const LOCAL_AWARENESS_PATH = '/__pjdhiro/assets/awareness';
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

function getCurrentLocation() {
    return typeof window !== 'undefined' ? window.location : null;
}

export function shouldUseLocalAwarenessAssets(locationLike = getCurrentLocation()) {
    if (!locationLike) return false;
    const params = new URLSearchParams(locationLike.search || '');
    const override = (params.get('assets') || '').trim().toLowerCase();
    if (override === 'local') return true;
    if (override === 'remote') return false;
    return locationLike.hostname === 'localhost' || locationLike.hostname === '127.0.0.1';
}

function getLocationOrigin(locationLike = getCurrentLocation()) {
    if (!locationLike) return '';
    if (typeof locationLike.origin === 'string' && locationLike.origin) return locationLike.origin;
    if (typeof locationLike.protocol === 'string' && typeof locationLike.host === 'string') {
        return `${locationLike.protocol}//${locationLike.host}`;
    }
    return '';
}

export function resolveImageCardsManifestUrl(locationLike = getCurrentLocation()) {
    if (shouldUseLocalAwarenessAssets(locationLike)) {
        return `${getLocationOrigin(locationLike)}${LOCAL_AWARENESS_PATH}/manifests/image-cards.json`;
    }
    return IMAGE_CARDS_MANIFEST_URL;
}

export function resolveImageCardsAssetBaseUrl(locationLike = getCurrentLocation()) {
    if (shouldUseLocalAwarenessAssets(locationLike)) {
        return `${getLocationOrigin(locationLike)}${LOCAL_AWARENESS_PATH}`;
    }
    return PJDHIRO_AWARENESS_PAGES;
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

export function buildImageCardModalHtml(card, lang = 'ja') {
    const copy = localizeImageCard(card, lang);
    const imageUrl = resolvePublishedAssetUrl(card.image);
    const strings = getStrings(lang);
    const parts = [];

    if (imageUrl) {
        parts.push(`
            <figure class="awareness-image-modal-figure mb-3">
                <img src="${imageUrl}" alt="${copy.alt}" class="img-fluid rounded">
            </figure>
        `);
    }

    parts.push(`<p class="awareness-image-card-comment mb-0">${copy.comment}</p>`);

    const linkParts = [];
    if (imageUrl) {
        linkParts.push(`<a href="${imageUrl}" target="_blank" rel="noopener">${strings.openImage}</a>`);
    }
    if (hasText(card?.source_url)) {
        linkParts.push(`<a href="${card.source_url.trim()}" target="_blank" rel="noopener">${strings.openSource}</a>`);
    }
    if (linkParts.length) {
        parts.push(`<p class="mt-3 mb-0 d-flex flex-wrap gap-3">${linkParts.join('')}</p>`);
    }

    return parts.join('');
}

function resolvePublishedAssetUrl(relativePath = '') {
    if (!relativePath) return '';
    return `${resolveImageCardsAssetBaseUrl()}/${relativePath.replace(/^\/+/, '')}`;
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
        col.className = 'col card-column';

        const article = document.createElement('article');
        article.className = 'img-card';
        article.setAttribute('role', 'button');
        article.setAttribute('tabindex', '0');

        const copy = localizeImageCard(card, state.lang);
        const imageUrl = resolvePublishedAssetUrl(card.image);
        if (imageUrl) {
            const img = document.createElement('img');
            img.className = 'img-card-media';
            img.src = imageUrl;
            img.alt = copy.alt;
            article.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'img-card-body';

        const kicker = document.createElement('div');
        kicker.className = 'img-card-kicker';
        kicker.textContent = 'Interpretation';

        const title = document.createElement('h3');
        title.className = 'img-card-title';
        title.textContent = copy.title;

        const comment = document.createElement('p');
        comment.className = 'img-card-text';
        comment.textContent = copy.comment;

        body.append(kicker, title, comment);
        article.appendChild(body);

        const openModal = () => {
            const reportStrings = getReportsStrings(state.lang);
            const metaParts = [];
            if (hasText(card?.generator_model)) {
                metaParts.push(`${reportStrings.modalModel}: ${card.generator_model}`);
            }
            if (hasText(card?.generated)) {
                metaParts.push(`${reportStrings.modalGenerated}: ${formatDate(card.generated)}`);
            }

            import('./reports/index.js')
                .then(({ openReportsHtmlModal }) => {
                    openReportsHtmlModal({
                        title: copy.title,
                        html: buildImageCardModalHtml(card, state.lang),
                        metaParts,
                        hidePdfButton: true,
                    });
                })
                .catch((error) => {
                    console.warn('[awareness-space][image-cards] modal open failed:', error);
                });
        };

        article.addEventListener('click', openModal);
        article.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openModal();
        });

        col.appendChild(article);
        fragment.appendChild(col);
    });

    state.dom.grid.appendChild(fragment);
}

export async function initImageCards({ lang = 'ja', dataUrl = resolveImageCardsManifestUrl() } = {}) {
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
