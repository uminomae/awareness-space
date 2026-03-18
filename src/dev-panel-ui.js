import { getFieldHelpText } from './dev-panel-data.js';

function normalizeHex(value) {
    if (typeof value !== 'string') return '#000000';
    const trimmed = value.trim();
    return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed.toLowerCase() : '#000000';
}

export function formatNumber(value, step) {
    const decimals = String(step).includes('.')
        ? String(step).split('.')[1].length
        : 0;
    return Number(value).toFixed(Math.min(decimals, 4));
}

export function formatHex(value) {
    return normalizeHex(value);
}

function toDomId(path) {
    return `dev-${path.replace(/[^a-z0-9_-]+/gi, '-')}`;
}

export function buildToggleControl({ group, field, sceneVariant, notifyStateChanged, refreshJson }) {
    const [key, label] = field;
    const path = `${group.id}.${key}`;
    const inputId = toDomId(path);
    const wrapper = document.createElement('div');
    wrapper.className = 'form-check form-switch dev-row';

    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type = 'checkbox';
    input.id = inputId;
    input.checked = Boolean(group.target[key]);

    const labelEl = document.createElement('label');
    labelEl.className = 'form-check-label';
    labelEl.setAttribute('for', inputId);
    labelEl.textContent = label;

    input.addEventListener('change', () => {
        group.target[key] = input.checked;
        notifyStateChanged();
        refreshJson();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(labelEl);
    return wrapper;
}

export function buildRangeControl({ group, field, sceneVariant, notifyStateChanged, refreshJson, registerControl }) {
    const [key, label, min, max, step] = field;
    const path = `${group.id}.${key}`;
    const inputId = toDomId(path);

    const wrapper = document.createElement('div');
    wrapper.className = 'dev-row';

    const meta = document.createElement('div');
    meta.className = 'dev-row-meta';

    const labelEl = document.createElement('label');
    labelEl.className = 'form-label';
    labelEl.setAttribute('for', inputId);
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'dev-value';
    valueEl.textContent = formatNumber(group.target[key], step);

    meta.appendChild(labelEl);
    meta.appendChild(valueEl);

    const input = document.createElement('input');
    input.className = 'form-range';
    input.type = 'range';
    input.id = inputId;
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(group.target[key]);

    input.addEventListener('input', () => {
        const nextValue = Number(input.value);
        group.target[key] = nextValue;
        valueEl.textContent = formatNumber(nextValue, step);
        notifyStateChanged({ shouldSnapshot: false });
    });

    input.addEventListener('change', () => {
        notifyStateChanged({ shouldSnapshot: true });
        refreshJson();
    });

    registerControl(path, input, valueEl, step);

    const helpText = getFieldHelpText(sceneVariant, group.id, key);
    wrapper.appendChild(meta);
    wrapper.appendChild(input);
    if (helpText) {
        const help = document.createElement('div');
        help.className = 'dev-row-help';
        help.textContent = helpText;
        wrapper.appendChild(help);
    }
    return wrapper;
}

export function buildColorControl({ group, field, sceneVariant, notifyStateChanged, refreshJson, registerColorControl }) {
    const { key, label } = field;
    const path = `${group.id}.${key}`;
    const inputId = toDomId(path);

    const wrapper = document.createElement('div');
    wrapper.className = 'dev-row';

    const meta = document.createElement('div');
    meta.className = 'dev-row-meta';

    const labelEl = document.createElement('label');
    labelEl.className = 'form-label';
    labelEl.setAttribute('for', inputId);
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'dev-value';
    valueEl.textContent = formatHex(group.target[key]);

    meta.appendChild(labelEl);
    meta.appendChild(valueEl);

    const input = document.createElement('input');
    input.className = 'form-control form-control-color';
    input.type = 'color';
    input.id = inputId;
    input.value = formatHex(group.target[key]);
    input.title = label;

    input.addEventListener('input', () => {
        group.target[key] = normalizeHex(input.value);
        valueEl.textContent = formatHex(group.target[key]);
        notifyStateChanged({ shouldSnapshot: false });
    });

    input.addEventListener('change', () => {
        notifyStateChanged({ shouldSnapshot: true });
        refreshJson();
    });

    registerColorControl(path, input, valueEl);

    const helpText = getFieldHelpText(sceneVariant, group.id, key);
    wrapper.appendChild(meta);
    wrapper.appendChild(input);
    if (helpText) {
        const help = document.createElement('div');
        help.className = 'dev-row-help';
        help.textContent = helpText;
        wrapper.appendChild(help);
    }
    return wrapper;
}

export function getControlDomId(path) {
    return toDomId(path);
}
