import test from 'node:test';
import assert from 'node:assert/strict';

import { getReportsStrings, getDomainReportTitle } from '../src/reports/strings.js';

// STRINGS object structure

test('getReportsStrings ja has required top-level keys', () => {
    const s = getReportsStrings('ja');
    const required = [
        'featureRead', 'features', 'tabTopics', 'openStatus', 'statusReportTitle',
        'metricGenerated', 'metricTotal', 'filterAll', 'filterGroupAria',
        'levelLegend', 'levelLegendUnavailable', 'levelLegendPrefix', 'levelLegendSingle',
        'scopeNote', 'empty', 'error',
        'modalTitleDefault', 'modalLoading', 'modalError',
        'modalOpenPdf', 'modalPdfPending', 'modalModel', 'modalGenerated',
    ];
    for (const key of required) {
        assert.ok(key in s, `missing key: ${key}`);
    }
});

test('getReportsStrings en has required top-level keys', () => {
    const s = getReportsStrings('en');
    const required = [
        'featureRead', 'features', 'tabTopics', 'openStatus', 'statusReportTitle',
        'metricGenerated', 'metricTotal', 'filterAll', 'filterGroupAria',
        'scopeNote', 'empty', 'error',
        'modalOpenPdf', 'modalPdfPending',
    ];
    for (const key of required) {
        assert.ok(key in s, `missing key: ${key}`);
    }
});

test('getReportsStrings features has general/designer/academic keys for ja', () => {
    const { features } = getReportsStrings('ja');
    for (const key of ['general', 'designer', 'academic']) {
        assert.ok(key in features, `missing feature key: ${key}`);
        assert.ok(typeof features[key].title === 'string');
        assert.ok(typeof features[key].modalTitle === 'string');
        assert.ok(typeof features[key].description === 'string');
    }
});

test('getReportsStrings features has general/designer/academic keys for en', () => {
    const { features } = getReportsStrings('en');
    for (const key of ['general', 'designer', 'academic']) {
        assert.ok(key in features, `missing feature key: ${key}`);
        assert.ok(typeof features[key].title === 'string');
        assert.ok(typeof features[key].modalTitle === 'string');
        assert.ok(typeof features[key].description === 'string');
    }
});

// Language fallback

test('getReportsStrings falls back to ja for unknown lang', () => {
    const fallback = getReportsStrings('fr');
    const ja = getReportsStrings('ja');
    assert.equal(fallback.tabTopics, ja.tabTopics);
});

test('getReportsStrings falls back to ja for undefined', () => {
    const fallback = getReportsStrings(undefined);
    const ja = getReportsStrings('ja');
    assert.equal(fallback.scopeNote, ja.scopeNote);
});

test('getReportsStrings uppercase EN falls back to ja (strict lang comparison)', () => {
    // normalizeLang uses strict equality to 'en', so 'EN' falls back to 'ja'. Documents current behavior.
    const result = getReportsStrings('EN');
    const ja = getReportsStrings('ja');
    assert.equal(result.featureRead, ja.featureRead);
});

// getDomainReportTitle

test('getDomainReportTitle returns nameJa for ja', () => {
    const report = { id: 'A01', nameJa: '生存-信頼軸', nameEn: 'Survival-Trust Axis' };
    assert.equal(getDomainReportTitle(report, 'ja'), '生存-信頼軸');
});

test('getDomainReportTitle returns nameEn for en', () => {
    const report = { id: 'A01', nameJa: '生存-信頼軸', nameEn: 'Survival-Trust Axis' };
    assert.equal(getDomainReportTitle(report, 'en'), 'Survival-Trust Axis');
});

test('getDomainReportTitle falls back to nameEn when nameJa is absent', () => {
    const report = { id: 'B01', nameEn: 'Fallback Name' };
    assert.equal(getDomainReportTitle(report, 'ja'), 'Fallback Name');
});

test('getDomainReportTitle returns empty string for null report', () => {
    assert.equal(getDomainReportTitle(null, 'ja'), '');
});

test('getDomainReportTitle trims whitespace from label', () => {
    const report = { id: 'C01', nameJa: '  trimmed  ', nameEn: 'Trimmed' };
    assert.equal(getDomainReportTitle(report, 'ja'), 'trimmed');
});
