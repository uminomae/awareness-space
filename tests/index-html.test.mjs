import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

test('graphic switcher exposes only Fujin-Raijin in markup', () => {
    const modeMatches = [...indexHtml.matchAll(/data-graphic-mode="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(modeMatches, ['raijin']);
    assert.match(indexHtml, /data-en="Fujin-Raijin"/);
    assert.doesNotMatch(indexHtml, /data-graphic-mode="uzu"/);
});

test('control-guide markup keeps an explanatory comment for hidden state', () => {
    assert.match(indexHtml, /control-guide は camera 操作がある背景用の説明枠/);
});

test('image cards section exists in model area', () => {
    assert.match(indexHtml, /id="image-card-grid"/);
    assert.match(indexHtml, /Interpretation Cards/);
});
