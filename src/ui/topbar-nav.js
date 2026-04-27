const TOPBAR_ACTUAL_HEIGHT_VAR = '--as-topbar-actual-height';

function syncTopbarHeight() {
    const topbar = document.getElementById('kesson-topbar');
    if (!topbar) return;
    document.documentElement.style.setProperty(
        TOPBAR_ACTUAL_HEIGHT_VAR,
        `${topbar.offsetHeight}px`,
    );
}

export function initMobileNavAutoCollapse() {
    const nav = document.getElementById('kessonTopbarNav');
    if (!nav) return;

    syncTopbarHeight();
    window.addEventListener('resize', syncTopbarHeight);
    window.addEventListener('kesson:font-step-change', syncTopbarHeight);
    nav.addEventListener('shown.bs.collapse', syncTopbarHeight);
    nav.addEventListener('hidden.bs.collapse', syncTopbarHeight);
}

function getNavCollapse() {
    const nav = document.getElementById('kessonTopbarNav');
    if (!nav) return null;
    const collapseApi = window.bootstrap?.Collapse;
    if (!collapseApi) return null;
    return collapseApi.getOrCreateInstance(nav, { toggle: false });
}

export function collapseMobileNav() {
    if (window.innerWidth >= 1200) return false;
    const collapse = getNavCollapse();
    if (!collapse) return false;
    collapse.hide();
    return true;
}

export function collapseMobileNavForClickTarget(target) {
    if (!(target instanceof Element)) return false;
    if (!target.closest('#kessonTopbarNav .nav-link, #kessonTopbarNav [data-bs-toggle="offcanvas"]')) {
        return false;
    }
    return collapseMobileNav();
}

export function collapseMobileNavOnOutsideClick(target) {
    if (!(target instanceof Element)) return false;

    const nav = document.getElementById('kessonTopbarNav');
    if (!nav?.classList.contains('show')) return false;

    const topbar = document.getElementById('kesson-topbar');
    if (topbar?.contains(target)) return false;

    return collapseMobileNav();
}
