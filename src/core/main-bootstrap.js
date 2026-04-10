import { applyMainDevChrome } from '../dev/main-dev-runtime.js';
import { initFontSizeCtrl } from '../ui/font-size-ctrl.js';
import { detectLang } from '../i18n.js';
import { applyPageLanguage } from '../page-language.js';
import { initMobileNavAutoCollapse } from '../ui/topbar-nav.js';
import { initScrollUI } from '../ui/scroll-ui.js';

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

    return {
        initialLang,
    };
}
