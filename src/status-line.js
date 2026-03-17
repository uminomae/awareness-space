async function loadRuntimeStatus() {
    const response = await fetch('./assets/status/runtime.json', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`status runtime load failed: ${response.status}`);
    }
    return response.json();
}

function formatTokens(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'n/a';
    return value.toLocaleString('en-US');
}

function formatBgJobs(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '0';
    return String(value);
}

export async function initStatusLine() {
    const branchNode = document.getElementById('status-branch');
    const tokensNode = document.getElementById('status-tokens');
    const bgNode = document.getElementById('status-bg-jobs');
    if (!(branchNode instanceof HTMLElement) || !(tokensNode instanceof HTMLElement) || !(bgNode instanceof HTMLElement)) {
        return;
    }

    try {
        const status = await loadRuntimeStatus();
        branchNode.textContent = status.branch || 'develop';
        tokensNode.textContent = formatTokens(status.conversation_tokens_estimate);
        bgNode.textContent = formatBgJobs(status.background_jobs);
    } catch (error) {
        console.warn('[awareness-space] status line load failed:', error);
    }
}
