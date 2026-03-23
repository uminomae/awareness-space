import {
    MODEL_GUIDE_LINKS,
    STATUS_REPORT_LINKS,
    countReportsByProgressLevel,
    hasText,
    normalizeLang,
    normalizeProgressLevelId,
    resolveLocalizedSources,
} from './data.js';
import { DOMAIN_HISTORY_MODE_PUSH } from './history.js';

const STRINGS = {
    ja: {
        featureRead: 'ガイドを開く',
        guideScopeNote: 'guide は公開用の解説です。詳しい現在地は調査概要へ、構成要素ごとの本文は各レポートへ進みます。',
        features: {
            general: {
                title: 'General',
                modalTitle: '意識とは何か — 生存と間主観性を手がかりに',
                description: '全体像を初めて読む人向けの解説。',
            },
            designer: {
                title: 'Designer',
                modalTitle: '意識モデルを観察の道具として使う',
                description: '教育・支援・チーム設計に引きつけて読むための解説。',
            },
            academic: {
                title: 'Academic',
                modalTitle: '意識モデルと神経現象学・心理学の接続',
                description: '理論的な比較軸まで含めて検討するための解説。',
            },
        },
        tabDomains: '構成要素レポート',
        openStatus: '調査の現在地',
        statusReportTitle: '調査の現在地',
        metricGenerated: 'manifest',
        metricTotal: 'components',
        filterAll: 'すべて',
        filterGroupAria: '構成要素レポート絞り込み',
        levelLegend: '進捗分類を読み込み中...',
        levelLegendUnavailable: '進捗分類を読み込めませんでした。',
        levelLegendPrefix: '進捗分類',
        levelLegendSingle: '{count}件 / {label}',
        scopeNote: '調査は進行中です。現在は意識モデル構成要素ごとの個別レポートを掲載しています。',
        empty: '表示できるレポートがありません。',
        error: '構成要素レポート manifest の読み込みに失敗しました。',
        modalTitleDefault: 'Markdown',
        modalLoading: '読み込み中...',
        modalError: 'Markdown を読み込めませんでした。',
        modalOpenPdf: 'PDFを開く',
        modalPdfPending: 'PDF未提供',
        modalModel: 'モデル',
        modalGenerated: '生成日',
    },
    en: {
        featureRead: 'Open Guide',
        guideScopeNote: 'Guides are public explainers. Use the survey for project status and the component reports for detailed text.',
        features: {
            general: {
                title: 'General',
                modalTitle: 'What Is Awareness? — Survival and Intersubjectivity',
                description: 'An explainer for readers who want the overall picture first.',
            },
            designer: {
                title: 'Designer',
                modalTitle: 'Using the Awareness Model as an Observation Tool',
                description: 'An explainer for education, support, and team design contexts.',
            },
            academic: {
                title: 'Academic',
                modalTitle: 'Awareness Model in Dialogue with Neurophenomenology and Psychology',
                description: 'An explainer for readers who want the theoretical comparison points.',
            },
        },
        tabDomains: 'Component Reports',
        openStatus: 'Research Status',
        statusReportTitle: 'Research Status',
        metricGenerated: 'manifest',
        metricTotal: 'components',
        filterAll: 'All',
        filterGroupAria: 'Filter component reports',
        levelLegend: 'Loading progress taxonomy...',
        levelLegendUnavailable: 'Progress taxonomy unavailable.',
        levelLegendPrefix: 'Progress',
        levelLegendSingle: '{count} items / {label}',
        scopeNote: 'Research is still in progress. The current section lists individual reports for the awareness model components.',
        empty: 'No reports available.',
        error: 'Failed to load component reports manifest.',
        modalTitleDefault: 'Markdown',
        modalLoading: 'Loading...',
        modalError: 'Failed to load markdown.',
        modalOpenPdf: 'Open PDF',
        modalPdfPending: 'PDF unavailable',
        modalModel: 'Model',
        modalGenerated: 'Generated',
    },
};

export function getReportsStrings(lang = 'ja') {
    return STRINGS[normalizeLang(lang)] || STRINGS.ja;
}

export function getDomainReportTitle(report, lang = 'ja') {
    if (!report) return '';
    const useJapanese = normalizeLang(lang) === 'ja';
    return useJapanese ? (report.nameJa || report.nameEn || '') : (report.nameEn || report.nameJa || '');
}

export function createReportsRenderer({
    state,
    openMarkdownModal,
    openDomainModalById,
    getReportSources,
}) {
    function getProgressTaxonomyEntry(level) {
        const normalizedLevel = normalizeProgressLevelId(level);
        return state.progressTaxonomy.find((entry) => entry.id === normalizedLevel) || state.progressTaxonomy[0] || null;
    }

    function getProgressLevelLabel(level) {
        const entry = getProgressTaxonomyEntry(level);
        if (!entry) return level || '';
        return normalizeLang(state.lang) === 'ja' ? (entry.labelJa || entry.labelEn || entry.id) : (entry.labelEn || entry.labelJa || entry.id);
    }

    function getProgressLevelDescription(level) {
        const entry = getProgressTaxonomyEntry(level);
        if (!entry) return '';
        return normalizeLang(state.lang) === 'ja' ? (entry.descriptionJa || entry.descriptionEn || '') : (entry.descriptionEn || entry.descriptionJa || '');
    }

    function getPresentProgressTaxonomy() {
        return state.progressTaxonomy.filter((entry) => (state.progressLevelCounts[entry.id] || 0) > 0);
    }

    function buildProgressPaletteMap(presentTaxonomy = getPresentProgressTaxonomy()) {
        const paletteMap = new Map();
        const source = presentTaxonomy.length ? presentTaxonomy : state.progressTaxonomy;
        source.forEach((entry, index) => {
            paletteMap.set(entry.id, `is-palette-${(index % 10) + 1}`);
        });
        return paletteMap;
    }

    function getProgressPaletteClass(level, paletteMap) {
        const normalizedLevel = normalizeProgressLevelId(level);
        return paletteMap.get(normalizedLevel) || 'is-palette-1';
    }

    function getAvailableFilterKeys() {
        return new Set(['all', ...getPresentProgressTaxonomy().map((entry) => entry.id)]);
    }

    function cacheDom() {
        state.dom.featureCards = document.getElementById('model-guide-cards');
        state.dom.guideScopeNote = document.getElementById('model-summary-note');
        state.dom.error = document.getElementById('reports-error');
        state.dom.openStatusBtn = document.getElementById('reports-open-status-btn');
        state.dom.domainsHeading = document.getElementById('reports-domains-heading');
        state.dom.scopeNote = document.getElementById('reports-scope-note');
        state.dom.levelLegend = document.getElementById('reports-level-legend');
        state.dom.metrics = document.getElementById('reports-metrics');
        state.dom.domainGrid = document.getElementById('reports-domain-grid');
        state.dom.filterGroup = document.getElementById('reports-table-filters');
        state.dom.mdModal = document.getElementById('reports-md-modal');
        state.dom.mdModalTitle = document.getElementById('reports-md-modal-title');
        state.dom.mdModalMeta = document.getElementById('reports-md-meta');
        state.dom.mdModalContent = document.getElementById('reports-md-content');
        state.dom.mdOpenPdf = document.getElementById('reports-md-open-pdf');
    }

    function setReportsError(message) {
        if (!state.dom.error) return;
        if (message) {
            state.dom.error.textContent = message;
            state.dom.error.classList.remove('d-none');
            return;
        }
        state.dom.error.textContent = '';
        state.dom.error.classList.add('d-none');
    }

    function renderLevelLegend() {
        if (!state.dom.levelLegend) return;

        const strings = getReportsStrings(state.lang);
        const legendNode = state.dom.levelLegend;
        const presentTaxonomy = getPresentProgressTaxonomy();
        const paletteMap = buildProgressPaletteMap(presentTaxonomy);

        legendNode.classList.remove('d-none');

        if (!presentTaxonomy.length) {
            legendNode.textContent = state.loadError ? strings.levelLegendUnavailable : strings.levelLegend;
            return;
        }

        if (presentTaxonomy.length === 1) {
            const level = presentTaxonomy[0].id;
            const count = state.progressLevelCounts[level] || 0;
            const label = getProgressLevelLabel(level);
            const description = getProgressLevelDescription(level);
            const summaryText = strings.levelLegendSingle
                .replace('{count}', String(count))
                .replace('{label}', label);

            legendNode.innerHTML = '';

            const summaryNode = document.createElement('span');
            summaryNode.className = 'd-block';
            summaryNode.textContent = summaryText;
            legendNode.appendChild(summaryNode);

            if (description) {
                const descNode = document.createElement('span');
                descNode.className = 'reports-level-legend-description d-block mt-1';
                descNode.textContent = `${label}: ${description}`;
                legendNode.appendChild(descNode);
            }
            return;
        }

        legendNode.innerHTML = '';

        const fragment = document.createDocumentFragment();
        const prefixNode = document.createElement('span');
        prefixNode.className = 'reports-level-legend-prefix d-block mb-1';
        prefixNode.textContent = `${strings.levelLegendPrefix}:`;
        fragment.appendChild(prefixNode);

        presentTaxonomy.forEach((entry) => {
            const paletteClass = getProgressPaletteClass(entry.id, paletteMap);
            const lineNode = document.createElement('span');
            lineNode.className = 'reports-level-legend-line d-flex align-items-start gap-2 mt-1';

            const labelNode = document.createElement('span');
            labelNode.className = `badge rounded-pill reports-progress-chip reports-level-legend-label ${paletteClass}`;
            labelNode.textContent = getProgressLevelLabel(entry.id);
            lineNode.appendChild(labelNode);

            const description = getProgressLevelDescription(entry.id);
            if (description) {
                const descriptionNode = document.createElement('span');
                descriptionNode.className = 'reports-level-legend-description';
                descriptionNode.textContent = description;
                lineNode.appendChild(descriptionNode);
            }

            fragment.appendChild(lineNode);
        });

        legendNode.appendChild(fragment);
    }

    function createFilterButton({ filterKey, label, isActive, paletteClass = '' }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = [
            'btn',
            'btn-outline-light',
            'btn-sm',
            'reports-filter-btn',
            paletteClass,
            isActive ? 'active' : '',
        ].join(' ').trim();
        button.dataset.filter = filterKey;
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        button.textContent = label;
        return button;
    }

    function updateFilterButtons() {
        if (!state.dom.filterGroup) return;

        const strings = getReportsStrings(state.lang);
        const presentTaxonomy = getPresentProgressTaxonomy();
        const paletteMap = buildProgressPaletteMap(presentTaxonomy);

        if (presentTaxonomy.length <= 1) {
            state.tableFilter = 'all';
            state.dom.filterGroup.innerHTML = '';
            state.dom.filterGroup.classList.remove('d-flex');
            state.dom.filterGroup.classList.add('d-none');
            return;
        }

        state.dom.filterGroup.classList.remove('d-none');
        state.dom.filterGroup.classList.add('d-flex');

        if (!getAvailableFilterKeys().has(state.tableFilter)) {
            state.tableFilter = 'all';
        }

        const fragment = document.createDocumentFragment();
        fragment.appendChild(createFilterButton({
            filterKey: 'all',
            label: strings.filterAll,
            isActive: state.tableFilter === 'all',
        }));

        presentTaxonomy.forEach((entry) => {
            fragment.appendChild(createFilterButton({
                filterKey: entry.id,
                label: getProgressLevelLabel(entry.id),
                isActive: state.tableFilter === entry.id,
                paletteClass: getProgressPaletteClass(entry.id, paletteMap),
            }));
        });

        state.dom.filterGroup.innerHTML = '';
        state.dom.filterGroup.appendChild(fragment);
    }

    function createMetricCard(label, value, { paletteClass = '' } = {}) {
        const col = document.createElement('div');
        col.className = 'col-6 col-lg';

        const card = document.createElement('div');
        card.className = [
            'card',
            'report-metric-card',
            'h-100',
            paletteClass ? 'reports-progress-card' : '',
            paletteClass,
        ].join(' ').trim();

        const body = document.createElement('div');
        body.className = 'card-body py-2 px-3';

        const metricLabel = document.createElement('div');
        metricLabel.className = 'report-metric-label text-uppercase small';
        metricLabel.textContent = label;

        const metricValue = document.createElement('div');
        metricValue.className = 'report-metric-value fw-semibold';
        metricValue.textContent = value;

        body.append(metricLabel, metricValue);
        card.appendChild(body);
        col.appendChild(card);
        return col;
    }

    function renderFeatureCards() {
        if (!state.dom.featureCards) return;

        const strings = getReportsStrings(state.lang);
        state.dom.featureCards.innerHTML = '';

        const fragment = document.createDocumentFragment();
        MODEL_GUIDE_LINKS.forEach((guide) => {
            const featureText = strings.features?.[guide.key];
            if (!featureText) return;

            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card h-100 reports-feature-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${featureText.title} ${strings.featureRead}`);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            const title = document.createElement('h3');
            title.className = 'h6 mb-1 text-light';
            title.textContent = featureText.title;

            const desc = document.createElement('p');
            desc.className = 'small mb-0 reports-feature-description';
            desc.textContent = featureText.description;

            const openCardModal = () => {
                openMarkdownModal({
                    title: featureText.modalTitle || featureText.title,
                    sources: resolveLocalizedSources(guide.links, state.lang),
                });
            };

            body.append(title, desc);
            card.appendChild(body);
            card.addEventListener('click', openCardModal);
            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openCardModal();
            });

            col.appendChild(card);
            fragment.appendChild(col);
        });

        state.dom.featureCards.appendChild(fragment);
    }

    function renderMetrics() {
        if (!state.dom.metrics) return;
        const strings = getReportsStrings(state.lang);
        const total = state.reports.length;
        const generatedValue = state.generatedAt ? state.generatedAt.slice(0, 10) : '-';

        state.dom.metrics.innerHTML = '';
        const fragment = document.createDocumentFragment();
        fragment.appendChild(createMetricCard(strings.metricGenerated, generatedValue));
        fragment.appendChild(createMetricCard(strings.metricTotal, String(total)));

        state.dom.metrics.appendChild(fragment);
    }

    function createDomainGridItem({ report, muted = false, paletteMap }) {
        const useJapanese = normalizeLang(state.lang) === 'ja';
        const domainLabel = useJapanese ? (report.nameJa || report.nameEn) : (report.nameEn || report.nameJa);
        const summary = useJapanese ? (report.summaryJa || report.summaryEn) : (report.summaryEn || report.summaryJa);
        const level = normalizeProgressLevelId(report.progressLevel) || 'planned';
        const paletteClass = getProgressPaletteClass(level, paletteMap);
        const sources = getReportSources(report);
        const clickable = sources.length > 0 && !muted;
        const col = document.createElement('div');
        col.className = 'col';
        const tile = document.createElement('article');
        const reportTitle = getDomainReportTitle(report, state.lang);

        if (clickable) {
            tile.setAttribute('role', 'button');
            tile.setAttribute('tabindex', '0');
            tile.addEventListener('click', () => {
                openDomainModalById(report.id, {
                    historyMode: DOMAIN_HISTORY_MODE_PUSH,
                    syncUrl: 'push',
                });
            });
            tile.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                openDomainModalById(report.id, {
                    historyMode: DOMAIN_HISTORY_MODE_PUSH,
                    syncUrl: 'push',
                });
            });
        }

        tile.className = [
            'reports-domain-item',
            'card',
            'h-100',
            'w-100',
            'text-start',
            paletteClass,
            muted ? 'is-filter-muted' : '',
        ].join(' ').trim();
        tile.setAttribute('data-report-level', level);
        tile.setAttribute('aria-label', reportTitle);

        const hoverHint = [report.progressNote, summary]
            .filter((part) => hasText(part))
            .join('\n');
        if (hoverHint) tile.setAttribute('title', hoverHint);
        if (!clickable) tile.setAttribute('aria-disabled', 'true');

        const body = document.createElement('div');
        body.className = 'card-body p-2 d-flex flex-column gap-1 h-100 reports-domain-item-body';

        const nameNode = document.createElement('div');
        nameNode.className = 'reports-domain-item-name';
        nameNode.title = domainLabel;
        nameNode.textContent = domainLabel;

        body.append(nameNode);
        tile.appendChild(body);
        col.appendChild(tile);
        return col;
    }

    function renderDomainGrid() {
        if (!state.dom.domainGrid) return;
        const allReports = state.reports;
        const paletteMap = buildProgressPaletteMap(getPresentProgressTaxonomy());

        state.dom.domainGrid.innerHTML = '';
        if (!allReports.length) {
            const empty = document.createElement('div');
            empty.className = 'reports-domain-empty col-12 text-body-secondary';
            empty.textContent = getReportsStrings(state.lang).empty;
            state.dom.domainGrid.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        allReports.forEach((report) => {
            const muted = state.tableFilter !== 'all' && report.progressLevel !== state.tableFilter;
            fragment.appendChild(createDomainGridItem({ report, muted, paletteMap }));
        });
        state.dom.domainGrid.appendChild(fragment);
    }

    function applyStaticText() {
        const strings = getReportsStrings(state.lang);
        if (state.dom.guideScopeNote) state.dom.guideScopeNote.textContent = strings.guideScopeNote;
        if (state.dom.domainsHeading) state.dom.domainsHeading.textContent = strings.tabDomains;
        if (state.dom.scopeNote) state.dom.scopeNote.textContent = strings.scopeNote;
        if (state.dom.filterGroup) state.dom.filterGroup.setAttribute('aria-label', strings.filterGroupAria);
        if (state.dom.openStatusBtn) state.dom.openStatusBtn.textContent = strings.openStatus;
        renderLevelLegend();
        updateFilterButtons();
    }

    function bindUiEvents() {
        if (state.quickLinksBound) return;

        if (state.dom.openStatusBtn && !state.dom.openStatusBtn.dataset.boundClick) {
            state.dom.openStatusBtn.addEventListener('click', () => {
                openMarkdownModal({
                    title: getReportsStrings(state.lang).statusReportTitle,
                    sources: resolveLocalizedSources(STATUS_REPORT_LINKS, state.lang),
                });
            });
            state.dom.openStatusBtn.dataset.boundClick = '1';
        }

        if (state.dom.mdOpenPdf && !state.dom.mdOpenPdf.dataset.boundClick) {
            state.dom.mdOpenPdf.addEventListener('click', (event) => {
                if (state.dom.mdOpenPdf.classList.contains('disabled')) {
                    event.preventDefault();
                }
            });
            state.dom.mdOpenPdf.dataset.boundClick = '1';
        }

        if (state.dom.filterGroup && !state.dom.filterGroup.dataset.boundClick) {
            state.dom.filterGroup.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                const button = target.closest('button[data-filter]');
                if (!(button instanceof HTMLButtonElement)) return;
                const nextFilter = button.dataset.filter;
                if (!getAvailableFilterKeys().has(nextFilter) || nextFilter === state.tableFilter) return;
                state.tableFilter = nextFilter;
                updateFilterButtons();
                renderDomainGrid();
            });
            state.dom.filterGroup.dataset.boundClick = '1';
        }

        state.quickLinksBound = true;
    }

    function renderReports() {
        state.progressLevelCounts = countReportsByProgressLevel(state.reports);
        renderFeatureCards();
        applyStaticText();
        renderMetrics();
        renderDomainGrid();
        setReportsError(state.loadError ? getReportsStrings(state.lang).error : '');
    }

    return {
        bindUiEvents,
        cacheDom,
        renderReports,
    };
}
