import test from 'node:test';
import assert from 'node:assert/strict';

import {
    MODES_WITHOUT_CONTROL_GUIDE,
    shouldShowControlGuide,
    syncControlGuideVisibility,
} from '../src/ui/control-guide.js';
import {
    AVAILABLE_BACKGROUND_MODES,
    DEFAULT_MODE,
    normalizeMode,
} from '../src/background-mode.js';

test('background modes are single-mode raijin for public UI', () => {
    assert.deepEqual(AVAILABLE_BACKGROUND_MODES, ['raijin']);
    assert.equal(DEFAULT_MODE, 'raijin');
    assert.equal(normalizeMode('raijin'), 'raijin');
    assert.equal(normalizeMode('uzu'), 'raijin');
    assert.equal(normalizeMode('flow'), 'raijin');
});

test('control guide stays hidden for public background modes', () => {
    assert.equal(MODES_WITHOUT_CONTROL_GUIDE.has('raijin'), true);
    assert.equal(MODES_WITHOUT_CONTROL_GUIDE.has('uzu'), true);
    assert.equal(shouldShowControlGuide('raijin'), false);
    assert.equal(shouldShowControlGuide('uzu'), false);
    assert.equal(shouldShowControlGuide('orbit'), true);
});

test('syncControlGuideVisibility updates hidden and aria-hidden', () => {
    const guide = {
        hidden: false,
        attrs: {},
        setAttribute(name, value) {
            this.attrs[name] = value;
        },
    };
    const doc = {
        getElementById(id) {
            return id === 'control-guide' ? guide : null;
        },
    };

    assert.equal(syncControlGuideVisibility('raijin', doc), false);
    assert.equal(guide.hidden, true);
    assert.equal(guide.attrs['aria-hidden'], 'true');

    assert.equal(syncControlGuideVisibility('orbit', doc), true);
    assert.equal(guide.hidden, false);
    assert.equal(guide.attrs['aria-hidden'], 'false');
});
