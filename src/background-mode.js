const DEFAULT_MODE = 'raijin';
const MODES = new Set(['raijin', 'uzu']);

function normalizeMode(mode) {
    if (mode === 'flow') return 'raijin';
    return MODES.has(mode) ? mode : DEFAULT_MODE;
}

function syncModeQuery(mode) {
    if (!window.history?.replaceState) return;
    const url = new URL(window.location.href);
    url.searchParams.set('graphic', normalizeMode(mode));
    window.history.replaceState(window.history.state, '', url.toString());
}

function setButtonState(mode) {
    const normalized = normalizeMode(mode);
    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        const isActive = button.dataset.graphicMode === normalized;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function createBackgroundFrame() {
    const container = document.getElementById('canvas-container');
    if (!(container instanceof HTMLElement)) return null;

    let frame = document.getElementById('background-frame');
    if (frame instanceof HTMLIFrameElement) return frame;

    frame = document.createElement('iframe');
    frame.id = 'background-frame';
    frame.className = 'background-frame';
    frame.setAttribute('title', 'Awareness background');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    container.appendChild(frame);
    return frame;
}

function resolveBackgroundSrc(mode) {
    const normalized = normalizeMode(mode);
    const filename = normalized === 'uzu' ? 'uzu.html' : 'kitai.html';
    const url = new URL(`./src/backgrounds/${filename}`, window.location.href);
    if (normalized !== 'uzu') {
        url.searchParams.set('variant', normalized);
    }
    return url.toString();
}

export function initBackgroundModeSwitcher() {
    const frame = createBackgroundFrame();
    if (!(frame instanceof HTMLIFrameElement)) return;

    const initial = normalizeMode(new URL(window.location.href).searchParams.get('graphic') || DEFAULT_MODE);
    frame.src = resolveBackgroundSrc(initial);
    setButtonState(initial);
    syncModeQuery(initial);

    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        button.addEventListener('click', () => {
            const next = normalizeMode(button.dataset.graphicMode);
            if (frame.dataset.mode === next) {
                setButtonState(next);
                syncModeQuery(next);
                return;
            }
            frame.dataset.mode = next;
            frame.src = resolveBackgroundSrc(next);
            setButtonState(next);
            syncModeQuery(next);
        });
    });
}
