const UI_THEME_VAR_MAP = Object.freeze({
    heroTitle: '--awareness-hero-title-rgb',
    heroTitleHover: '--awareness-hero-title-hover-rgb',
    heroTagline: '--awareness-hero-tagline-rgb',
    heroTaglineSub: '--awareness-hero-tagline-sub-rgb',
    uiText: '--awareness-ui-text-rgb',
    uiTextStrong: '--awareness-ui-text-strong-rgb',
});

function hexToRgbTriplet(hex) {
    if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex.trim())) return null;
    const normalized = hex.trim().slice(1);
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

export function applyUiThemeState(state) {
    const root = document.documentElement;
    Object.entries(UI_THEME_VAR_MAP).forEach(([key, cssVar]) => {
        const rgbTriplet = hexToRgbTriplet(state?.[key]);
        if (!rgbTriplet) return;
        root.style.setProperty(cssVar, rgbTriplet);
    });
}
