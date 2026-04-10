import { switchLang } from '../i18n.js';
import { closeAboutModal, openAboutModal } from '../about-modal.js';
import {
    collapseMobileNavForClickTarget,
    collapseMobileNavOnOutsideClick,
} from '../topbar-nav.js';

export function bindAppEvents() {
    function handleDocumentClick(event) {
        const target = event.target;
        if (!(target instanceof Element)) return;

        if (target.closest('[data-modal-open="about"]')) {
            openAboutModal();
            return;
        }

        if (target.closest('[data-about-close]')) {
            closeAboutModal();
            return;
        }

        const langButton = target.closest('[data-lang-button]');
        if (langButton) {
            switchLang();
            collapseMobileNavForClickTarget(langButton);
            return;
        }

        if (collapseMobileNavForClickTarget(target)) {
            return;
        }

        collapseMobileNavOnOutsideClick(target);
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeAboutModal();
        }
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('keydown', handleKeydown);
    };
}
