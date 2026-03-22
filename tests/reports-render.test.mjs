import test from 'node:test';
import assert from 'node:assert/strict';

import { getDomainReportTitle, getReportsStrings } from '../src/reports/render.js';

test('getDomainReportTitle omits internal report ids from public titles', () => {
    const report = {
        id: 'A01',
        nameJa: '生存-信頼軸',
        nameEn: 'Survival-Trust Axis',
    };

    assert.equal(getDomainReportTitle(report, 'ja'), '生存-信頼軸');
    assert.equal(getDomainReportTitle(report, 'en'), 'Survival-Trust Axis');
});

test('reports scope note avoids published and integrated wording', () => {
    const ja = getReportsStrings('ja');
    const en = getReportsStrings('en');

    assert.doesNotMatch(ja.scopeNote, /公開中|統合版/);
    assert.doesNotMatch(en.scopeNote, /published|integrated synthesis/i);
});
