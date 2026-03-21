import { DEV_VERSION, DEV_VERSION_DATE } from './version.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { applySceneState, getDefaultSceneState, getScenePresetVersion } from './dev-panel-data.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initBackgroundModeSwitcher } from './background-mode.js';
import { syncControlGuideVisibility } from './control-guide.js';
import { detectLang } from './i18n.js';
import { applyPageLanguage, initLanguageToggle } from './page-language.js';
import { bindStandaloneMarkdownLinks, initReports, setReportsLanguage } from './reports/index.js';
import { breathValue } from './animation-utils.js';
import { breathConfig } from './config.js';
import { requestScroll } from './scroll-coordinator.js';
import { getScrollProgress, initScrollUI, refreshGuideLang, updateScrollUI } from './scroll-ui.js';
import { applyUiThemeState } from './ui-theme.js';

installStartupErrorHandlers();

const DEV_MESSAGE_SOURCE = 'awareness-space-dev-panel';

function initHashLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            const topbar = document.getElementById('kesson-topbar');
            const topbarOffset = topbar instanceof HTMLElement ? topbar.offsetHeight + 8 : 0;
            const targetY = target.getBoundingClientRect().top + window.scrollY - topbarOffset;
            requestScroll(targetY, `hash-link:${href}`, { behavior: 'smooth' });
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

function startScrollUiLoop() {
    let frameId = 0;
    const startedAt = performance.now();

    function frame() {
        const elapsedSeconds = (performance.now() - startedAt) / 1000;
        updateScrollUI(getScrollProgress(), breathValue(elapsedSeconds, breathConfig.period));
        frameId = window.requestAnimationFrame(frame);
    }

    frame();

    return () => {
        if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
        }
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

    function applySceneUiTheme(sceneVariant) {
        applyUiThemeState(getSceneState(sceneVariant));
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
                const merged = saveSceneState(sceneVariant, nextState);
                if (backgroundController?.getCurrentMode?.() === sceneVariant) {
                    applyUiThemeState(merged);
                    postSceneState(backgroundController, sceneVariant);
                }
            },
        });
    }

    initFontSizeCtrl();
    initMobileNavAutoCollapse();
    initScrollUI();
    applyDevChrome(devMode);
    const backgroundController = initBackgroundModeSwitcher({
        onModeChange: (sceneVariant) => {
            syncControlGuideVisibility(sceneVariant);
            applySceneUiTheme(sceneVariant);
            if (!devMode) return;
            mountDevPanel(backgroundController, sceneVariant);
            postSceneState(backgroundController, sceneVariant);
        },
        onFrameLoad: (sceneVariant) => {
            syncControlGuideVisibility(sceneVariant);
            if (backgroundController?.getCurrentMode?.() === sceneVariant) {
                applySceneUiTheme(sceneVariant);
            }
            if (!devMode) return;
            postSceneState(backgroundController, sceneVariant);
        },
    });
    if (backgroundController?.getCurrentMode) {
        applySceneUiTheme(backgroundController.getCurrentMode());
        syncControlGuideVisibility(backgroundController.getCurrentMode());
    }
    const initialLang = detectLang();
    applyPageLanguage(initialLang);
    setReportsLanguage(initialLang);
    refreshGuideLang();
    initLanguageToggle(initialLang, (lang) => {
        applyPageLanguage(lang);
        setReportsLanguage(lang);
        refreshGuideLang();
    });
    startScrollUiLoop();
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
