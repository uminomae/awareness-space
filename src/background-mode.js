export const DEFAULT_MODE = 'raijin';
export const AVAILABLE_BACKGROUND_MODES = ['raijin'];
const MODES = new Set(AVAILABLE_BACKGROUND_MODES);

export function normalizeMode(mode) {
    if (mode === 'flow' || mode === 'uzu') return 'raijin';
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
    const filename = 'kitai.html';
    const url = new URL(`./src/backgrounds/${filename}`, window.location.href);
    url.searchParams.set('variant', normalized);
    return url.toString();
}

export function initBackgroundModeSwitcher(options = {}) {
    const onModeChange = typeof options.onModeChange === 'function' ? options.onModeChange : null;
    const onFrameLoad = typeof options.onFrameLoad === 'function' ? options.onFrameLoad : null;
    const frame = createBackgroundFrame();
    if (!(frame instanceof HTMLIFrameElement)) return;

    function getCurrentMode() {
        return normalizeMode(frame.dataset.mode || DEFAULT_MODE);
    }

    function applyMode(nextMode, { emitChange = true } = {}) {
        const normalized = normalizeMode(nextMode);
        if (frame.dataset.mode === normalized && frame.src === resolveBackgroundSrc(normalized)) {
            setButtonState(normalized);
            syncModeQuery(normalized);
            return;
        }
        frame.dataset.mode = normalized;
        frame.src = resolveBackgroundSrc(normalized);
        setButtonState(normalized);
        syncModeQuery(normalized);
        if (emitChange && onModeChange) {
            onModeChange(normalized, { frame });
        }
    }

    frame.addEventListener('load', () => {
        if (onFrameLoad) {
            onFrameLoad(getCurrentMode(), { frame });
        }
    });

    const initial = normalizeMode(new URL(window.location.href).searchParams.get('graphic') || DEFAULT_MODE);
    applyMode(initial, { emitChange: false });

    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        button.addEventListener('click', () => {
            const next = normalizeMode(button.dataset.graphicMode);
            applyMode(next);
        });
    });

    return {
        frame,
        getCurrentMode,
        setMode(nextMode) {
            applyMode(nextMode);
        },
        getFrameWindow() {
            return frame.contentWindow;
        },
    };
}
