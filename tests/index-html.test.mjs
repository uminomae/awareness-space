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
    assert.match(indexHtml, /id="image-card-grid" class="row row-cols-1 row-cols-md-3 g-3 awareness-card-grid"/);
    assert.match(indexHtml, /Divergent Thinking Notes/);
    assert.match(indexHtml, /意識モデルについて思考した際のメモや図解です。/);
});

test('topbar includes creation-space navigation link', () => {
    assert.match(indexHtml, /id="topbar-creation-link"/);
    assert.match(indexHtml, /href="\.\.\/creation-space\/"/);
    assert.match(indexHtml, />creation<\/a>/);
});

test('hero overlay includes about trigger and modal shell', () => {
    assert.match(indexHtml, /id="about-trigger"/);
    assert.match(indexHtml, /class="about-trigger"/);
    assert.match(indexHtml, /id="about-modal"/);
    assert.match(indexHtml, /id="about-body"/);
    assert.match(indexHtml, /data-md-ja="\.\/assets\/about\/ja\.md"/);
    assert.match(indexHtml, /data-md-en="\.\/assets\/about\/en\.md"/);
});

test('reports scope note avoids published and integrated wording', () => {
    assert.match(indexHtml, /現在は意識モデル構成要素ごとの個別レポートを掲載しています。/);
    assert.doesNotMatch(indexHtml, /公開中ですが、統合版ではありません/);
});
