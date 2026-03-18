import { DEV_VERSION, DEV_VERSION_DATE } from './version.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { applySceneState, getDefaultSceneState, getScenePresetVersion } from './dev-panel-data.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initBackgroundModeSwitcher } from './background-mode.js';
import { bindStandaloneMarkdownLinks, initReports, setReportsLanguage } from './reports/index.js';

installStartupErrorHandlers();

const DEV_MESSAGE_SOURCE = 'awareness-space-dev-panel';

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
        setReportsLanguage(lang);
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
            if (!href || href === '#' || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function isDevMode() {
    return new URL(window.location.href).searchParams.has('dev');
}

function formatDevVersionLabel(version) {
    return typeof version === 'string' && version
        ? version.replace(/\.\d+$/, '')
        : '';
}

function applyDevChrome(devMode) {
    const versionNode = document.getElementById('dev-version-inline');
    const componentsLink = document.getElementById('dev-components-link');

    if (versionNode) {
        if (devMode) {
            versionNode.hidden = false;
            versionNode.textContent = formatDevVersionLabel(DEV_VERSION);
            versionNode.title = `${DEV_VERSION} / ${DEV_VERSION_DATE}`;
        } else {
            versionNode.hidden = true;
            versionNode.textContent = '';
        }
    }

    if (componentsLink) {
        componentsLink.classList.toggle('is-visible', devMode);
    }
}

function createDevStatsTicker() {
    let begin = () => {};
    let end = () => {};
    let rafId = 0;

    function tick() {
        begin();
        end();
        rafId = window.requestAnimationFrame(tick);
    }

    return {
        setHandlers(nextBegin, nextEnd) {
            begin = typeof nextBegin === 'function' ? nextBegin : (() => {});
            end = typeof nextEnd === 'function' ? nextEnd : (() => {});
        },
        start() {
            if (rafId) return;
            rafId = window.requestAnimationFrame(tick);
        },
    };
}

function start() {
    const devMode = isDevMode();
    const devStatsTicker = createDevStatsTicker();
    const sceneStateStore = createSceneStateStore({
        enabled: devMode,
        getPresetVersion: getScenePresetVersion,
    });
    const sceneStateCache = new Map();
    let activeDevPanel = null;

    function getSceneState(sceneVariant) {
        if (sceneStateCache.has(sceneVariant)) {
            return sceneStateCache.get(sceneVariant);
        }
        const restoredState = sceneStateStore.load(sceneVariant);
        const state = getDefaultSceneState(sceneVariant);
        if (restoredState) {
            applySceneState(state, restoredState, sceneVariant);
        }
        sceneStateCache.set(sceneVariant, state);
        return state;
    }

    function saveSceneState(sceneVariant, nextState) {
        const merged = getDefaultSceneState(sceneVariant);
        applySceneState(merged, nextState, sceneVariant);
        sceneStateCache.set(sceneVariant, merged);
        sceneStateStore.save(sceneVariant, merged);
        return merged;
    }

    function postSceneState(backgroundController, sceneVariant) {
        const frameWindow = backgroundController?.getFrameWindow?.();
        if (!frameWindow) return;
        frameWindow.postMessage({
            source: DEV_MESSAGE_SOURCE,
            type: 'dev:apply-state',
            variant: sceneVariant,
            state: getSceneState(sceneVariant),
        }, window.location.origin);
    }

    function mountDevPanel(backgroundController, sceneVariant) {
        if (activeDevPanel?.destroy) {
            activeDevPanel.destroy();
        }

        activeDevPanel = initDevPanelRuntime({
            sceneVariant,
            initialState: getSceneState(sceneVariant),
            onStateChanged: (nextState) => {
                saveSceneState(sceneVariant, nextState);
                if (backgroundController?.getCurrentMode?.() === sceneVariant) {
                    postSceneState(backgroundController, sceneVariant);
                }
            },
        });
    }

    initFontSizeCtrl();
    initMobileNavAutoCollapse();
    applyDevChrome(devMode);
    const backgroundController = initBackgroundModeSwitcher({
        onModeChange: (sceneVariant) => {
            if (!devMode) return;
            mountDevPanel(backgroundController, sceneVariant);
            postSceneState(backgroundController, sceneVariant);
        },
        onFrameLoad: (sceneVariant) => {
            if (!devMode) return;
            postSceneState(backgroundController, sceneVariant);
        },
    });
    initLanguageToggle();
    initScrollHints();
    initHashLinks();
    if (devMode) {
        devStatsTicker.start();
        initDevAuxTools({
            setStatsHandlers: (begin, end) => {
                devStatsTicker.setHandlers(begin, end);
            },
        });
        if (backgroundController?.getCurrentMode) {
            mountDevPanel(backgroundController, backgroundController.getCurrentMode());
        }
    }
    initReports().catch((error) => {
        console.error('[awareness-space] reports bootstrap failed:', error);
        showStartupErrorOverlay(error);
    });
    bindStandaloneMarkdownLinks();
}

try {
    start();
} catch (error) {
    console.error('[awareness-space] bootstrap failed:', error);
    showStartupErrorOverlay(error);
}
