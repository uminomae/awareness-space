import DOMPurify from 'dompurify';

import {
    formatDate,
    hasText,
    looksLikeHtmlDocument,
    normalizeModalSources,
    parseFrontmatter,
    resolveFirstAvailablePdfUrl,
} from './data.js';

function rewriteRelativeUrls(html, baseUrl) {
    if (!baseUrl) return html;
    return html
        .replace(/(<img\s+[^>]*src=")(?!https?:\/\/|data:|\/)([^"]+)(")/gi, (match, prefix, rel, suffix) => {
            return `${prefix}${new URL(rel, baseUrl).href}${suffix}`;
        })
        .replace(/(<a\s+[^>]*href=")(?!https?:\/\/|mailto:|tel:|#|\/)([^"]+)(")/gi, (match, prefix, rel, suffix) => {
            return `${prefix}${new URL(rel, baseUrl).href}${suffix}`;
        });
}

export function createReportsModalController({
    state,
    getStrings,
    setActiveDomainModalState,
}) {
    let markedParser = null;

    async function getMarked() {
        if (!markedParser) {
            const { marked } = await import('marked');
            marked.setOptions({ breaks: true, gfm: true });
            markedParser = marked;
        }
        return markedParser;
    }

    function ensureMdModalInstance() {
        if (!state.dom.mdModal || !globalThis.bootstrap?.Modal) return null;
        if (!state.mdModalInstance) {
            state.mdModalInstance = globalThis.bootstrap.Modal.getOrCreateInstance(state.dom.mdModal);
        }
        return state.mdModalInstance;
    }

    function isMdModalVisible() {
        return Boolean(state.dom.mdModal?.classList.contains('show'));
    }

    function setModalPdfButton(pdfUrl, { hideWhenUnavailable = false } = {}) {
        if (!state.dom.mdOpenPdf) return;
        const strings = getStrings(state.lang);
        if (pdfUrl) {
            state.dom.mdOpenPdf.href = pdfUrl;
            state.dom.mdOpenPdf.textContent = strings.modalOpenPdf;
            state.dom.mdOpenPdf.classList.remove('disabled');
            state.dom.mdOpenPdf.classList.remove('d-none');
            state.dom.mdOpenPdf.setAttribute('aria-disabled', 'false');
            return;
        }

        state.dom.mdOpenPdf.href = '#';
        state.dom.mdOpenPdf.textContent = strings.modalPdfPending;
        state.dom.mdOpenPdf.classList.add('disabled');
        state.dom.mdOpenPdf.classList.toggle('d-none', hideWhenUnavailable);
        state.dom.mdOpenPdf.setAttribute('aria-disabled', 'true');
    }

    function setMarkdownModalLoading({ title, pdfUrl = '', hidePdfButton = false }) {
        const strings = getStrings(state.lang);
        if (state.dom.mdModalTitle) state.dom.mdModalTitle.textContent = title || strings.modalTitleDefault;
        if (state.dom.mdModalMeta) state.dom.mdModalMeta.textContent = '';
        if (state.dom.mdModalContent) {
            state.dom.mdModalContent.innerHTML = `
                <div class="d-flex align-items-center gap-2 text-body-secondary">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span>${strings.modalLoading}</span>
                </div>
            `;
        }
        setModalPdfButton(pdfUrl, { hideWhenUnavailable: hidePdfButton });
    }

    function renderModalHtml({ title = '', html = '', metaParts = [], pdfUrl = '', hidePdfButton = true } = {}) {
        const modal = ensureMdModalInstance();
        if (!modal) return false;

        setActiveDomainModalState('', '');
        const requestId = ++state.mdRequestId;
        setMarkdownModalLoading({ title, pdfUrl, hidePdfButton });
        modal.show();

        const safeHtml = DOMPurify.sanitize(html);
        if (requestId !== state.mdRequestId) return true;

        if (state.dom.mdModalContent) {
            state.dom.mdModalContent.innerHTML = `
                <div class="md-article">
                    <div class="md-body">${safeHtml}</div>
                </div>
            `;

            if (!state.dom.mdModalContent.dataset.boundClicks) {
                state.dom.mdModalContent.addEventListener('click', (event) => {
                    const link = event.target.closest('.md-body a');
                    if (!(link instanceof HTMLAnchorElement)) return;
                    event.preventDefault();
                    window.open(link.href, '_blank', 'noopener');
                });
                state.dom.mdModalContent.dataset.boundClicks = '1';
            }
        }

        if (state.dom.mdModalMeta) {
            state.dom.mdModalMeta.textContent = metaParts.filter(Boolean).join(' / ');
        }

        setModalPdfButton(pdfUrl, { hideWhenUnavailable: hidePdfButton });
        return true;
    }

    async function openMarkdownModal({ mdUrl, pdfUrl = '', title = '', sources = [], modalContext = null }) {
        const modalSources = normalizeModalSources({ mdUrl, pdfUrl, sources });
        if (!modalSources.length) return;
        const firstSource = modalSources[0];
        const hasAnyPdfSource = modalSources.some((source) => hasText(source?.pdfUrl));

        if (modalContext?.type === 'domain') {
            setActiveDomainModalState(modalContext.domainId, modalContext.historyMode);
        } else {
            setActiveDomainModalState('', '');
        }

        const modal = ensureMdModalInstance();
        if (!modal) {
            if (firstSource.mdUrl) window.open(firstSource.mdUrl, '_blank', 'noopener');
            return;
        }

        const requestId = ++state.mdRequestId;
        setMarkdownModalLoading({ title, pdfUrl: '', hidePdfButton: !hasAnyPdfSource });
        modal.show();

        try {
            const marked = await getMarked();
            let raw = '';
            let resolvedSource = firstSource;
            let lastError = null;

            for (const source of modalSources) {
                if (!source.mdUrl) continue;
                try {
                    const response = await fetch(source.mdUrl, { cache: 'no-store' });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const text = await response.text();
                    if (looksLikeHtmlDocument(text)) {
                        throw new Error('Unexpected HTML response for markdown source');
                    }
                    raw = text;
                    resolvedSource = source;
                    break;
                } catch (error) {
                    lastError = error;
                }
            }

            if (!raw) throw (lastError || new Error('No markdown source could be loaded'));

            const { meta, body } = parseFrontmatter(raw);
            const mdBaseUrl = resolvedSource.mdUrl ? resolvedSource.mdUrl.replace(/\/[^/]*$/, '/') : '';
            let parsedHtml = marked.parse(body || raw);
            parsedHtml = rewriteRelativeUrls(parsedHtml, mdBaseUrl);
            const html = DOMPurify.sanitize(parsedHtml);
            const availablePdfUrl = await resolveFirstAvailablePdfUrl(modalSources);

            if (requestId !== state.mdRequestId) return;

            setModalPdfButton(availablePdfUrl, { hideWhenUnavailable: !hasAnyPdfSource });
            if (state.dom.mdModalContent) {
                state.dom.mdModalContent.innerHTML = `
                    <div class="md-article">
                        <div class="md-body">${html}</div>
                    </div>
                `;

                if (!state.dom.mdModalContent.dataset.boundClicks) {
                    state.dom.mdModalContent.addEventListener('click', (event) => {
                        const link = event.target.closest('.md-body a');
                        if (!(link instanceof HTMLAnchorElement)) return;
                        event.preventDefault();
                        window.open(link.href, '_blank', 'noopener');
                    });
                    state.dom.mdModalContent.dataset.boundClicks = '1';
                }
            }

            const strings = getStrings(state.lang);
            const metaParts = [];
            const generatorModel = hasText(meta.generator_model) ? meta.generator_model.trim() : resolvedSource.generatorModel;
            const generated = hasText(meta.generated)
                ? meta.generated.trim()
                : (hasText(meta.date) ? meta.date.trim() : resolvedSource.generated);
            if (generatorModel) metaParts.push(`${strings.modalModel}: ${generatorModel}`);
            if (generated) metaParts.push(`${strings.modalGenerated}: ${formatDate(generated)}`);
            if (state.dom.mdModalMeta) state.dom.mdModalMeta.textContent = metaParts.join(' / ');
        } catch (error) {
            console.warn('[awareness-space][reports] markdown load failed:', error);
            if (requestId !== state.mdRequestId) return;
            const strings = getStrings(state.lang);
            if (state.dom.mdModalMeta) state.dom.mdModalMeta.textContent = '';
            if (state.dom.mdModalContent) {
                state.dom.mdModalContent.innerHTML = `<p class="text-warning-emphasis mb-0">${strings.modalError}</p>`;
            }
            setModalPdfButton('', { hideWhenUnavailable: !hasAnyPdfSource });
        }
    }

    return {
        ensureMdModalInstance,
        isMdModalVisible,
        renderModalHtml,
        openMarkdownModal,
    };
}
