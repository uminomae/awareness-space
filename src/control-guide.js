export const MODES_WITHOUT_CONTROL_GUIDE = new Set(['raijin', 'uzu']);

export function shouldShowControlGuide(mode) {
    return !MODES_WITHOUT_CONTROL_GUIDE.has(mode);
}

export function syncControlGuideVisibility(mode, doc = document) {
    const guide = doc.getElementById('control-guide');
    if (!guide || typeof guide.setAttribute !== 'function') return false;
    const visible = shouldShowControlGuide(mode);
    guide.hidden = !visible;
    guide.setAttribute('aria-hidden', visible ? 'false' : 'true');
    return visible;
}
