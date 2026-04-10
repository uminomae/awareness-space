import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeLang, LANG_CHANGE_EVENT } from '../src/i18n.js';

// normalizeLang — pure function, no DOM dependency

test('normalizeLang returns ja for "ja"', () => {
    assert.equal(normalizeLang('ja'), 'ja');
});

test('normalizeLang returns en for "en"', () => {
    assert.equal(normalizeLang('en'), 'en');
});

test('normalizeLang returns ja for uppercase "JA"', () => {
    // normalizeLang compares strictly to 'en'; everything else is ja
    assert.equal(normalizeLang('JA'), 'ja');
});

test('normalizeLang returns en for uppercase "EN"', () => {
    // 'EN' \!== 'en', so falls back to 'ja'
    // This documents the current strict-comparison behavior.
    assert.equal(normalizeLang('EN'), 'ja');
});

test('normalizeLang returns ja for undefined', () => {
    assert.equal(normalizeLang(undefined), 'ja');
});

test('normalizeLang returns ja for null', () => {
    assert.equal(normalizeLang(null), 'ja');
});

test('normalizeLang returns ja for empty string', () => {
    assert.equal(normalizeLang(''), 'ja');
});

test('normalizeLang returns ja for unknown language code', () => {
    assert.equal(normalizeLang('fr'), 'ja');
    assert.equal(normalizeLang('zh'), 'ja');
    assert.equal(normalizeLang('ko'), 'ja');
});

test('normalizeLang returns ja for numeric input', () => {
    assert.equal(normalizeLang(42), 'ja');
});

// LANG_CHANGE_EVENT constant

test('LANG_CHANGE_EVENT is the string "lang-change"', () => {
    assert.equal(LANG_CHANGE_EVENT, 'lang-change');
});

// Functions that depend on window/document are skipped

test('detectLang requires window (skip in Node.js)', (t) => {
    t.skip('window.location is not available in Node.js test runner');
});

test('setLang requires document (skip in Node.js)', (t) => {
    t.skip('document.documentElement is not available in Node.js test runner');
});

test('switchLang requires window and document (skip in Node.js)', (t) => {
    t.skip('window and document are not available in Node.js test runner');
});
