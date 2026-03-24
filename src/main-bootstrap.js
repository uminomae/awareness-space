import { applyMainDevChrome } from './main-dev-runtime.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { detectLang } from './i18n.js';
import { applyPageLanguage } from './page-language.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initScrollUI, refreshGuideLang } from './scroll-ui.js';

export function prepareMainBootstrap({
    devMode,
    devVersion,
    devDate,
} = {}) {
    initFontSizeCtrl();
    initMobileNavAutoCollapse();
    initScrollUI();
    applyMainDevChrome({
        devMode,
        devVersion,
        devDate,
    });

    const initialLang = detectLang();
    applyPageLanguage(initialLang);
    refreshGuideLang();

    return {
        initialLang,
    };
}
