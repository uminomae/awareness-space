import { DEV_VERSION, DEV_VERSION_DATE } from './version.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { runMainOrchestrator } from './core/main-orchestrator.js';
import { createMainRuntimeContext } from './main-runtime-context.js';

installStartupErrorHandlers();

function startMainApp() {
    const runtimeContext = createMainRuntimeContext();
    return runMainOrchestrator({
        runtimeContext,
        devVersion: DEV_VERSION,
        devDate: DEV_VERSION_DATE,
    });
}

try {
    startMainApp().catch((error) => {
        console.error('[awareness-space] init failed:', error);
        showStartupErrorOverlay(error);
    });
} catch (error) {
    console.error('[awareness-space] bootstrap failed:', error);
    showStartupErrorOverlay(error);
}
