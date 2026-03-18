const STATS_CDN = 'https://cdn.jsdelivr.net/npm/stats.js@0.17.0/build/stats.min.js';

let statsInstance = null;
let scriptPromise = null;

function loadStatsScript() {
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = STATS_CDN;
        script.onload = resolve;
        script.onerror = () => reject(new Error('stats.js load failed'));
        document.head.appendChild(script);
    });

    return scriptPromise;
}

export async function initDevStats() {
    if (statsInstance) return statsInstance;

    await loadStatsScript();
    if (typeof window.Stats === 'undefined') {
        throw new Error('Stats constructor not found after script load');
    }

    statsInstance = new window.Stats();
    statsInstance.showPanel(0);
    statsInstance.dom.classList.add('dev-fps-panel');
    statsInstance.dom.style.cssText = '';
    statsInstance.dom.dataset.panel = '0';
    document.body.appendChild(statsInstance.dom);

    statsInstance.dom.addEventListener('click', () => {
        const current = Number.parseInt(statsInstance.dom.dataset.panel || '0', 10);
        const next = Number.isFinite(current) ? (current + 1) % 3 : 0;
        statsInstance.showPanel(next);
        statsInstance.dom.dataset.panel = String(next);
    });

    return statsInstance;
}

export function statsBegin() {
    if (statsInstance) statsInstance.begin();
}

export function statsEnd() {
    if (statsInstance) statsInstance.end();
}
