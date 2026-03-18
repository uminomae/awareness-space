import {
    DEFAULT_PROGRESS_TAXONOMY,
    DEFAULT_REPORTS_ASSET_BASE,
    DEFAULT_REPORTS_DATA_URL,
    loadReportsData,
    normalizeAssetBaseUrl,
    normalizeDomainId,
    normalizeLang,
    resolveDomainReportSources,
} from './data.js';
import {
    createReportsHistoryController,
    DOMAIN_HISTORY_MODE_INITIAL,
    DOMAIN_HISTORY_MODE_PUSH,
} from './history.js';
import { createReportsModalController } from './modal.js';
import { createReportsRenderer, getDomainReportTitle, getReportsStrings } from './render.js';

const state = {
    lang: 'ja',
    generatedAt: '',
    reports: [],
    progressTaxonomy: DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry })),
    progressLevelCounts: {},
    tableFilter: 'all',
    loadError: false,
    dataUrl: DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl: DEFAULT_REPORTS_ASSET_BASE,
    mdModalInstance: null,
    mdRequestId: 0,
    quickLinksBound: false,
    reportsReady: false,
    activeDomainId: '',
    activeDomainHistoryMode: '',
    pendingDomainId: '',
    pendingDomainHistoryMode: '',
    _isHistorySyncing: false,
    historyEventsBound: false,
    dom: {
        featureCards: null,
        error: null,
        openStatusBtn: null,
        domainsHeading: null,
        levelLegend: null,
        metrics: null,
        domainGrid: null,
        filterGroup: null,
        mdModal: null,
        mdModalTitle: null,
        mdModalMeta: null,
        mdModalContent: null,
        mdOpenPdf: null,
    },
};

let historyController;
let openDomainModalByIdImpl = () => false;

const modalController = createReportsModalController({
    state,
    getStrings: getReportsStrings,
    setActiveDomainModalState: (...args) => historyController?.setActiveDomainModalState(...args),
});

const renderer = createReportsRenderer({
    state,
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    openDomainModalById: (...args) => openDomainModalByIdImpl(...args),
    getReportSources: (report) => resolveDomainReportSources(report, {
        lang: state.lang,
        assetBaseUrl: state.assetBaseUrl,
    }),
});

historyController = createReportsHistoryController({
    state,
    ensureMdModalInstance: () => modalController.ensureMdModalInstance(),
    isMdModalVisible: () => modalController.isMdModalVisible(),
    openDomainModalById: (...args) => openDomainModalByIdImpl(...args),
});

function findReportById(domainId) {
    const normalizedId = normalizeDomainId(domainId);
    if (!normalizedId) return null;
    return state.reports.find((report) => normalizeDomainId(report?.id) === normalizedId) || null;
}

openDomainModalByIdImpl = function openDomainModalById(
    domainId,
    {
        historyMode = DOMAIN_HISTORY_MODE_PUSH,
        syncUrl = 'push',
    } = {},
) {
    const normalizedId = normalizeDomainId(domainId);
    const report = findReportById(normalizedId);
    if (!report) return false;

    const sources = resolveDomainReportSources(report, {
        lang: state.lang,
        assetBaseUrl: state.assetBaseUrl,
    });
    if (!sources.length) return false;

    let resolvedHistoryMode = historyMode === DOMAIN_HISTORY_MODE_INITIAL
        ? DOMAIN_HISTORY_MODE_INITIAL
        : DOMAIN_HISTORY_MODE_PUSH;

    if (syncUrl === 'push') {
        const currentDomainId = historyController.getDomainIdFromUrl();
        const currentHistoryMode = historyController.getDomainHistoryMarker(window.history?.state, currentDomainId)?.mode;
        if (currentDomainId !== normalizedId || currentHistoryMode !== DOMAIN_HISTORY_MODE_PUSH) {
            const didPush = historyController.updateDomainHistoryEntry(normalizedId, {
                method: 'push',
                mode: DOMAIN_HISTORY_MODE_PUSH,
            });
            if (!didPush) {
                historyController.updateDomainHistoryEntry(normalizedId, {
                    method: 'replace',
                    mode: DOMAIN_HISTORY_MODE_INITIAL,
                });
                resolvedHistoryMode = DOMAIN_HISTORY_MODE_INITIAL;
            }
        }
    } else if (syncUrl === 'replace') {
        historyController.updateDomainHistoryEntry(normalizedId, {
            method: 'replace',
            mode: resolvedHistoryMode,
        });
    }

    modalController.openMarkdownModal({
        title: getDomainReportTitle(report, state.lang),
        sources,
        modalContext: {
            type: 'domain',
            domainId: normalizedId,
            historyMode: resolvedHistoryMode,
        },
    });
    return true;
};

export async function initReports({
    lang = document.documentElement.lang || 'ja',
    dataUrl = DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
} = {}) {
    renderer.cacheDom();
    renderer.bindUiEvents();
    historyController.bindHistorySyncEvents();

    state.lang = normalizeLang(lang);
    state.dataUrl = dataUrl;
    state.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    state.generatedAt = '';
    state.reports = [];
    state.progressTaxonomy = DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry }));
    state.progressLevelCounts = {};
    state.tableFilter = 'all';
    state.loadError = false;
    state.reportsReady = false;

    renderer.renderReports();

    try {
        const loaded = await loadReportsData({
            dataUrl: state.dataUrl,
            assetBaseUrl: state.assetBaseUrl,
        });
        state.generatedAt = loaded.generatedAt;
        state.reports = loaded.reports;
        state.progressTaxonomy = loaded.progressTaxonomy;
        state.progressLevelCounts = loaded.progressLevelCounts;
        state.loadError = false;
        state.reportsReady = true;
    } catch (error) {
        state.reports = [];
        state.progressTaxonomy = DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry }));
        state.progressLevelCounts = {};
        state.loadError = true;
        state.reportsReady = false;
        console.warn('[awareness-space][reports] load failed:', error);
    }

    renderer.renderReports();

    if (!state.loadError) {
        historyController.syncDomainModalWithUrl({
            historyState: window.history?.state,
            fallbackHistoryMode: state.pendingDomainHistoryMode,
            treatAsInitial: !state.pendingDomainHistoryMode && Boolean(historyController.getDomainIdFromUrl()),
        });
    }
}

export function setReportsLanguage(lang) {
    state.lang = normalizeLang(lang);
    renderer.renderReports();
}

function getDatasetTitle(node, lang = 'ja') {
    if (!(node instanceof HTMLElement)) return '';
    const normalizedLang = normalizeLang(lang);
    if (normalizedLang === 'en') {
        return node.dataset.mdTitleEn || node.dataset.mdTitle || '';
    }
    return node.dataset.mdTitleJa || node.dataset.mdTitle || '';
}

export function bindStandaloneMarkdownLinks(selector = '[data-md-modal="1"]') {
    document.querySelectorAll(selector).forEach((node) => {
        if (!(node instanceof HTMLAnchorElement) || node.dataset.mdModalBound === '1') return;

        node.addEventListener('click', (event) => {
            const mdUrl = node.dataset.mdUrl || node.getAttribute('href') || '';
            if (!mdUrl) return;
            event.preventDefault();
            modalController.openMarkdownModal({
                title: getDatasetTitle(node, state.lang),
                mdUrl,
                pdfUrl: node.dataset.pdfUrl || '',
            });
        });

        node.dataset.mdModalBound = '1';
    });
}
