"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// Add a debug endpoint
router.get('/api/debug-news', (req, res) => {
    const apiKey = process.env.NEWS_API_KEY;
    res.json({
        apiKeyExists: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        environment: process.env.NODE_ENV || 'development'
    });
});
router.get('/api/golf-news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        // Get language from query parameter, default to 'en'
        const lang = req.query.lang || 'en';
        // Map the locale to NewsAPI supported languages
        // NewsAPI supports: ar, de, en, es, fr, he, it, nl, no, pt, ru, sv, ud, zh
        let newsApiLang = lang;
        // Handle specific language mappings or fallbacks
        if (lang === 'zh-CN' || lang === 'zh-TW') {
            newsApiLang = 'zh';
        }
        else if (lang.includes('-')) {
            // Extract the primary language code if it's a locale with region (e.g., 'en-US' -> 'en')
            newsApiLang = lang.split('-')[0];
        }
        // Validate that the language is supported by NewsAPI
        const supportedLangs = ['ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh'];
        if (!supportedLangs.includes(newsApiLang)) {
            newsApiLang = 'en'; // Default to English if not supported
        }
        if (!apiKey) {
            console.error('NEWS_API_KEY not found in environment variables');
            res.status(500).json({
                error: 'Server configuration error',
                details: 'API key not configured'
            });
            return;
        }
        console.log(`Using language: ${newsApiLang} (requested: ${lang})`);
        const url = `https://newsapi.org/v2/everything?q=golf&language=${newsApiLang}&sortBy=publishedAt&apiKey=${apiKey}`;
        console.log('Fetching news from:', url);
        const response = await axios_1.default.get(url);
        console.log('News API Response:', response.data);
        if (!response.data.articles || response.data.articles.length === 0) {
            console.log('No articles found in response');
            res.status(404).json({
                error: 'No articles found',
                details: 'The news API returned no articles'
            });
            return;
        }
        res.json(response.data.articles);
    }
    catch (error) {
        console.error('Detailed error:', error);
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error;
            res.status(500).json({
                error: 'Failed to fetch news.',
                details: typeof axiosError.response?.data === 'string' ? axiosError.response.data : axiosError.message
            });
            return;
        }
        res.status(500).json({
            error: 'Failed to fetch news.',
            details: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
});
exports.default = router;
//# sourceMappingURL=news.js.map