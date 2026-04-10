import test from 'node:test';
import assert from 'node:assert/strict';

// dom-helpers.js uses document.createElement internally.
// Node.js (without jsdom) does not provide a DOM environment.
// All functions in this module require a live DOM to execute.
// Tests here are intentionally skipped; the module can still be imported.
// DOM-dependent behavior is covered by browser integration tests or
// manual verification.

import { createFilterButton, createMetricCard } from '../src/reports/dom-helpers.js';

// Verify the module exports the expected function signatures.
test('dom-helpers exports createFilterButton as a function', () => {
    assert.equal(typeof createFilterButton, 'function');
});

test('dom-helpers exports createMetricCard as a function', () => {
    assert.equal(typeof createMetricCard, 'function');
});

// Runtime calls are skipped because document is not available in Node.js.
test('createFilterButton requires DOM (skip in Node.js)', (t) => {
    t.skip('document.createElement is not available in Node.js test runner');
});

test('createMetricCard requires DOM (skip in Node.js)', (t) => {
    t.skip('document.createElement is not available in Node.js test runner');
});
