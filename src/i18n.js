const LANG_JA = 'ja';
const LANG_EN = 'en';

export function normalizeLang(lang) {
    return lang === LANG_EN ? LANG_EN : LANG_JA;
}

export function detectLang() {
    return normalizeLang(document.documentElement.lang);
}
