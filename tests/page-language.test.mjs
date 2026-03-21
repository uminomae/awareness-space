import test from 'node:test';
import assert from 'node:assert/strict';

import { dict } from '../src/i18n/dict.js';
import { applyPageLanguageToDocument } from '../src/page-language.js';

class MockElement {
    constructor({ dataset = {}, textContent = '' } = {}) {
        this.dataset = dataset;
        this.textContent = textContent;
        this.attributes = {};
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
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
        ['offcanvas-research-link', new MockElement()],
    ]);

    const graphicLabel = new MockElement();
    const graphicRaijin = new MockElement({
        dataset: { ja: '風神雷神', en: 'Fujin-Raijin' },
    });
    const bilingualNode = new MockElement({
        dataset: { ja: '生存と間主観性から、意識を捉え直す。', en: 'Rethinking awareness from survival and intersubjectivity.' },
        textContent: '生存と間主観性から、意識を捉え直す。',
    });

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
            if (selector === '[data-ja][data-en]') return [bilingualNode, graphicRaijin];
            return [];
        },
        nodes: {
            ...Object.fromEntries(elementsById),
            graphicLabel,
            graphicRaijin,
            bilingualNode,
        },
    };
}

test('english page dictionary contains issue-77 strings', () => {
    const page = dict.en.page;
    assert.equal(page.documentTitle, 'What Is Awareness');
    assert.equal(page.topbarCollab, 'Working with AI collaboration');
    assert.equal(page.graphicSwitcherLabel, 'Background');
    assert.equal(page.graphicSwitcherAria, 'Switch background graphics');
    assert.equal(page.graphicModeRaijin, 'Fujin-Raijin');
});

test('applyPageLanguageToDocument updates page chrome in english', () => {
    const doc = createMockDocument();
    applyPageLanguageToDocument(doc, 'en');

    assert.equal(doc.title, 'What Is Awareness');
    assert.equal(doc.documentElement.lang, 'en');
    assert.equal(doc.nodes['title-h1'].textContent, 'What Is Awareness');
    assert.equal(doc.nodes['topbar-main-title'].textContent, 'What Is Awareness');
    assert.equal(doc.nodes['credit-collab'].textContent, 'Working with AI collaboration');
    assert.equal(doc.nodes.graphicLabel.textContent, 'Background');
    assert.equal(doc.nodes.graphicRaijin.textContent, 'Fujin-Raijin');
    assert.equal(doc.nodes['graphic-switcher'].attributes['aria-label'], 'Switch background graphics');
    assert.equal(doc.nodes['lang-toggle'].textContent, '日本語');
    assert.equal(doc.nodes['lang-toggle'].attributes['aria-label'], 'Switch language to Japanese');
    assert.equal(doc.nodes.bilingualNode.textContent, 'Rethinking awareness from survival and intersubjectivity.');
    assert.equal(doc.nodes['offcanvas-model-link'].textContent, 'MODEL / Awareness Model');
    assert.equal(doc.nodes['offcanvas-research-link'].textContent, 'RESEARCH / Survey and Reports');
});
