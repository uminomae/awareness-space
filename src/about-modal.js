import DOMPurify from 'dompurify';

import { normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

const state = {
    initialized: false,
    cache: new Map(),
    markedParser: null,
    requestId: 0,
    lastFocused: null,
    closeTimer: 0,
};

function getAboutStrings(lang) {
    return dict[normalizeLang(lang)]?.about || dict.ja.about;
}

async function getMarked() {
    if (!state.markedParser) {
        const { marked } = await import('marked');
        marked.setOptions({ breaks: true, gfm: true });
        state.markedParser = marked;
    }
    return state.markedParser;
}

function getDom() {
    return {
        trigger: document.getElementById('about-trigger'),
        modal: document.getElementById('about-overlay'),
        title: document.getElementById('about-overlay-title'),
        close: document.getElementById('about-close'),
        body: document.getElementById('about-body'),
    };
}

function isOpen(modal) {
    return Boolean(modal?.classList.contains('visible'));
}

function getMarkdownUrl(body, lang) {
    if (!body) return '';
    const normalized = normalizeLang(lang);
    return normalized === 'en' ? body.dataset.mdEn || '' : body.dataset.mdJa || '';
}

function setLoading(body, lang) {
    if (!body) return;
    body.innerHTML = `<p class="about-status">${getAboutStrings(lang).loading}</p>`;
}

function setError(body, lang) {
    if (!body) return;
    body.innerHTML = `<p class="about-status about-status--error">${getAboutStrings(lang).error}</p>`;
}

async function loadMarkdown(body, lang) {
    const normalized = normalizeLang(lang);
    if (state.cache.has(normalized)) {
        return state.cache.get(normalized);
    }

    const url = getMarkdownUrl(body, normalized);
    if (!url) {
        throw new Error(`Missing about markdown URL for ${normalized}`);
    }

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to load about markdown: HTTP ${response.status}`);
    }

    const raw = await response.text();
    state.cache.set(normalized, raw);
    return raw;
}

async function renderBody(lang) {
    const { body } = getDom();
    if (!body) return;

    const requestId = ++state.requestId;
    setLoading(body, lang);

    try {
        const [raw, marked] = await Promise.all([
            loadMarkdown(body, lang),
            getMarked(),
        ]);

        if (requestId !== state.requestId) return;
        const html = DOMPurify.sanitize(marked.parse(raw));
        body.innerHTML = html;
    } catch (error) {
        console.warn('[awareness-space] about markdown load failed:', error);
        if (requestId !== state.requestId) return;
        setError(body, lang);
    }
}

function openModal() {
    const lang = normalizeLang(document.documentElement.lang || 'ja');
    const { modal, close } = getDom();
    if (!modal || isOpen(modal)) return;

    state.lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    renderBody(lang).catch((error) => {
        console.warn('[awareness-space] about render failed:', error);
    });

    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('open');
            close?.focus();
        });
    });
}

function closeModal() {
    const { modal } = getDom();
    if (!modal || !isOpen(modal)) return;

    modal.classList.remove('open');

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        state.lastFocused?.focus?.();
        modal.removeEventListener('transitionend', finish);
        if (state.closeTimer) {
            window.clearTimeout(state.closeTimer);
            state.closeTimer = 0;
        }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish();
        return;
    }

    modal.addEventListener('transitionend', finish, { once: true });
    state.closeTimer = window.setTimeout(finish, 500);
}

export function openAboutModal() {
    openModal();
}

export function closeAboutModal() {
    closeModal();
}

export function initAboutModal(initialLang = 'ja') {
    if (state.initialized) {
        setAboutModalLanguage(initialLang);
        return;
    }

    const { modal } = getDom();
    if (!modal) return;

    state.initialized = true;
    setAboutModalLanguage(initialLang);
}

export function setAboutModalLanguage(lang) {
    const normalized = normalizeLang(lang);
    const { modal } = getDom();
    if (isOpen(modal)) {
        renderBody(normalized).catch((error) => {
            console.warn('[awareness-space] about rerender failed:', error);
        });
    }
}
