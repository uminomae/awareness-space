import { normalizeLang } from './i18n.js';
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

function resolvePathValue(source, path) {
    if (!source || !path) return undefined;
    return path.split('.').reduce((value, key) => {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
            return value[key];
        }
        return undefined;
    }, source);
}

function applyTextBindings(doc, strings) {
    doc.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        const value = resolvePathValue(strings, key);
        if (typeof value === 'string') {
            node.textContent = value;
        }
    });

    doc.querySelectorAll('*').forEach((node) => {
        node.getAttributeNames()
            .filter((name) => name.startsWith('data-i18n-attr-'))
            .forEach((name) => {
                const attrName = name.slice('data-i18n-attr-'.length);
                const key = node.getAttribute(name);
                const value = resolvePathValue(strings, key);
                if (typeof value === 'string') {
                    node.setAttribute(attrName, value);
                }
            });
    });
}

export function applyPageLanguageToDocument(doc, lang) {
    const normalized = normalizeLang(lang);
    const strings = dict[normalized]?.page || dict.ja.page;
    const aboutStrings = dict[normalized]?.about || dict.ja.about;

    const titleH1 = doc.getElementById('title-h1');
    const topbar = doc.getElementById('kesson-topbar');
    const topbarMainTitle = doc.getElementById('topbar-main-title');
    const topbarToggle = doc.querySelector('#kesson-topbar .navbar-toggler');
    const topbarFontSizeCtrl = doc.querySelector('#kesson-topbar .topbar-font-size-ctrl');
    const topbarHomeLink = doc.getElementById('topbar-home-link');
    const topbarCreationLink = doc.getElementById('topbar-creation-link');
    const topbarCollab = doc.getElementById('credit-collab');
    const footerSignature = doc.getElementById('footer-signature');
    const langToggle = doc.getElementById('lang-toggle');
    const graphicSwitcher = doc.getElementById('graphic-switcher');
    const graphicSwitcherLabel = doc.querySelector('.graphic-switcher-label');
    const graphicRaijinButton = doc.querySelector('[data-graphic-mode="raijin"]');
    const reportsAiNotice = doc.getElementById('reports-ai-notice');
    const modelSectionHeading = doc.getElementById('model-section-heading');
    const reportsSectionHeading = doc.getElementById('reports-section-heading');
    const offcanvasSectionsTitle = doc.getElementById('offcanvas-sections-title');
    const offcanvasModelLink = doc.getElementById('offcanvas-model-link');
    const aboutTrigger = doc.getElementById('about-trigger');
    const aboutModalTitle = doc.getElementById('about-overlay-title');
    const aboutClose = doc.getElementById('about-close');

    applyTextBindings(doc, strings);

    setText(titleH1, strings.title);
    setText(topbarMainTitle, strings.topbarMainTitle);
    setText(topbarCollab, strings.topbarCollab);
    setText(footerSignature, strings.creditSignature);
    setText(graphicSwitcherLabel, strings.graphicSwitcherLabel);
    setText(graphicRaijinButton, strings.graphicModeRaijin);
    setText(reportsAiNotice, strings.reportsAiNotice);
    setText(modelSectionHeading, strings.modelSectionHeading);
    setText(offcanvasSectionsTitle, strings.offcanvasSectionsTitle);
    setText(offcanvasModelLink, strings.offcanvasModelLink);
    setText(aboutModalTitle, aboutStrings.modalTitle);

    setAttr(topbar, 'aria-label', strings.topbarNavAria);
    setAttr(topbarToggle, 'aria-label', strings.topbarToggleAria);
    setAttr(topbarFontSizeCtrl, 'aria-label', strings.topbarFontSizeAria);
    setAttr(graphicSwitcher, 'aria-label', strings.graphicSwitcherAria);
    setAttr(langToggle, 'aria-label', strings.langToggleAria);
    setAttr(topbarHomeLink, 'aria-label', strings.topbarHomeAria);
    setAttr(topbarCreationLink, 'aria-label', strings.topbarCreationAria);
    setAttr(modelSectionHeading, 'aria-label', strings.modelSectionHeadingAria);
    setAttr(reportsSectionHeading, 'aria-label', strings.reportsSectionHeadingAria);
    setAttr(offcanvasModelLink, 'aria-label', strings.offcanvasModelAria);
    setAttr(aboutTrigger, 'aria-label', aboutStrings.triggerAria);
    setAttr(aboutClose, 'aria-label', aboutStrings.closeAria);
    setText(langToggle, strings.langToggleLabel);

    doc.documentElement.lang = normalized;
    doc.title = strings.documentTitle;
}

export function applyPageLanguage(lang) {
    applyPageLanguageToDocument(document, lang);
}
