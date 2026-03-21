import fs from 'node:fs/promises';
import path from 'node:path';

import {
    buildImageCardsManifest,
    createAutoCardMeta,
    findOrphanImages,
} from './build-awareness-image-cards.mjs';

export async function ingestAwarenessImageCards({
    awarenessAssetsRoot = '/Users/uminomae/dev/pjdhiro/assets/awareness',
    generatedAt = new Date().toISOString().slice(0, 10),
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

    const payload = await buildImageCardsManifest({
        itemsDir,
        manifestPath,
        generatedAt,
    });

    return {
        created,
        payload,
    };
}

async function main() {
    const result = await ingestAwarenessImageCards();
    console.log(`image cards ingest complete: ${result.payload.cards.length} cards / created ${result.created.length} sidecars`);
    for (const filename of result.created) {
        console.log(`created: ${filename}`);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });
}
