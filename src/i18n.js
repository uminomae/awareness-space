const LANG_JA = 'ja';
const LANG_EN = 'en';
export const LANG_CHANGE_EVENT = 'lang-change';

export function normalizeLang(lang) {
    return lang === LANG_EN ? LANG_EN : LANG_JA;
}

export function detectLang() {
    const raw = new URLSearchParams(window.location.search).get('lang');
    if (raw) return normalizeLang(raw);
    return normalizeLang(document.documentElement.lang);
}

export function syncLangQuery(lang) {
    if (!window.history?.replaceState) return;
    const normalized = normalizeLang(lang);
    const url = new URL(window.location.href);
    if (normalized === LANG_EN) {
        url.searchParams.set('lang', LANG_EN);
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState(window.history.state, '', url.toString());
}

export function setLang(lang, { syncQuery = true } = {}) {
    const normalized = normalizeLang(lang);
    const previous = detectLang();

    if (syncQuery) {
        syncLangQuery(normalized);
    }

    document.documentElement.lang = normalized;

    if (previous !== normalized) {
        window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, {
            detail: { lang: normalized, previous },
        }));
    }

    return normalized;
}

export function switchLang() {
    return setLang(detectLang() === LANG_JA ? LANG_EN : LANG_JA);
}
