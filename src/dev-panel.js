import {
    GROUP_HELP_JA,
    applySceneState,
    cloneSceneState,
    getDefaultSceneState,
    resolveVisibleParamGroups,
} from './dev-panel-data.js';
import {
    buildColorControl,
    buildRangeControl,
    buildToggleControl,
    formatHex,
    formatNumber,
    getControlDomId,
} from './dev-panel-ui.js';

export function initDevPanel({
    onStateChanged = null,
    panelStartsOpen = false,
    initialState = null,
    sceneVariant = 'raijin',
} = {}) {
    const sceneState = getDefaultSceneState(sceneVariant);
    if (initialState && typeof initialState === 'object') {
        applySceneState(sceneState, initialState, sceneVariant);
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dev-panel-toggle';
    toggleBtn.className = 'dev-panel-toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'PANEL';

    const panel = document.createElement('aside');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header">
            <h2 class="dev-panel-title">Dev Panel</h2>
            <button type="button" class="btn btn-sm btn-outline-light" id="dev-panel-close">Close</button>
        </div>
        <div class="dev-panel-body">
            <div class="accordion" id="dev-panel-accordion"></div>
            <div class="mt-3">
                <label class="form-label" for="dev-json">Config JSON</label>
                <textarea id="dev-json" class="form-control form-control-sm" rows="10"></textarea>
                <div class="dev-json-actions mt-2">
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-copy">Copy JSON</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-paste">Paste JSON</button>
                    <button type="button" class="btn btn-sm btn-primary" id="dev-json-apply">Apply JSON</button>
                </div>
                <div class="dev-json-status" id="dev-json-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    function applyFallbackLayoutIfNeeded() {
        const toggleStyle = window.getComputedStyle(toggleBtn);
        if (toggleStyle.position === 'static') {
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.top = '50%';
            toggleBtn.style.right = '0';
            toggleBtn.style.left = 'auto';
            toggleBtn.style.transform = 'translateY(-50%)';
            toggleBtn.style.zIndex = '1001';
        }

        const panelStyle = window.getComputedStyle(panel);
        if (panelStyle.position === 'static') {
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.right = '0';
            panel.style.width = 'min(92vw, 420px)';
            panel.style.height = '100vh';
            panel.style.zIndex = '1200';
            panel.style.background = 'rgba(7, 12, 24, 0.96)';
            panel.style.borderLeft = '1px solid rgba(140, 178, 255, 0.3)';
            panel.style.overflow = 'hidden';
        }
    }

    function hasActiveOffcanvas() {
        return Boolean(document.querySelector('.offcanvas.show, .offcanvas.showing'));
    }

    function syncToggleVisibility() {
        const isPanelOpen = panel.classList.contains('is-open') || panel.classList.contains('open');
        const shouldHide = isPanelOpen || hasActiveOffcanvas();
        toggleBtn.classList.toggle('is-hidden', shouldHide);
    }

    const offcanvasVisibilityEvents = [
        'show.bs.offcanvas',
        'shown.bs.offcanvas',
        'hide.bs.offcanvas',
        'hidden.bs.offcanvas',
    ];

    function setPanelOpen(nextOpen) {
        const isOpen = Boolean(nextOpen);
        panel.classList.toggle('is-open', isOpen);
        panel.classList.toggle('open', isOpen);
        panel.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
        panel.style.right = isOpen ? '0' : '-300px';
        syncToggleVisibility();
    }

    applyFallbackLayoutIfNeeded();
    setPanelOpen(panelStartsOpen);
    offcanvasVisibilityEvents.forEach((eventName) => {
        document.addEventListener(eventName, syncToggleVisibility);
    });
    syncToggleVisibility();

    const accordion = panel.querySelector('#dev-panel-accordion');
    const jsonArea = panel.querySelector('#dev-json');
    const jsonStatus = panel.querySelector('#dev-json-status');
    const controlIndex = new Map();
    const colorControlIndex = new Map();
    const visiblePanelGroups = resolveVisibleParamGroups(sceneVariant, sceneState);

    function emitStateChanged({ shouldSnapshot = true } = {}) {
        if (typeof onStateChanged === 'function') {
            try {
                onStateChanged(cloneSceneState(sceneState), { shouldSnapshot, sceneVariant });
            } catch (error) {
                console.warn('[dev-panel] onStateChanged callback failed:', error);
            }
        }
    }

    function refreshJson() {
        jsonArea.value = JSON.stringify(cloneSceneState(sceneState), null, 2);
    }

    function setStatus(message, isError = false) {
        jsonStatus.textContent = message;
        jsonStatus.style.color = isError ? 'rgba(255, 138, 138, 0.95)' : 'rgba(201, 221, 255, 0.8)';
    }

    function updateControlValue(path, value, step) {
        const entry = controlIndex.get(path);
        if (!entry) return;
        entry.input.value = String(value);
        entry.valueNode.textContent = formatNumber(value, step);
    }

    function registerControl(path, input, valueNode, step) {
        controlIndex.set(path, { input, valueNode, step });
    }

    function updateColorControlValue(path, value) {
        const entry = colorControlIndex.get(path);
        if (!entry) return;
        entry.input.value = formatHex(value);
        entry.valueNode.textContent = formatHex(value);
    }

    function registerColorControl(path, input, valueNode) {
        colorControlIndex.set(path, { input, valueNode });
    }

    visiblePanelGroups.forEach((group, idx) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const headerId = `dev-head-${group.id}`;
        const collapseId = `dev-collapse-${group.id}`;

        item.innerHTML = `
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${group.title}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#dev-panel-accordion">
                <div class="accordion-body"></div>
            </div>
        `;

        const body = item.querySelector('.accordion-body');
        const groupHelp = GROUP_HELP_JA[group.id];
        if (groupHelp) {
            const helpNode = document.createElement('p');
            helpNode.className = 'dev-group-help';
            helpNode.textContent = groupHelp;
            body.appendChild(helpNode);
        }

        group.fields.forEach((field) => {
            let node;
            if (group.type === 'toggle') {
                node = buildToggleControl({
                    group,
                    field,
                    sceneVariant,
                    notifyStateChanged: emitStateChanged,
                    refreshJson,
                });
            } else if (field.type === 'color') {
                node = buildColorControl({
                    group,
                    field,
                    sceneVariant,
                    notifyStateChanged: emitStateChanged,
                    refreshJson,
                    registerColorControl,
                });
            } else {
                node = buildRangeControl({
                    group,
                    field,
                    sceneVariant,
                    notifyStateChanged: emitStateChanged,
                    refreshJson,
                    registerControl,
                });
            }
            body.appendChild(node);
        });

        accordion.appendChild(item);
    });

    function syncUIFromState() {
        visiblePanelGroups.forEach((group) => {
            group.fields.forEach((field) => {
                const key = field.type === 'color' ? field.key : field[0];
                const path = `${group.id}.${key}`;
                if (group.type === 'toggle') {
                    const input = document.getElementById(getControlDomId(path));
                    if (input) input.checked = Boolean(sceneState[key]);
                    return;
                }
                if (field.type === 'color') {
                    updateColorControlValue(path, sceneState[key]);
                    return;
                }
                updateControlValue(path, sceneState[key], field[4]);
            });
        });
    }

    async function copyJson() {
        refreshJson();
        try {
            await navigator.clipboard.writeText(jsonArea.value);
            setStatus('Copied JSON to clipboard.');
        } catch {
            setStatus('Copy failed. Manual copy from textarea.', true);
        }
    }

    async function pasteJson() {
        try {
            const text = await navigator.clipboard.readText();
            jsonArea.value = text;
            applyJson();
        } catch {
            setStatus('Paste failed. Paste text manually.', true);
        }
    }

    function applyJson() {
        try {
            const payload = JSON.parse(jsonArea.value);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Invalid JSON object.');
            }
            applySceneState(sceneState, payload, sceneVariant);
            emitStateChanged();
            syncUIFromState();
            refreshJson();
            setStatus('Applied JSON to current state.');
        } catch (error) {
            setStatus(`JSON apply failed: ${error.message}`, true);
        }
    }

    toggleBtn.addEventListener('click', () => {
        const willOpen = !panel.classList.contains('is-open') && !panel.classList.contains('open');
        setPanelOpen(willOpen);
    });

    panel.querySelector('#dev-panel-close').addEventListener('click', () => {
        setPanelOpen(false);
    });
    panel.querySelector('#dev-json-copy').addEventListener('click', copyJson);
    panel.querySelector('#dev-json-paste').addEventListener('click', pasteJson);
    panel.querySelector('#dev-json-apply').addEventListener('click', applyJson);

    syncUIFromState();
    refreshJson();

    return {
        open() {
            setPanelOpen(true);
        },
        close() {
            setPanelOpen(false);
        },
        destroy() {
            offcanvasVisibilityEvents.forEach((eventName) => {
                document.removeEventListener(eventName, syncToggleVisibility);
            });
            toggleBtn.remove();
            panel.remove();
        },
        getStateSnapshot() {
            return cloneSceneState(sceneState);
        },
    };
}
