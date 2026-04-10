import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const defaultState = {
    noiseScale: 0.62,
    timeSpeed: 1.0,
    densityLow: 0.40,
    densityHigh: 0.66,
    bodyGain: 0.25,
    pulseGain: 0.24,
    edgeWidth: 0.08,
    saturation: 1.8,
    vignette: 0.40,
    bloomStrength: 0.18,
    bloomRadius: 0.12,
    bloomThreshold: 0.88,
    bgTop: '#d1deef',
    bgMid: '#90abc8',
    bgLow: '#3d5066',
    bodyCool: '#00030d',
    bodyWarm: '#00081b',
    bodyHot: '#001543',
    pulseHot: '#0099ff',
    pulseCool: '#0033cc',
};
const state = { ...defaultState };

let scene, camera, renderer, composer, bloomPass, material, animationId;
const uniforms = {
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2() },
    uNoiseScale: { value: state.noiseScale },
    uTimeSpeed: { value: state.timeSpeed },
    uDensityLow: { value: state.densityLow },
    uDensityHigh: { value: state.densityHigh },
    uBodyGain: { value: state.bodyGain },
    uPulseGain: { value: state.pulseGain },
    uEdgeWidth: { value: state.edgeWidth },
    uSaturation: { value: state.saturation },
    uVignette: { value: state.vignette },
    uBgTop: { value: new THREE.Color(state.bgTop) },
    uBgMid: { value: new THREE.Color(state.bgMid) },
    uBgLow: { value: new THREE.Color(state.bgLow) },
    uBodyCool: { value: new THREE.Color(state.bodyCool) },
    uBodyWarm: { value: new THREE.Color(state.bodyWarm) },
    uBodyHot: { value: new THREE.Color(state.bodyHot) },
    uPulseHot: { value: new THREE.Color(state.pulseHot) },
    uPulseCool: { value: new THREE.Color(state.pulseCool) },
};

const vertexShader = `
    void main() {
        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uNoiseScale;
    uniform float uTimeSpeed;
    uniform float uDensityLow;
    uniform float uDensityHigh;
    uniform float uBodyGain;
    uniform float uPulseGain;
    uniform float uEdgeWidth;
    uniform float uSaturation;
    uniform float uVignette;
    uniform vec3 uBgTop;
    uniform vec3 uBgMid;
    uniform vec3 uBgLow;
    uniform vec3 uBodyCool;
    uniform vec3 uBodyWarm;
    uniform vec3 uBodyHot;
    uniform vec3 uPulseHot;
    uniform vec3 uPulseCool;
    // 3D gradient noise
    vec3 hash33(vec3 p) {
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yxz + 19.19);
        return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
    }
    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
                    dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
                    dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
            mix(mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
                    dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
                    dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
    }
    mat3 rot3(float a) {
        float c = cos(a), s = sin(a);
        return mat3(c,s,0, -s,c,0, 0,0,1) *
               mat3(1,0,0, 0,c,s, 0,-s,c);
    }
    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        mat3 m = rot3(0.5);
        for(int i = 0; i < 4; i++) {
            f += amp * (noise(p) * 0.5 + 0.5);
            p = m * p * 2.0 + vec3(100.0) + uTime * uTimeSpeed * 0.25;
            amp *= 0.5;
        }
        return f;
    }
    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
        vec3 ro = vec3(0.0, 0.0, 4.1);
        vec3 rd = normalize(vec3(uv, -1.0));
        float skyMix = clamp(uv.y * 0.85 + 0.5, 0.0, 1.0);
        vec3 bgColor = mix(uBgLow, uBgMid, smoothstep(0.0, 0.55, skyMix));
        bgColor = mix(bgColor, uBgTop, smoothstep(0.45, 1.0, skyMix));
        vec3 color = bgColor;
        float t = 0.0;

        float absorption = 0.0;

        for(int i = 0; i < 36; i++) {
            if(absorption > 0.95) break;
            vec3 p = ro + rd * t;

            float n = fbm(p * uNoiseScale + vec3(0.0, uTime * uTimeSpeed * 0.08, 0.0));

            float rawDensity = smoothstep(uDensityLow, uDensityHigh, n);
            if(rawDensity < 0.02) { t += 0.06; continue; }
            float liquidDensity = rawDensity * 0.8 + rawDensity * rawDensity * 0.2;
            float depth = t / 3.0;

            float heat = liquidDensity * liquidDensity;
            vec3 bodyColor = mix(uBodyCool, mix(uBodyWarm, uBodyHot, heat), liquidDensity);
            bodyColor *= (0.3 + heat * 0.7);
            float flicker = noise(p * 2.1 + uTime * uTimeSpeed * 0.45) * 0.5 + 0.5;
            bodyColor *= (0.7 + flicker * 0.5);

            float vortexCore = smoothstep(0.5, 1.0, liquidDensity);
            float rw1 = sin(n * 8.0 - uTime * uTimeSpeed * 3.8 + length(p.xz) * 1.8);
            float rw2 = sin(n * 5.5 + uTime * uTimeSpeed * 2.7 - length(p.xy) * 2.6);
            float rw3 = sin(p.z * 3.4 - uTime * uTimeSpeed * 4.2 + n * 9.0);
            float radPulse = smoothstep(0.8, 1.0, rw1) + smoothstep(0.85, 1.0, rw2) * 0.6 + smoothstep(0.9, 1.0, rw3) * 0.4;
            radPulse *= vortexCore;
            float edge = smoothstep(uEdgeWidth, 0.0, abs(n - 0.5));
            float ew = sin(p.x * 2.6 + p.y * 3.3 - uTime * uTimeSpeed * 3.1 + n * 8.0);
            float edgePulse = smoothstep(0.85, 1.0, ew) * edge;
            float pulse = radPulse + edgePulse;
            vec3 pulseColor = mix(uPulseHot, uPulseCool, depth);
            vec3 edgeGlow = pulseColor * pulse * 12.0;

            float stepDensity = liquidDensity * 0.06;
            float atten = exp(-t * 0.3);
            float transmit = 1.0 - absorption;
            color = color * (1.0 - stepDensity) + bodyColor * stepDensity * transmit * atten * uBodyGain;
            color += edgeGlow * uPulseGain * atten;
            absorption += stepDensity * transmit;

            t += 0.075;
        }
        color = color / (color + vec3(1.2));
        color = pow(color, vec3(1.0 / 1.8));
        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(luma), color, uSaturation);
        color *= 1.0 - length(uv) * uVignette;
        gl_FragColor = vec4(color, 1.0);
    }
`;

let resizeHandler = null;

function resizeRenderer() {
    if (!renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    composer.setSize(width, height);
    uniforms.uResolution.value.set(width, height);
}

export function init(container) {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        state.bloomStrength,
        state.bloomRadius,
        state.bloomThreshold,
    );
    composer.addPass(bloomPass);

    material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    resizeHandler = () => resizeRenderer();
    window.addEventListener('resize', resizeHandler);

    resizeRenderer();

    const clock = new THREE.Clock();
    function animate() {
        animationId = requestAnimationFrame(animate);
        uniforms.uTime.value = clock.getElapsedTime();
        composer.render();
    }

    applyState(state);
    animate();
}

export function applyState(nextState = {}) {
    Object.keys(state).forEach((key) => {
        const candidate = nextState[key];
        if (typeof state[key] === 'number' && typeof candidate === 'number') {
            state[key] = candidate;
        }
        if (typeof state[key] === 'string' && typeof candidate === 'string') {
            state[key] = candidate;
        }
    });

    uniforms.uNoiseScale.value = state.noiseScale;
    uniforms.uTimeSpeed.value = state.timeSpeed;
    uniforms.uDensityLow.value = state.densityLow;
    uniforms.uDensityHigh.value = state.densityHigh;
    uniforms.uBodyGain.value = state.bodyGain;
    uniforms.uPulseGain.value = state.pulseGain;
    uniforms.uEdgeWidth.value = state.edgeWidth;
    uniforms.uSaturation.value = state.saturation;
    uniforms.uVignette.value = state.vignette;
    uniforms.uBgTop.value.set(state.bgTop);
    uniforms.uBgMid.value.set(state.bgMid);
    uniforms.uBgLow.value.set(state.bgLow);
    uniforms.uBodyCool.value.set(state.bodyCool);
    uniforms.uBodyWarm.value.set(state.bodyWarm);
    uniforms.uBodyHot.value.set(state.bodyHot);
    uniforms.uPulseHot.value.set(state.pulseHot);
    uniforms.uPulseCool.value.set(state.pulseCool);
    if (bloomPass) {
        bloomPass.strength = state.bloomStrength;
        bloomPass.radius = state.bloomRadius;
        bloomPass.threshold = state.bloomThreshold;
    }
    window.__awarenessDevState = { variant: 'uzu', state: { ...state } };
}

export function cleanup() {
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (scene) {
        scene.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
    }
    if (composer) {
        composer.dispose();
        composer = null;
    }
    if (renderer) {
        const canvas = renderer.domElement;
        renderer.dispose();
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
        renderer = null;
    }
    bloomPass = null;
    scene = null;
    camera = null;
    material = null;
}
