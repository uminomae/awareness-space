import { initDevPanel } from './dev-panel.js';

export function initDevAuxTools({ setStatsHandlers } = {}) {
    import('./dev-links-panel.js').then(({ initDevLinksPanel }) => {
        initDevLinksPanel();
    }).catch((error) => {
        console.warn('[dev-links] init failed:', error.message);
    });

    import('./dev-stats.js').then(({ initDevStats, statsBegin, statsEnd }) => {
        if (typeof setStatsHandlers === 'function') {
            setStatsHandlers(statsBegin, statsEnd);
        }
        initDevStats().catch((error) => {
            console.warn('[dev-stats] init failed:', error.message);
        });
    }).catch((error) => {
        console.warn('[dev-stats] import failed:', error.message);
    });
}

export function initDevPanelRuntime({
    sceneVariant,
    initialState,
    onStateChanged,
}) {
    return initDevPanel({
        sceneVariant,
        panelStartsOpen: false,
        initialState,
        onStateChanged,
    });
}
