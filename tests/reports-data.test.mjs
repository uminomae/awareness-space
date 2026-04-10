import test from 'node:test';
import assert from 'node:assert/strict';

import {
    hasText,
    normalizeDomainId,
    normalizeProgressLevelId,
    formatDate,
    parseFrontmatter,
    looksLikeHtmlDocument,
    countReportsByProgressLevel,
    normalizeProgressTaxonomy,
    resolveFirstAvailablePdfUrl,
    resolveDomainPresentationSources,
    DEFAULT_PROGRESS_TAXONOMY,
    MODEL_GUIDE_LINKS,
    STATUS_REPORT_LINKS,
} from '../src/reports/data.js';

// hasText

test('hasText returns true for non-empty string', () => {
    assert.equal(hasText('hello'), true);
    assert.equal(hasText(' a '), true);
});

test('hasText returns false for empty or whitespace-only string', () => {
    assert.equal(hasText(''), false);
    assert.equal(hasText('   '), false);
});

test('hasText returns false for non-string types', () => {
    assert.equal(hasText(null), false);
    assert.equal(hasText(undefined), false);
    assert.equal(hasText(42), false);
    assert.equal(hasText([]), false);
});

// normalizeDomainId

test('normalizeDomainId uppercases valid alphanumeric id', () => {
    assert.equal(normalizeDomainId('a01'), 'A01');
});

test('normalizeDomainId returns empty string for null/undefined', () => {
    assert.equal(normalizeDomainId(null), '');
    assert.equal(normalizeDomainId(undefined), '');
    assert.equal(normalizeDomainId(''), '');
});

test('normalizeDomainId rejects ids with invalid characters', () => {
    assert.equal(normalizeDomainId('a 01'), '');
    assert.equal(normalizeDomainId('a.01'), '');
});

test('normalizeDomainId accepts hyphen and underscore', () => {
    assert.equal(normalizeDomainId('A01-B'), 'A01-B');
    assert.equal(normalizeDomainId('A01_B'), 'A01_B');
});

// normalizeProgressLevelId

test('normalizeProgressLevelId lowercases the value', () => {
    assert.equal(normalizeProgressLevelId('PLANNED'), 'planned');
    assert.equal(normalizeProgressLevelId('Report_Ready'), 'report_ready');
});

test('normalizeProgressLevelId returns empty string for null/undefined', () => {
    assert.equal(normalizeProgressLevelId(null), '');
    assert.equal(normalizeProgressLevelId(undefined), '');
});

// formatDate

test('formatDate extracts YYYY-MM-DD from ISO datetime string', () => {
    assert.equal(formatDate('2025-01-15T00:00:00Z'), '2025-01-15');
});

test('formatDate returns plain YYYY-MM-DD as-is', () => {
    assert.equal(formatDate('2025-06-30'), '2025-06-30');
});

test('formatDate returns empty string for empty input', () => {
    assert.equal(formatDate(''), '');
    assert.equal(formatDate(null), '');
});

// parseFrontmatter

test('parseFrontmatter parses simple frontmatter', () => {
    const text = '---\ntitle: Hello\nauthor: test\n---\nBody content here.';
    const { meta, body } = parseFrontmatter(text);
    assert.equal(meta.title, 'Hello');
    assert.equal(meta.author, 'test');
    assert.equal(body, 'Body content here.');
});

test('parseFrontmatter strips surrounding quotes from values', () => {
    const text = '---\ntitle: "Quoted"\n---\nbody';
    const { meta } = parseFrontmatter(text);
    assert.equal(meta.title, 'Quoted');
});

test('parseFrontmatter returns empty meta and trimmed body for plain text', () => {
    const { meta, body } = parseFrontmatter('  plain text  ');
    assert.deepEqual(meta, {});
    assert.equal(body, 'plain text');
});

test('parseFrontmatter handles null/undefined input gracefully', () => {
    const { meta, body } = parseFrontmatter(null);
    assert.deepEqual(meta, {});
    assert.equal(body, '');
});

// looksLikeHtmlDocument

test('looksLikeHtmlDocument returns true for doctype html', () => {
    assert.equal(looksLikeHtmlDocument('<\!doctype html><html>'), true);
    assert.equal(looksLikeHtmlDocument('<\!DOCTYPE HTML><html>'), true);
});

test('looksLikeHtmlDocument returns true for bare html tag', () => {
    assert.equal(looksLikeHtmlDocument('<html lang="ja">'), true);
});

test('looksLikeHtmlDocument returns false for markdown content', () => {
    assert.equal(looksLikeHtmlDocument('# Heading\n\nContent'), false);
});

test('looksLikeHtmlDocument returns false for empty string', () => {
    assert.equal(looksLikeHtmlDocument(''), false);
});

// countReportsByProgressLevel

test('countReportsByProgressLevel counts by progressLevel field', () => {
    const reports = [
        { progressLevel: 'planned' },
        { progressLevel: 'report_ready' },
        { progressLevel: 'planned' },
    ];
    const counts = countReportsByProgressLevel(reports);
    assert.equal(counts.planned, 2);
    assert.equal(counts.report_ready, 1);
});

test('countReportsByProgressLevel returns empty object for empty array', () => {
    assert.deepEqual(countReportsByProgressLevel([]), {});
});

test('countReportsByProgressLevel defaults to "planned" for missing progressLevel', () => {
    const counts = countReportsByProgressLevel([{}]);
    assert.equal(counts.planned, 1);
});

// normalizeProgressTaxonomy

test('normalizeProgressTaxonomy returns DEFAULT_PROGRESS_TAXONOMY when no args', () => {
    const result = normalizeProgressTaxonomy();
    assert.equal(result.length, DEFAULT_PROGRESS_TAXONOMY.length);
    const ids = result.map((e) => e.id);
    assert.ok(ids.includes('planned'));
    assert.ok(ids.includes('source_ready'));
    assert.ok(ids.includes('report_ready'));
});

test('normalizeProgressTaxonomy entries have required fields', () => {
    const result = normalizeProgressTaxonomy();
    for (const entry of result) {
        assert.ok(typeof entry.id === 'string' && entry.id.length > 0, 'id must be non-empty string');
        assert.ok(typeof entry.labelJa === 'string', 'labelJa must be string');
        assert.ok(typeof entry.labelEn === 'string', 'labelEn must be string');
        assert.ok(typeof entry.tone === 'string', 'tone must be string');
        assert.ok(typeof entry.order === 'number', 'order must be number');
    }
});

test('normalizeProgressTaxonomy deduplicates entries with same id', () => {
    const raw = [
        { id: 'planned', label_ja: 'A', label_en: 'A', tone: 'secondary', order: 1 },
        { id: 'planned', label_ja: 'B', label_en: 'B', tone: 'primary', order: 2 },
    ];
    const result = normalizeProgressTaxonomy(raw);
    assert.equal(result.filter((e) => e.id === 'planned').length, 1);
    assert.equal(result[0].labelJa, 'A');
});

test('normalizeProgressTaxonomy sorts by order', () => {
    const raw = [
        { id: 'z_level', label_ja: 'Z', label_en: 'Z', tone: 'info', order: 100 },
        { id: 'a_level', label_ja: 'A', label_en: 'A', tone: 'info', order: 1 },
    ];
    const result = normalizeProgressTaxonomy(raw);
    assert.equal(result[0].id, 'a_level');
    assert.equal(result[1].id, 'z_level');
});

// resolveFirstAvailablePdfUrl

test('resolveFirstAvailablePdfUrl returns first pdfUrl', async () => {
    const sources = [
        { mdUrl: 'https://example.com/a.md', pdfUrl: 'https://example.com/a.pdf' },
        { mdUrl: 'https://example.com/b.md', pdfUrl: 'https://example.com/b.pdf' },
    ];
    const result = await resolveFirstAvailablePdfUrl(sources);
    assert.equal(result, 'https://example.com/a.pdf');
});

test('resolveFirstAvailablePdfUrl returns empty string when no pdfUrl', async () => {
    const result = await resolveFirstAvailablePdfUrl([{ mdUrl: 'https://example.com/a.md' }]);
    assert.equal(result, '');
});

test('resolveFirstAvailablePdfUrl returns empty string for empty array', async () => {
    const result = await resolveFirstAvailablePdfUrl([]);
    assert.equal(result, '');
});

// resolveDomainPresentationSources

test('resolveDomainPresentationSources returns source array for valid report ja', () => {
    const report = { id: 'A01', slug: 'survival-trust' };
    const sources = resolveDomainPresentationSources(report, { lang: 'ja' });
    assert.equal(sources.length, 1);
    assert.ok(sources[0].mdUrl.includes('domain-A01-survival-trust-presentation-ja'));
    assert.ok(sources[0].pdfUrl.includes('domain-A01-survival-trust-presentation-ja'));
    assert.ok(sources[0].htmlUrl.includes('domain-A01-survival-trust-presentation-ja'));
});

test('resolveDomainPresentationSources returns source array for valid report en', () => {
    const report = { id: 'A01', slug: 'survival-trust' };
    const sources = resolveDomainPresentationSources(report, { lang: 'en' });
    assert.equal(sources.length, 1);
    assert.ok(sources[0].mdUrl.includes('presentation-en'));
});

test('resolveDomainPresentationSources returns empty array for null', () => {
    assert.deepEqual(resolveDomainPresentationSources(null), []);
});

test('resolveDomainPresentationSources returns empty array when id or slug is missing', () => {
    assert.deepEqual(resolveDomainPresentationSources({ id: 'A01' }), []);
    assert.deepEqual(resolveDomainPresentationSources({ slug: 'foo' }), []);
});

// DEFAULT_PROGRESS_TAXONOMY structure

test('DEFAULT_PROGRESS_TAXONOMY has 3 entries', () => {
    assert.equal(DEFAULT_PROGRESS_TAXONOMY.length, 3);
});

test('DEFAULT_PROGRESS_TAXONOMY entries have required fields', () => {
    for (const entry of DEFAULT_PROGRESS_TAXONOMY) {
        assert.ok(typeof entry.id === 'string' && entry.id.length > 0);
        assert.ok(typeof entry.labelJa === 'string');
        assert.ok(typeof entry.labelEn === 'string');
        assert.ok(typeof entry.descriptionJa === 'string');
        assert.ok(typeof entry.descriptionEn === 'string');
        assert.ok(typeof entry.tone === 'string');
        assert.ok(typeof entry.order === 'number');
    }
});

// MODEL_GUIDE_LINKS structure

test('MODEL_GUIDE_LINKS has general/designer/academic entries', () => {
    const keys = MODEL_GUIDE_LINKS.map((e) => e.key);
    assert.ok(keys.includes('general'));
    assert.ok(keys.includes('designer'));
    assert.ok(keys.includes('academic'));
});

test('MODEL_GUIDE_LINKS entries have ja/en link objects with mdUrl and pdfUrl', () => {
    for (const entry of MODEL_GUIDE_LINKS) {
        for (const lang of ['ja', 'en']) {
            assert.ok(typeof entry.links[lang].mdUrl === 'string');
            assert.ok(typeof entry.links[lang].pdfUrl === 'string');
        }
    }
});

// STATUS_REPORT_LINKS structure

test('STATUS_REPORT_LINKS has ja and en entries', () => {
    assert.ok('ja' in STATUS_REPORT_LINKS);
    assert.ok('en' in STATUS_REPORT_LINKS);
});

test('STATUS_REPORT_LINKS ja/en have mdUrl and pdfUrl', () => {
    for (const lang of ['ja', 'en']) {
        assert.ok(typeof STATUS_REPORT_LINKS[lang].mdUrl === 'string');
        assert.ok(typeof STATUS_REPORT_LINKS[lang].pdfUrl === 'string');
    }
});
