import { toggles, breathConfig } from '../core/config.js';
import { requestScroll } from './scroll-coordinator.js';
import { pxFromViewportHeight } from '../nav/responsive.js';

const DIVE_SCROLL_VH = 1.5;

let _overlay;
let _credit;
let _controlGuide;
let _scrollHintBottom;
let _scrollHintTop;
let _surfaceBtn;
let _articlesSection;
let _graphicSwitcher;
let _devVersionInline;

let _cleanup = null;

export function initScrollUI() {
    _cleanup?.();

    _overlay = document.getElementById('overlay');
    _credit = document.getElementById('credit');
    _controlGuide = document.getElementById('control-guide');
    _scrollHintBottom = document.getElementById('scroll-hint');
    _scrollHintTop = document.getElementById('scroll-hint-top');
    _surfaceBtn = document.getElementById('surface-btn');
    _articlesSection = document.getElementById('articles-section');
    _graphicSwitcher = document.getElementById('graphic-switcher');
    _devVersionInline = document.getElementById('dev-version-inline');

    if (_surfaceBtn) {
        _surfaceBtn.addEventListener('click', scrollToTop);
    }
    if (_scrollHintTop) {
        _scrollHintTop.addEventListener('click', scrollToTop);
    }

    _cleanup = () => {
        if (_surfaceBtn) _surfaceBtn.removeEventListener('click', scrollToTop);
        if (_scrollHintTop) _scrollHintTop.removeEventListener('click', scrollToTop);
    };
}

export function destroyScrollUI() {
    _cleanup?.();
    _cleanup = null;
}

function scrollToTop() {
    requestScroll(0, 'scroll-ui:scroll-to-top', { behavior: 'smooth' });
}

export function refreshGuideLang() {
    // Guide text now follows the shared page-language data-i18n bindings.
}

function isNearBottom() {
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const nearBottomThresholdPx = pxFromViewportHeight(60, { minScale: 0.7, maxScale: 1.4 });
    return (docHeight - scrollBottom) < nearBottomThresholdPx;
}

export function getScrollProgress() {
    const diveScrollPx = window.innerHeight * DIVE_SCROLL_VH;
    return Math.min(1, window.scrollY / diveScrollPx);
}

export function updateScrollUI(scrollProg, breathVal) {
    const atTopThresholdPx = pxFromViewportHeight(20, { minScale: 0.7, maxScale: 1.4 });
    const atTop = window.scrollY < atTopThresholdPx;
    const atBottom = isNearBottom();
    const topFade = Math.max(0, 1 - scrollProg * 4);

    updateOverlayFade(scrollProg, breathVal);

    if (_credit) {
        _credit.style.opacity = topFade;
    }

    if (_controlGuide) {
        _controlGuide.style.opacity = topFade;
    }

    if (_graphicSwitcher) {
        _graphicSwitcher.style.opacity = topFade;
        _graphicSwitcher.style.pointerEvents = topFade < 0.1 ? 'none' : '';
    }

    if (_devVersionInline) {
        _devVersionInline.style.opacity = topFade;
    }

    if (_scrollHintBottom) {
        const showBottomHint = atTop && !atBottom;
        _scrollHintBottom.classList.toggle('visible', showBottomHint);
    }

    if (_scrollHintTop) {
        const showTop = !atTop && scrollProg > 0.15;
        if (showTop) {
            _scrollHintTop.classList.add('visible');
        } else {
            _scrollHintTop.classList.remove('visible');
        }
    }

    if (_surfaceBtn) {
        const showSurface = scrollProg > 0.8;
        _surfaceBtn.style.opacity = showSurface ? '1' : '0';
        _surfaceBtn.style.pointerEvents = showSurface ? 'auto' : 'none';
    }

    updateArticlesFocusability(scrollProg);
}

function updateArticlesFocusability(scrollProg) {
    if (!_articlesSection) return;

    const rect = _articlesSection.getBoundingClientRect();
    const windowH = window.innerHeight || document.documentElement.clientHeight;
    const isNearViewport = rect.top <= windowH * 0.9;
    const shouldEnable = scrollProg > 0.22 || isNearViewport;

    const focusables = _articlesSection.querySelectorAll('a[href], button:not([disabled]), [tabindex]');

    focusables.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        if (shouldEnable) {
            const prev = el.dataset.kessonPrevTabindex;
            if (prev === undefined) return;
            if (prev === '__none__') {
                el.removeAttribute('tabindex');
            } else {
                el.setAttribute('tabindex', prev);
            }
            delete el.dataset.kessonPrevTabindex;
            return;
        }

        if (el.dataset.kessonPrevTabindex === undefined) {
            el.dataset.kessonPrevTabindex = el.hasAttribute('tabindex')
                ? (el.getAttribute('tabindex') || '__none__')
                : '__none__';
        }
        el.setAttribute('tabindex', '-1');
    });
}

function updateOverlayFade(scrollProg, breathVal) {
    if (!_overlay) return;

    const scrollFade = Math.max(0, 1 - scrollProg * 3.3);

    if (toggles.htmlBreath && scrollFade > 0) {
        const opacity = breathConfig.htmlMinOpacity
            + breathVal * (breathConfig.htmlMaxOpacity - breathConfig.htmlMinOpacity);
        const blur = breathConfig.htmlMaxBlur * (1 - breathVal);
        const scale = breathConfig.htmlMinScale + breathVal * (1 - breathConfig.htmlMinScale);
        _overlay.style.opacity = opacity * scrollFade;
        _overlay.style.filter = `blur(${blur}px)`;
        _overlay.style.transform = `scale(${scale})`;
        _overlay.style.pointerEvents = '';
    } else if (scrollFade > 0) {
        _overlay.style.opacity = breathConfig.htmlMaxOpacity * scrollFade;
        _overlay.style.filter = 'none';
        _overlay.style.transform = 'scale(1)';
        _overlay.style.pointerEvents = '';
    } else {
        _overlay.style.opacity = '0';
        _overlay.style.pointerEvents = 'none';
    }
}
