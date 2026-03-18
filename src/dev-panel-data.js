const SCENE_PRESET_VERSIONS = {
    raijin: '2026-03-18-raijin-v1',
    uzu: '2026-03-18-uzu-v1',
};

const DEFAULT_SCENE_STATES = {
    raijin: {
        renderScale: 0.85,
        speed: 0.22,
        pulseScale: 4.0,
        pulseThreshold: 0.68,
        glowGain: 1.0,
        densityLow: 0.32,
        densityHigh: 0.72,
        exposure: 1.0,
        vignette: 0.16,
        waterA: '#061824',
        waterB: '#0d6d67',
        glow: '#7df6ff',
    },
    uzu: {
        noiseScale: 0.62,
        timeSpeed: 1.0,
        densityLow: 0.40,
        densityHigh: 0.66,
        bodyGain: 0.25,
        pulseGain: 0.24,
        edgeWidth: 0.08,
        saturation: 1.8,
        vignette: 0.40,
        bloomStrength: 0.30,
        bloomRadius: 0.20,
        bloomThreshold: 0.80,
        bgTop: '#d1deef',
        bgMid: '#90abc8',
        bgLow: '#3d5066',
        bodyCool: '#00030d',
        bodyWarm: '#00081b',
        bodyHot: '#001543',
        pulseHot: '#0099ff',
        pulseCool: '#0033cc',
    },
};

const HELP_TEXT = {
    raijin: {
        performance: {
            renderScale: '内部レンダリング解像度です。下げると FPS は上がります。',
        },
        motion: {
            speed: '時間進行の速度です。',
            pulseScale: '発光パルスの強さです。',
            pulseThreshold: '発光が立ち上がる閾値です。',
            glowGain: '発光全体の明るさです。',
        },
        density: {
            densityLow: '液体が立ち上がる下限です。',
            densityHigh: '液体が充満する上限です。',
            exposure: '全体の露光量です。',
            vignette: '周辺減光の強さです。',
        },
        color: {
            waterA: '低密度側の色です。',
            waterB: '高密度側の色です。',
            glow: '発光色です。',
        },
    },
    uzu: {
        volume: {
            noiseScale: '渦のスケールです。',
            timeSpeed: '時間進行の倍率です。',
            densityLow: '液体が立ち上がる下限です。',
            densityHigh: '液体が充満する上限です。',
        },
        pulse: {
            bodyGain: '本体の見え方の強さです。',
            pulseGain: 'パルス発光の加算量です。',
            edgeWidth: '界面パルスが走る幅です。',
            saturation: '彩度ブースト量です。',
            vignette: '周辺減光の強さです。',
        },
        bloom: {
            bloomStrength: 'Bloom の強度です。',
            bloomRadius: 'Bloom の滲み半径です。',
            bloomThreshold: 'Bloom が発火する輝度閾値です。',
        },
        color: {
            bgTop: '背景上部の色です。',
            bgMid: '背景中域の色です。',
            bgLow: '背景下部の色です。',
            bodyCool: '液体外縁の色です。',
            bodyWarm: '液体中間の色です。',
            bodyHot: '液体中心の色です。',
            pulseHot: 'パルスの高温色です。',
            pulseCool: 'パルスの低温色です。',
        },
    },
};

const GROUP_HELP_JA = {
    performance: '描画負荷に直結する項目です。',
    motion: '時間進行とパルスの立ち上がり方を調整します。',
    density: '密度と露光のバランスを調整します。',
    color: '主要色を調整します。',
    volume: '渦のスケールと密度を調整します。',
    pulse: '液体本体とパルスの出方を調整します。',
    bloom: 'ポストエフェクトの滲みを調整します。',
};

const GROUPS_BY_SCENE = {
    raijin: [
        {
            id: 'performance',
            title: 'Performance',
            fields: [
                ['renderScale', 'Render Scale', 0.6, 1.0, 0.01],
            ],
        },
        {
            id: 'motion',
            title: 'Motion',
            fields: [
                ['speed', 'Speed', 0.05, 0.8, 0.01],
                ['pulseScale', 'Pulse Scale', 0.5, 10.0, 0.1],
                ['pulseThreshold', 'Pulse Threshold', 0.45, 0.95, 0.01],
                ['glowGain', 'Glow Gain', 0.2, 3.0, 0.05],
            ],
        },
        {
            id: 'density',
            title: 'Density',
            fields: [
                ['densityLow', 'Density Low', 0.1, 0.8, 0.01],
                ['densityHigh', 'Density High', 0.2, 0.95, 0.01],
                ['exposure', 'Exposure', 0.4, 2.2, 0.05],
                ['vignette', 'Vignette', 0.0, 0.5, 0.01],
            ],
        },
        {
            id: 'color',
            title: 'Color',
            fields: [
                { key: 'waterA', label: 'Water A', type: 'color' },
                { key: 'waterB', label: 'Water B', type: 'color' },
                { key: 'glow', label: 'Glow', type: 'color' },
            ],
        },
    ],
    uzu: [
        {
            id: 'volume',
            title: 'Volume',
            fields: [
                ['noiseScale', 'Noise Scale', 0.2, 1.5, 0.01],
                ['timeSpeed', 'Time Speed', 0.1, 2.2, 0.01],
                ['densityLow', 'Density Low', 0.1, 0.8, 0.01],
                ['densityHigh', 'Density High', 0.2, 0.9, 0.01],
            ],
        },
        {
            id: 'pulse',
            title: 'Pulse',
            fields: [
                ['bodyGain', 'Body Gain', 0.05, 0.7, 0.01],
                ['pulseGain', 'Pulse Gain', 0.05, 0.8, 0.01],
                ['edgeWidth', 'Edge Width', 0.01, 0.2, 0.01],
                ['saturation', 'Saturation', 0.5, 2.5, 0.05],
                ['vignette', 'Vignette', 0.0, 0.8, 0.01],
            ],
        },
        {
            id: 'bloom',
            title: 'Bloom',
            fields: [
                ['bloomStrength', 'Bloom Strength', 0.0, 1.5, 0.01],
                ['bloomRadius', 'Bloom Radius', 0.0, 1.0, 0.01],
                ['bloomThreshold', 'Bloom Threshold', 0.0, 1.5, 0.01],
            ],
        },
        {
            id: 'color',
            title: 'Color',
            fields: [
                { key: 'bgTop', label: 'BG Top', type: 'color' },
                { key: 'bgMid', label: 'BG Mid', type: 'color' },
                { key: 'bgLow', label: 'BG Low', type: 'color' },
                { key: 'bodyCool', label: 'Body Cool', type: 'color' },
                { key: 'bodyWarm', label: 'Body Warm', type: 'color' },
                { key: 'bodyHot', label: 'Body Hot', type: 'color' },
                { key: 'pulseHot', label: 'Pulse Hot', type: 'color' },
                { key: 'pulseCool', label: 'Pulse Cool', type: 'color' },
            ],
        },
    ],
};

function normalizeVariant(sceneVariant) {
    return sceneVariant === 'uzu' ? 'uzu' : 'raijin';
}

function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeColor(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const hex = value.trim();
    return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : fallback;
}

export function getScenePresetVersion(sceneVariant) {
    return SCENE_PRESET_VERSIONS[normalizeVariant(sceneVariant)];
}

export function getDefaultSceneState(sceneVariant) {
    return cloneJson(DEFAULT_SCENE_STATES[normalizeVariant(sceneVariant)]);
}

export function cloneSceneState(state) {
    return cloneJson(state);
}

export function applySceneState(target, payload, sceneVariant) {
    if (!target || typeof target !== 'object' || !payload || typeof payload !== 'object') return target;

    const variant = normalizeVariant(sceneVariant);
    const defaults = DEFAULT_SCENE_STATES[variant];
    Object.keys(defaults).forEach((key) => {
        const fallback = defaults[key];
        const nextValue = payload[key];
        if (typeof fallback === 'number') {
            if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
                target[key] = nextValue;
            }
            return;
        }
        target[key] = normalizeColor(nextValue, fallback);
    });

    return target;
}

export function resolveVisibleParamGroups(sceneVariant, target) {
    const variant = normalizeVariant(sceneVariant);
    return (GROUPS_BY_SCENE[variant] || []).map((group) => ({
        ...group,
        target,
    }));
}

export function getFieldHelpText(sceneVariant, groupId, key) {
    const variant = normalizeVariant(sceneVariant);
    return HELP_TEXT[variant]?.[groupId]?.[key] || '';
}

export { GROUP_HELP_JA };
