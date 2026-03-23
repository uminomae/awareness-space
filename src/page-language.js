import { normalizeLang, syncLangQuery } from './i18n.js';
import { dict } from './i18n/dict.js';

function setText(node, value) {
    if (node && typeof value === 'string') {
        node.textContent = value;
    }
}

function setAttr(node, name, value) {
    if (node && typeof value === 'string') {
        node.setAttribute(name, value);
    }
}

export function applyPageLanguageToDocument(doc, lang) {
    const normalized = normalizeLang(lang);
    const strings = dict[normalized]?.page || dict.ja.page;

    const titleH1 = doc.getElementById('title-h1');
    const topbar = doc.getElementById('kesson-topbar');
    const topbarMainTitle = doc.getElementById('topbar-main-title');
    const topbarToggle = doc.querySelector('#kesson-topbar .navbar-toggler');
    const topbarFontSizeCtrl = doc.querySelector('#kesson-topbar .topbar-font-size-ctrl');
    const topbarHomeLink = doc.getElementById('topbar-home-link');
    const topbarCreationLink = doc.getElementById('topbar-creation-link');
    const topbarReportsLink = doc.getElementById('topbar-reports-link');
    const topbarCollab = doc.getElementById('credit-collab');
    const footerSignature = doc.getElementById('footer-signature');
    const langToggle = doc.getElementById('lang-toggle');
    const graphicSwitcher = doc.getElementById('graphic-switcher');
    const graphicSwitcherLabel = doc.querySelector('.graphic-switcher-label');
    const graphicRaijinButton = doc.querySelector('[data-graphic-mode="raijin"]');
    const reportsAiNotice = doc.getElementById('reports-ai-notice');
    const modelSummaryNote = doc.getElementById('model-summary-note');
    const modelSectionHeading = doc.getElementById('model-section-heading');
    const reportsSectionHeading = doc.getElementById('reports-section-heading');
    const offcanvasSectionsTitle = doc.getElementById('offcanvas-sections-title');
    const offcanvasModelLink = doc.getElementById('offcanvas-model-link');
    const offcanvasResearchLink = doc.getElementById('offcanvas-research-link');

    doc.querySelectorAll('[data-ja][data-en]').forEach((node) => {
        node.textContent = normalized === 'en' ? node.dataset.en : node.dataset.ja;
    });

    setText(titleH1, strings.title);
    setText(topbarMainTitle, strings.topbarMainTitle);
    setText(topbarReportsLink, strings.topbarReportsLabel);
    setText(topbarCollab, strings.topbarCollab);
    setText(footerSignature, strings.creditSignature);
    setText(graphicSwitcherLabel, strings.graphicSwitcherLabel);
    setText(graphicRaijinButton, strings.graphicModeRaijin);
    setText(reportsAiNotice, strings.reportsAiNotice);
    setText(modelSummaryNote, strings.modelSummaryNote);
    setText(modelSectionHeading, strings.modelSectionHeading);
    setText(offcanvasSectionsTitle, strings.offcanvasSectionsTitle);
    setText(offcanvasModelLink, strings.offcanvasModelLink);
    setText(offcanvasResearchLink, strings.offcanvasResearchLink);

    setAttr(topbar, 'aria-label', strings.topbarNavAria);
    setAttr(topbarToggle, 'aria-label', strings.topbarToggleAria);
    setAttr(topbarFontSizeCtrl, 'aria-label', strings.topbarFontSizeAria);
    setAttr(graphicSwitcher, 'aria-label', strings.graphicSwitcherAria);
    setAttr(langToggle, 'aria-label', strings.langToggleAria);
    setAttr(topbarHomeLink, 'aria-label', strings.topbarHomeAria);
    setAttr(topbarCreationLink, 'aria-label', strings.topbarCreationAria);
    setAttr(topbarReportsLink, 'aria-label', strings.topbarReportsAria);
    setAttr(modelSectionHeading, 'aria-label', strings.modelSectionHeadingAria);
    setAttr(reportsSectionHeading, 'aria-label', strings.reportsSectionHeadingAria);
    setAttr(offcanvasModelLink, 'aria-label', strings.offcanvasModelAria);
    setAttr(offcanvasResearchLink, 'aria-label', strings.offcanvasResearchAria);
    setText(langToggle, strings.langToggleLabel);

    doc.documentElement.lang = normalized;
    doc.title = strings.documentTitle;
}

export function applyPageLanguage(lang) {
    applyPageLanguageToDocument(document, lang);
}

export function initLanguageToggle(initialLang, onLanguageChanged) {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    let currentLang = normalizeLang(initialLang);
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ja' ? 'en' : 'ja';
        syncLangQuery(currentLang);
        if (typeof onLanguageChanged === 'function') {
            onLanguageChanged(currentLang);
        }
    });
}
