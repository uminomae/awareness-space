import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initBackgroundModeSwitcher } from './background-mode.js';
import { initReportsCards } from './reports-cards.js';

installStartupErrorHandlers();

function initLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    const html = document.documentElement;
    if (!toggle) return;

    function applyLanguage(lang) {
        html.lang = lang;
        document.querySelectorAll('[data-ja][data-en]').forEach((node) => {
            node.textContent = lang === 'en' ? node.dataset.en : node.dataset.ja;
        });
        toggle.textContent = lang === 'en' ? '日本語' : 'English';
        toggle.setAttribute('aria-label', lang === 'en' ? 'Switch language to Japanese' : '言語を英語に切り替え');
    }

    let current = 'ja';
    applyLanguage(current);
    toggle.addEventListener('click', () => {
        current = current === 'ja' ? 'en' : 'ja';
        applyLanguage(current);
    });
}

function initScrollHints() {
    const hint = document.getElementById('scroll-hint');
    const hintTop = document.getElementById('scroll-hint-top');
    if (!hint || !hintTop) return;

    const update = () => {
        const y = window.scrollY || 0;
        hint.classList.toggle('visible', y < 120);
        hintTop.classList.toggle('visible', y >= 320);
    };

    hintTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initHashLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function start() {
    initFontSizeCtrl();
    initMobileNavAutoCollapse();
    initBackgroundModeSwitcher();
    initLanguageToggle();
    initScrollHints();
    initHashLinks();
    initReportsCards();
}

try {
    start();
} catch (error) {
    console.error('[awareness-space] bootstrap failed:', error);
    showStartupErrorOverlay(error);
}
