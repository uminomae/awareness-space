import test from 'node:test';
import assert from 'node:assert/strict';

import { dict } from '../src/i18n/dict.js';
import { applyPageLanguageToDocument } from '../src/page-language.js';

class MockElement {
    constructor({ dataset = {}, textContent = '', attributes = {} } = {}) {
        this.dataset = dataset;
        this.textContent = textContent;
        this.attributes = { ...attributes };
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    getAttributeNames() {
        return Object.keys(this.attributes);
    }
}

function createMockDocument() {
    const elementsById = new Map([
        ['title-h1', new MockElement()],
        ['topbar-main-title', new MockElement()],
        ['credit-collab', new MockElement()],
        ['lang-toggle', new MockElement()],
        ['graphic-switcher', new MockElement()],
        ['reports-ai-notice', new MockElement()],
        ['model-section-heading', new MockElement()],
        ['offcanvas-sections-title', new MockElement()],
        ['offcanvas-model-link', new MockElement()],
        ['about-trigger', new MockElement()],
        ['about-overlay-title', new MockElement()],
        ['about-close', new MockElement()],
    ]);

    const graphicLabel = new MockElement();
    const graphicRaijin = new MockElement({
        textContent: '風神雷神',
        attributes: { 'data-i18n': 'graphicModeRaijin' },
    });
    const translatedNode = new MockElement({
        textContent: '生存と間主観性から、意識を捉え直す。',
        attributes: { 'data-i18n': 'heroTaglinePrimary' },
    });
    const attrNode = new MockElement({
        attributes: { 'data-i18n-attr-aria-label': 'graphicSwitcherAria' },
    });
    const allNodes = [graphicRaijin, translatedNode, attrNode];

    return {
        title: '意識とは',
        documentElement: { lang: 'ja' },
        getElementById(id) {
            return elementsById.get(id) || null;
        },
        querySelector(selector) {
            if (selector === '.graphic-switcher-label') return graphicLabel;
            if (selector === '[data-graphic-mode="raijin"]') return graphicRaijin;
            return null;
        },
        querySelectorAll(selector) {
            if (selector === '[data-i18n]') return [graphicRaijin, translatedNode];
            if (selector === '*') return allNodes;
            return [];
        },
        nodes: {
            ...Object.fromEntries(elementsById),
            graphicLabel,
            graphicRaijin,
            translatedNode,
            attrNode,
        },
    };
}

test('english page dictionary contains issue-77 strings', () => {
    const page = dict.en.page;
    const about = dict.en.about;
    assert.equal(page.documentTitle, 'What Is Awareness — pjdhiro');
    assert.equal(page.topbarCollab, 'Working with AI collaboration');
    assert.equal(page.graphicSwitcherLabel, 'Background');
    assert.equal(page.graphicSwitcherAria, 'Switch background graphics');
    assert.equal(page.graphicModeRaijin, 'Fujin-Raijin');
    assert.equal(about.triggerAria, 'About this page');
    assert.equal(about.closeAria, 'Close');
});

test('applyPageLanguageToDocument updates page chrome in english', () => {
    const doc = createMockDocument();
    applyPageLanguageToDocument(doc, 'en');

    assert.equal(doc.title, 'What Is Awareness — pjdhiro');
    assert.equal(doc.documentElement.lang, 'en');
    assert.equal(doc.nodes['title-h1'].textContent, 'What Is Awareness');
    assert.equal(doc.nodes['topbar-main-title'].textContent, 'What Is Awareness');
    assert.equal(doc.nodes['credit-collab'].textContent, 'Working with AI collaboration');
    assert.equal(doc.nodes.graphicLabel.textContent, 'Background');
    assert.equal(doc.nodes.graphicRaijin.textContent, 'Fujin-Raijin');
    assert.equal(doc.nodes['graphic-switcher'].attributes['aria-label'], 'Switch background graphics');
    assert.equal(doc.nodes['lang-toggle'].textContent, '日本語');
    assert.equal(doc.nodes['lang-toggle'].attributes['aria-label'], 'Switch language to Japanese');
    assert.equal(doc.nodes.translatedNode.textContent, 'Rethinking awareness from survival and intersubjectivity.');
    assert.equal(doc.nodes.attrNode.attributes['aria-label'], 'Switch background graphics');
    assert.equal(doc.nodes['offcanvas-model-link'].textContent, 'MODEL / Awareness Model');
    assert.equal(doc.nodes['about-trigger'].attributes['aria-label'], 'About this page');
    assert.equal(doc.nodes['about-overlay-title'].textContent, 'About this page');
    assert.equal(doc.nodes['about-close'].attributes['aria-label'], 'Close');
});
