// font-size-ctrl.js -- creation-space
// CHANGED(2026-03-07): shared topbar font-size control for creation-space

const STEP_REM = 0.1;
const DEFAULT_STEP = 0;
const MIN_STEP = -1;
const MAX_STEP = 7;
const STORAGE_KEY = 'kesson-font-step';
const MIGRATION_KEY = 'kesson-font-step-v5';

// Global UI font sizes (shell.css :root)
const FONT_VARS = {
    '--ds-font-size-ui-xs': 0.80,
    '--ds-font-size-ui-sm': 0.80,
};

const CLASS_VARS = {
    // -- Card & section --
    '--ds-section-heading': 0.80,
    '--ds-card-title': 0.80,
    '--ds-card-text': 0.80,
    '--ds-card-summary': 0.80,

    // -- Overlay & guide --
    '--ds-overlay-tagline': 0.80,
    '--ds-overlay-tagline-en': 0.80,
    '--ds-control-guide': 0.80,
    '--ds-surface-btn': 0.80,

    // -- Footer --
    '--ds-footer-line': 0.80,
    '--ds-footer-signature-size': 0.80,

    // -- Dev HUD --
    '--as-dev-hud-font-size': 0.80,

    // -- Topbar --
    '--as-topbar-link-size': 0.80,
    '--as-topbar-credit-size': 0.80,
    '--as-topbar-note-size': 0.80,
    '--as-topbar-meta-size': 0.80,
    '--as-topbar-meta-author-size': 0.80,
    '--as-topbar-subtitle-size-md': 0.80,
    '--as-topbar-title-size': 0.80,
    '--as-topbar-main-title-size': 0.96,
    '--as-topbar-main-title-size-sm': 0.86,

    // -- Hero h1 --
    '--ds-h1-size': 1.00,
};

function normalizeStep(step) {
    const parsed = Number.parseInt(String(step), 10);
    if (!Number.isFinite(parsed)) return DEFAULT_STEP;
    return Math.min(MAX_STEP, Math.max(MIN_STEP, parsed));
}

function getCurrentStep() {
    try {
        return normalizeStep(window.localStorage.getItem(STORAGE_KEY) ?? String(DEFAULT_STEP));
    } catch {
        return DEFAULT_STEP;
    }
}

function setStep(step) {
    const normalized = normalizeStep(step);
    try {
        window.localStorage.setItem(STORAGE_KEY, String(normalized));
    } catch {
        // Ignore storage failures and still apply the current session value.
    }
    applyStep(normalized);
}

function applyStep(step) {
    const normalized = normalizeStep(step);
    const root = document.documentElement;

    Object.entries(FONT_VARS).forEach(([varName, base]) => {
        root.style.setProperty(varName, `${(base + normalized * STEP_REM).toFixed(2)}rem`);
    });
    Object.entries(CLASS_VARS).forEach(([varName, base]) => {
        root.style.setProperty(varName, `${(base + normalized * STEP_REM).toFixed(2)}rem`);
    });

    root.style.setProperty('--reports-font-step', `${(normalized * STEP_REM).toFixed(2)}rem`);

    const down = document.getElementById('font-size-down');
    const up = document.getElementById('font-size-up');
    const reset = document.getElementById('font-size-reset');
    if (down) down.disabled = normalized <= MIN_STEP;
    if (up) up.disabled = normalized >= MAX_STEP;
    if (reset) reset.disabled = normalized === DEFAULT_STEP;
}

export function initFontSizeCtrl() {
    try {
        if (!window.localStorage.getItem(MIGRATION_KEY)) {
            // v5: DEFAULT_STEP changed from 3 to 0. Reset all users to new default.
            window.localStorage.setItem(STORAGE_KEY, String(DEFAULT_STEP));
            window.localStorage.setItem(MIGRATION_KEY, '1');
        }
    } catch {
        // Ignore storage failures and keep in-memory defaults.
    }
    applyStep(getCurrentStep());

    document.getElementById('font-size-down')?.addEventListener('click', () => {
        const current = getCurrentStep();
        if (current > MIN_STEP) setStep(current - 1);
    });
    document.getElementById('font-size-up')?.addEventListener('click', () => {
        const current = getCurrentStep();
        if (current < MAX_STEP) setStep(current + 1);
    });
    document.getElementById('font-size-reset')?.addEventListener('click', () => {
        setStep(DEFAULT_STEP);
    });
}
