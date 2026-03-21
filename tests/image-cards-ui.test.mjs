import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildImageCardModalHtml,
    localizeImageCard,
    sortImageCards,
} from '../src/image-cards.js';

test('localizeImageCard falls back between ja and en fields', () => {
    const card = {
        title_ja: '日本語タイトル',
        comment_ja: '日本語コメント',
        alt_ja: '日本語alt',
    };

    const ja = localizeImageCard(card, 'ja');
    const en = localizeImageCard(card, 'en');

    assert.equal(ja.title, '日本語タイトル');
    assert.equal(en.title, '日本語タイトル');
    assert.equal(en.comment, '日本語コメント');
    assert.equal(en.alt, '日本語alt');
});

test('sortImageCards orders by sort_order then slug', () => {
    const sorted = sortImageCards([
        { slug: 'b', sort_order: 20 },
        { slug: 'a', sort_order: 20 },
        { slug: 'c', sort_order: 5 },
    ]);

    assert.deepEqual(sorted.map((card) => card.slug), ['c', 'a', 'b']);
});

test('buildImageCardModalHtml includes image, comment, and links', () => {
    const html = buildImageCardModalHtml({
        image: 'image-cards/items/intent.jpg',
        title_ja: '意',
        comment_ja: '簡単紹介コメント',
        alt_ja: '意を示す画像',
        source_url: 'https://example.com/source',
    }, 'ja');

    assert.match(html, /img-fluid/);
    assert.match(html, /簡単紹介コメント/);
    assert.match(html, /画像を開く/);
    assert.match(html, /出典/);
});
