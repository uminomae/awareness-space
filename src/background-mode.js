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

const MODULE_MAP = {
    raijin: () => import('./backgrounds/kitai.js'),
};

let activeModule = null;
let activeMode = null;

async function loadBackground(mode, container) {
    const normalized = normalizeMode(mode);
    const loader = MODULE_MAP[normalized];
    if (!loader) return null;

    if (activeModule?.cleanup) {
        activeModule.cleanup();
    }

    const mod = await loader();
    mod.init(container);
    activeModule = mod;
    activeMode = normalized;
    return mod;
}

export function initBackgroundModeSwitcher(options = {}) {
    const onModeChange = typeof options.onModeChange === 'function' ? options.onModeChange : null;
    const onLoad = typeof options.onLoad === 'function' ? options.onLoad : null;
    const container = document.getElementById('canvas-container');
    if (!(container instanceof HTMLElement)) return;

    function getCurrentMode() {
        return activeMode || DEFAULT_MODE;
    }

    async function applyMode(nextMode, { emitChange = true } = {}) {
        const normalized = normalizeMode(nextMode);
        if (activeMode === normalized) {
            setButtonState(normalized);
            syncModeQuery(normalized);
            return;
        }
        setButtonState(normalized);
        syncModeQuery(normalized);

        await loadBackground(normalized, container);

        if (emitChange && onModeChange) {
            onModeChange(normalized);
        }
        if (onLoad) {
            onLoad(normalized);
        }
    }

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
        getCurrentMode,
        setMode(nextMode) {
            applyMode(nextMode);
        },
        applyState(nextState) {
            if (activeModule?.applyState) {
                activeModule.applyState(nextState);
            }
        },
    };
}
