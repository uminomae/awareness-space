async function loadReports() {
    const response = await fetch('./assets/reports/reports.json', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`reports manifest load failed: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data?.reports) ? data.reports : [];
}

function createCard(report) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-xl-3';

    const article = document.createElement('article');
    article.className = 'card kesson-card awareness-card h-100';

    const body = document.createElement('div');
    body.className = 'card-body';

    const kicker = document.createElement('p');
    kicker.className = 'awareness-card-kicker';
    kicker.textContent = report.category || 'Report';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = report.title || report.id || 'Untitled';

    const summary = document.createElement('p');
    summary.className = 'card-text';
    summary.textContent = report.summary || '';

    const link = document.createElement('a');
    link.className = 'awareness-card-link';
    link.href = report.href || '#';
    link.textContent = '開く';

    body.append(kicker, title, summary, link);
    article.append(body);
    col.append(article);
    return col;
}

export async function initReportsCards() {
    const grid = document.getElementById('reports-card-grid');
    if (!(grid instanceof HTMLElement)) return;

    try {
        const reports = await loadReports();
        grid.innerHTML = '';
        reports.forEach((report) => {
            grid.append(createCard(report));
        });
    } catch (error) {
        console.warn('[awareness-space] reports cards load failed:', error);
    }
}
