import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
    buildImageCardsManifest,
    createAutoCardMeta,
    findOrphanImages,
    normalizeCardMeta,
    sortCards,
} from '../transform/scripts/build-awareness-image-cards.mjs';
import { ingestAwarenessImageCards } from '../transform/scripts/ingest-awareness-image-cards.mjs';

test('normalizeCardMeta requires ja title and comment', () => {
    assert.throws(() => normalizeCardMeta({ comment_ja: 'x' }), /title_ja is required/);
    assert.throws(() => normalizeCardMeta({ title_ja: 'x' }), /comment_ja is required/);
});

test('sortCards uses sort_order then slug', () => {
    const sorted = sortCards([
        { slug: 'b', sort_order: 20 },
        { slug: 'a', sort_order: 20 },
        { slug: 'z', sort_order: 10 },
    ]);
    assert.deepEqual(sorted.map((card) => card.slug), ['z', 'a', 'b']);
});

test('buildImageCardsManifest scans image+json sidecars and emits manifest', async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'awareness-image-cards-'));
    const itemsDir = path.join(tmpRoot, 'items');
    const manifestPath = path.join(tmpRoot, 'manifests', 'image-cards.json');
    await fs.mkdir(itemsDir, { recursive: true });

    await fs.writeFile(path.join(itemsDir, 'sample.png'), '');
    await fs.writeFile(path.join(itemsDir, 'sample.json'), JSON.stringify({
        title_ja: 'サンプル',
        title_en: 'Sample',
        comment_ja: '日本語コメント',
        comment_en: 'English comment',
        generated: '2026-03-21',
        generator_model: 'not_applicable',
        sort_order: 5,
    }));

    const payload = await buildImageCardsManifest({
        itemsDir,
        manifestPath,
        awarenessBasePath: 'image-cards/items',
        generatedAt: '2026-03-21',
    });

    assert.equal(payload.namespace, 'awareness');
    assert.equal(payload.cards.length, 1);
    assert.equal(payload.cards[0].id, 'IC01');
    assert.equal(payload.cards[0].image, 'image-cards/items/sample.png');
    assert.equal(payload.cards[0].title_en, 'Sample');

    const written = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    assert.equal(written.cards[0].comment_ja, '日本語コメント');
});

test('createAutoCardMeta generates provisional sidecar text', () => {
    const meta = createAutoCardMeta('intent', { generatedAt: '2026-03-21' });
    assert.equal(meta.title_ja, '意');
    assert.equal(meta.title_en, 'Intent');
    assert.match(meta.comment_ja, /自動取り込み/);
    assert.equal(meta.generator_model, 'codex:auto-ingest');
});

test('findOrphanImages finds image files without matching sidecars', async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'awareness-image-orphans-'));
    await fs.writeFile(path.join(tmpRoot, 'keep.png'), '');
    await fs.writeFile(path.join(tmpRoot, 'keep.json'), '{}');
    await fs.writeFile(path.join(tmpRoot, 'new.jpg'), '');

    const orphans = await findOrphanImages(tmpRoot);
    assert.deepEqual(orphans, ['new.jpg']);
});

test('ingestAwarenessImageCards creates sidecars for orphan images and rebuilds manifest', async () => {
    const awarenessRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'awareness-image-ingest-'));
    const itemsDir = path.join(awarenessRoot, 'image-cards', 'items');
    await fs.mkdir(itemsDir, { recursive: true });
    await fs.writeFile(path.join(itemsDir, 'intent.jpg'), '');

    const result = await ingestAwarenessImageCards({
        awarenessAssetsRoot: awarenessRoot,
        generatedAt: '2026-03-21',
    });

    assert.deepEqual(result.created, ['intent.json']);
    const sidecar = JSON.parse(await fs.readFile(path.join(itemsDir, 'intent.json'), 'utf8'));
    assert.equal(sidecar.title_en, 'Intent');
    assert.equal(result.payload.cards.length, 1);
    assert.equal(result.payload.cards[0].slug, 'intent');
});
