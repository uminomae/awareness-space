import { applySceneState, getDefaultSceneState } from './dev-panel-data.js';
import { initAboutModal, setAboutModalLanguage } from './about-modal.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';
import { bindAppEvents } from './events.js';
import { createMainDevStatsTicker } from './main-dev-runtime.js';
import { prepareMainBootstrap } from './main-bootstrap.js';
import { initBackgroundModeSwitcher } from './background-mode.js';
import { syncControlGuideVisibility } from './control-guide.js';
import { initImageCards, setImageCardsLanguage } from './image-cards.js';
import { LANG_CHANGE_EVENT } from './i18n.js';
import { applyPageLanguage } from './page-language.js';
import { bindStandaloneMarkdownLinks, initReports, setReportsLanguage } from './reports/index.js';
import { breathValue } from './animation-utils.js';
import { breathConfig } from './config.js';
import { requestScroll } from './scroll-coordinator.js';
import { getScrollProgress, updateScrollUI } from './scroll-ui.js';
import { applyUiThemeState } from './ui-theme.js';

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

export async function runMainOrchestrator({
    runtimeContext,
    devVersion,
    devDate,
}) {
    const { devMode = false, sceneStateStore = null } = runtimeContext || {};
    const devStatsTicker = createMainDevStatsTicker();
    const sceneStateCache = new Map();
    let activeDevPanel = null;

    function getSceneState(sceneVariant) {
        if (sceneStateCache.has(sceneVariant)) {
            return sceneStateCache.get(sceneVariant);
        }
        const restoredState = sceneStateStore?.load?.(sceneVariant) ?? null;
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
        sceneStateStore?.save?.(sceneVariant, merged);
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

    const { initialLang } = prepareMainBootstrap({
        devMode,
        devVersion,
        devDate,
    });

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

    initAboutModal(initialLang);
    setReportsLanguage(initialLang);
    initImageCards({ lang: initialLang }).catch((error) => {
        console.error('[awareness-space] image cards bootstrap failed:', error);
    });

    window.addEventListener(LANG_CHANGE_EVENT, (event) => {
        const lang = event.detail?.lang || initialLang;
        applyPageLanguage(lang);
        setAboutModalLanguage(lang);
        setReportsLanguage(lang);
        setImageCardsLanguage(lang);
    });

    bindAppEvents();

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
        throw error;
    });
    bindStandaloneMarkdownLinks();
}
