/**
 * reports/dom-helpers.js
 * Pure DOM factory helpers for the reports UI.
 * No state dependencies — all inputs are explicit parameters.
 */

export function createFilterButton({ filterKey, label, isActive, paletteClass = '' }) {
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

export function createMetricCard(label, value, { paletteClass = '' } = {}) {
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
