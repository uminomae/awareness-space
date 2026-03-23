import { getScenePresetVersion } from './dev-panel-data.js';
import { createSceneStateStore } from './dev-scene-state.js';

export function createMainRuntimeContext(search = window.location.search) {
    const params = new URLSearchParams(search);
    const devMode = params.has('dev');

    const sceneStateStore = createSceneStateStore({
        enabled: devMode,
        getPresetVersion: getScenePresetVersion,
    });

    return {
        devMode,
        sceneStateStore,
    };
}
