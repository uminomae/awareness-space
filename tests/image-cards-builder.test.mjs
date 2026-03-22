import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
    buildImageCardsManifest,
    createAutoCardMeta,
    findOrphanImages,
    formatLocalDate,
    getImageCardCommentaryIssues,
    isDraftCardMeta,
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

test('formatLocalDate uses local calendar date', () => {
    const date = new Date(2026, 2, 22, 1, 2, 3);
    assert.equal(formatLocalDate(date), '2026-03-22');
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
        comment_ja: '図の見方と意味を短く説明する日本語コメントです。',
        comment_en: 'An English comment that briefly explains what the diagram shows and how to read it.',
        generated: '2026-03-21',
        generator_model: 'not_applicable',
        sort_order: 5,
    }));

    const { payload, skippedDrafts } = await buildImageCardsManifest({
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
    assert.deepEqual(skippedDrafts, []);

    const written = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    assert.equal(written.cards[0].comment_ja, '図の見方と意味を短く説明する日本語コメントです。');
});

test('createAutoCardMeta generates draft sidecar text', () => {
    const meta = createAutoCardMeta('intent', { generatedAt: '2026-03-21' });
    assert.equal(meta.title_ja, '意');
    assert.equal(meta.title_en, 'Intent');
    assert.match(meta.comment_ja, /^TODO:/);
    assert.equal(meta.generator_model, 'codex:auto-ingest-draft');
    assert.equal(meta.review_status, 'draft');
    assert.match(meta.review_notes, /short summary/i);
});

test('isDraftCardMeta detects draft status and legacy auto-ingest comments', () => {
    assert.equal(isDraftCardMeta({ review_status: 'draft', comment_ja: '手動コメント' }), true);
    assert.equal(isDraftCardMeta({
        comment_ja: 'Intent Love をテーマにした追加画像です。画像カードとして自動取り込みしています。',
    }), true);
    assert.equal(isDraftCardMeta({ comment_ja: '画像の見方を説明する手動コメントです。' }), false);
});

test('getImageCardCommentaryIssues rejects theme-only commentary', () => {
    const issues = getImageCardCommentaryIssues({
        title_ja: 'Intent Gorilla',
        comment_ja: 'Intent Gorilla をテーマにした追加画像です。',
        comment_en: 'An additional image card centered on Intent Gorilla.',
    });

    assert.match(issues.join(' | '), /interpret the image/);
});

test('getImageCardCommentaryIssues rejects meta commentary about reading the diagram', () => {
    const issues = getImageCardCommentaryIssues({
        title_ja: '保留と再評価',
        comment_ja: '判断の保留と再評価の流れを考えるためのメモです。関係の中で形を変える図として読めます。',
        comment_en: 'It can be read as a diagram of changing intent.',
    });

    assert.match(issues.join(' | '), /figure expresses|state the figure summary|read as a diagram/);
});

test('buildImageCardsManifest skips draft cards from public manifest', async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'awareness-image-cards-drafts-'));
    const itemsDir = path.join(tmpRoot, 'items');
    const manifestPath = path.join(tmpRoot, 'manifests', 'image-cards.json');
    await fs.mkdir(itemsDir, { recursive: true });

    await fs.writeFile(path.join(itemsDir, 'ready.png'), '');
    await fs.writeFile(path.join(itemsDir, 'ready.json'), JSON.stringify({
        title_ja: '公開カード',
        comment_ja: '可視要素と意味づけを短く説明する公開コメントです。',
        review_status: 'ready',
        generated: '2026-03-21',
    }));

    await fs.writeFile(path.join(itemsDir, 'draft.png'), '');
    await fs.writeFile(path.join(itemsDir, 'draft.json'), JSON.stringify({
        title_ja: '下書きカード',
        comment_ja: 'TODO: 手動で記述する',
        review_status: 'draft',
        generated: '2026-03-21',
    }));

    const { payload, skippedDrafts } = await buildImageCardsManifest({
        itemsDir,
        manifestPath,
        generatedAt: '2026-03-21',
    });

    assert.equal(payload.cards.length, 1);
    assert.equal(payload.cards[0].slug, 'ready');
    assert.deepEqual(skippedDrafts, [{ slug: 'draft', review_status: 'draft' }]);
});

test('buildImageCardsManifest rejects weak ready commentary', async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'awareness-image-cards-weak-'));
    const itemsDir = path.join(tmpRoot, 'items');
    const manifestPath = path.join(tmpRoot, 'manifests', 'image-cards.json');
    await fs.mkdir(itemsDir, { recursive: true });

    await fs.writeFile(path.join(itemsDir, 'weak.png'), '');
    await fs.writeFile(path.join(itemsDir, 'weak.json'), JSON.stringify({
        title_ja: 'Intent Gorilla',
        title_en: 'Intent Gorilla',
        comment_ja: 'Intent Gorilla をテーマにした追加画像です。',
        comment_en: 'An additional image card centered on Intent Gorilla.',
        review_status: 'ready',
        generated: '2026-03-21',
    }));

    await assert.rejects(
        () => buildImageCardsManifest({
            itemsDir,
            manifestPath,
            generatedAt: '2026-03-21',
        }),
        /weak commentary for weak\.json/,
    );
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
    assert.equal(sidecar.review_status, 'draft');
    assert.equal(result.payload.cards.length, 0);
    assert.deepEqual(result.skippedDrafts, [{ slug: 'intent', review_status: 'draft' }]);
});
