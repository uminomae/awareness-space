function formatDevVersionLabel(version) {
    return typeof version === 'string' && version
        ? version.replace(/\.\d+$/, '')
        : '';
}

export function applyMainDevChrome({
    devMode = false,
    devVersion = '',
    devDate = '',
} = {}) {
    const versionNode = document.getElementById('dev-version-inline');
    const componentsLink = document.getElementById('dev-components-link');

    if (versionNode) {
        if (devMode) {
            versionNode.hidden = false;
            versionNode.textContent = formatDevVersionLabel(devVersion);
            versionNode.title = `${devVersion} / ${devDate}`;
        } else {
            versionNode.hidden = true;
            versionNode.textContent = '';
        }
    }

    if (componentsLink) {
        componentsLink.classList.toggle('is-visible', devMode);
    }
}

export function createMainDevStatsTicker() {
    let begin = () => {};
    let end = () => {};
    let rafId = 0;

    function tick() {
        begin();
        end();
        rafId = window.requestAnimationFrame(tick);
    }

    return {
        setHandlers(nextBegin, nextEnd) {
            begin = typeof nextBegin === 'function' ? nextBegin : (() => {});
            end = typeof nextEnd === 'function' ? nextEnd : (() => {});
        },
        start() {
            if (rafId) return;
            rafId = window.requestAnimationFrame(tick);
        },
    };
}
