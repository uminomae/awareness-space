import { normalizeLang } from '../i18n.js';

const STRINGS = {
    ja: {
        featureRead: 'ガイドを開く',
        features: {
            general: {
                title: 'General',
                modalTitle: '意識とは何か — 身体・予測・情動・社会性から間主観性へ',
                description: '全体像を初めて読む人向けの解説。',
            },
            designer: {
                title: 'Designer',
                modalTitle: '意識の探索を観察の手がかりに — 教育・支援・チームの現場で',
                description: '教育・支援・チーム設計に引きつけて読むための解説。',
            },
            academic: {
                title: 'Academic',
                modalTitle: '意識と間主観性 — 神経現象学・心理学・哲学からの状況証拠',
                description: '理論的な比較軸まで含めて検討するための解説。',
            },
        },
        tabTopics: '調査トピックレポート',
        openStatus: '調査の現在地',
        openWiki: '用語 Wiki',
        openWikiAria: 'Project Design Wiki を新しいタブで開く',
        statusReportTitle: '調査の現在地',
        metricGenerated: 'manifest',
        metricTotal: 'topics',
        filterAll: 'すべて',
        filterGroupAria: '調査トピックレポート絞り込み',
        levelLegend: '進捗分類を読み込み中...',
        levelLegendUnavailable: '進捗分類を読み込めませんでした。',
        levelLegendPrefix: '進捗分類',
        levelLegendSingle: '{count}件 / {label}',
        scopeNote: '調査は進行中です。現在は意識モデル構成要素ごとの個別レポートを掲載しています。',
        empty: '表示できるレポートがありません。',
        error: '調査トピックレポート manifest の読み込みに失敗しました。',
        modalTitleDefault: 'Markdown',
        modalLoading: '読み込み中...',
        modalError: 'Markdown を読み込めませんでした。',
        modalOpenPdf: 'PDFを開く',
        modalPdfPending: 'PDF未提供',
        modalOpenWiki: 'Wiki を開く',
        modalOpenWikiAria: 'Project Design Wiki を新しいタブで開く',
        modalModel: 'モデル',
        modalGenerated: '生成日',
    },
    en: {
        featureRead: 'Open Guide',
        features: {
            general: {
                title: 'General',
                modalTitle: 'What Is Awareness? — From Body, Prediction, Emotion, and Sociality to Intersubjectivity',
                description: 'An explainer for readers who want the overall picture first.',
            },
            designer: {
                title: 'Designer',
                modalTitle: 'Turning the Exploration of Awareness into Observational Tools — For Education, Support, and Team Contexts',
                description: 'An explainer for education, support, and team design contexts.',
            },
            academic: {
                title: 'Academic',
                modalTitle: 'Awareness and Intersubjectivity — Circumstantial Evidence from Neurophenomenology, Psychology, and Philosophy',
                description: 'An explainer for readers who want the theoretical comparison points.',
            },
        },
        tabTopics: 'Topic Reports',
        openStatus: 'Research Status',
        openWiki: 'Term Wiki',
        openWikiAria: 'Open Project Design Wiki in a new tab',
        statusReportTitle: 'Research Status',
        metricGenerated: 'manifest',
        metricTotal: 'topics',
        filterAll: 'All',
        filterGroupAria: 'Filter topic reports',
        levelLegend: 'Loading progress taxonomy...',
        levelLegendUnavailable: 'Progress taxonomy unavailable.',
        levelLegendPrefix: 'Progress',
        levelLegendSingle: '{count} items / {label}',
        scopeNote: 'Research is still in progress. The current section lists individual reports for each awareness-model component.',
        empty: 'No reports available.',
        error: 'Failed to load topic reports manifest.',
        modalTitleDefault: 'Markdown',
        modalLoading: 'Loading...',
        modalError: 'Failed to load markdown.',
        modalOpenPdf: 'Open PDF',
        modalPdfPending: 'PDF unavailable',
        modalOpenWiki: 'Open Wiki',
        modalOpenWikiAria: 'Open Project Design Wiki in a new tab',
        modalModel: 'Model',
        modalGenerated: 'Generated',
    },
};

export function getReportsStrings(lang = 'ja') {
    return STRINGS[normalizeLang(lang)] || STRINGS.ja;
}

export function getDomainReportTitle(report, lang = 'ja') {
    if (!report) return '';
    const useJapanese = normalizeLang(lang) === 'ja';
    const domainLabel = useJapanese ? (report.nameJa || report.nameEn || '') : (report.nameEn || report.nameJa || '');
    return domainLabel.trim();
}
