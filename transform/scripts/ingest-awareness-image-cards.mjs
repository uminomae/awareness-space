import fs from 'node:fs/promises';
import path from 'node:path';

import {
    buildImageCardsManifest,
    createAutoCardMeta,
    findOrphanImages,
    formatLocalDate,
} from './build-awareness-image-cards.mjs';

export async function ingestAwarenessImageCards({
    awarenessAssetsRoot = '/Users/uminomae/dev/pjdhiro/assets/awareness',
    generatedAt = formatLocalDate(),
} = {}) {
    const itemsDir = path.join(awarenessAssetsRoot, 'image-cards/items');
    const manifestPath = path.join(awarenessAssetsRoot, 'manifests/image-cards.json');
    const orphanImages = await findOrphanImages(itemsDir);
    const created = [];

    for (const imageName of orphanImages) {
        const slug = path.basename(imageName, path.extname(imageName));
        const metaPath = path.join(itemsDir, `${slug}.json`);
        const meta = createAutoCardMeta(slug, { generatedAt });
        await fs.writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
        created.push(path.basename(metaPath));
    }

    const { payload, skippedDrafts } = await buildImageCardsManifest({
        itemsDir,
        manifestPath,
        generatedAt,
    });

    return {
        created,
        payload,
        skippedDrafts,
    };
}

async function main() {
    const result = await ingestAwarenessImageCards();
    console.log(`image cards ingest complete: ${result.payload.cards.length} cards / created ${result.created.length} draft sidecars / skipped ${result.skippedDrafts.length} drafts`);
    for (const filename of result.created) {
        console.log(`created draft sidecar: ${filename}`);
    }
    for (const draft of result.skippedDrafts) {
        console.log(`draft not published: ${draft.slug}`);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
}
