/**
 * @fileoverview Routes for fetching golf-related news articles from NewsAPI.
 *
 * @remarks
 * This module defines API endpoints to get golf news. It fetches data from the NewsAPI,
 * filters out articles containing blocked words (e.g., political terms), and returns a limited set of articles.
 * It supports language selection via a query parameter and has a debug endpoint to check API key status.
 * Blocked words are loaded from a file or a default list.
 * Environment variables (e.g., `NEWS_API_KEY`, `BLOCKED_WORDS_FILE`) are used for configuration.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `axios` (external library - for making HTTP requests to the NewsAPI)
 * - `dotenv` (external library - for loading environment variables)
 * - `fs` (Node.js built-in module - for reading the blocked words file)
 * - `path` (Node.js built-in module - for constructing file paths)
 */
import express, { Request, Response, Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// -------------------- Blocked words --------------------
const DEFAULT_BLOCKED = [
  'trump', 'obama', 'biden', 'political', 'politics',
  'economy', 'economics', 'republican', 'republicans', 'president', 'wwe'
];

const BLOCKED_WORDS_PATH = process.env.BLOCKED_WORDS_FILE || path.join(__dirname, '../../blocked_news_words.txt');

function getBlockedWords(): string[] {
  try {
    const txt = fs.readFileSync(BLOCKED_WORDS_PATH, 'utf-8');
    return txt.split(/\r?\n/).map((w: string) => w.trim().toLowerCase()).filter(Boolean);
  } catch {
    return DEFAULT_BLOCKED;
  }
}

const router: Router = express.Router();

// Define the expected structure of the response
interface NewsApiResponse {
    articles: Array<{
        source: {
            name: string;
        };
        author?: string;
        title: string;
        description?: string;
        url: string;
        publishedAt: string;
        content?: string;
    }>;
    status: string;
    totalResults: number;
}

// Define error response interface
interface ErrorResponse {
    error: string;
    details?: string;
}

// Add a debug endpoint
router.get('/api/debug-news', (req: Request, res: Response): void => {
    const apiKey = process.env.NEWS_API_KEY;
    res.json({
        apiKeyExists: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        environment: process.env.NODE_ENV || 'development'
    });
});

router.get('/api/golf-news', async (req: Request, res: Response<NewsApiResponse['articles'] | ErrorResponse>): Promise<void> => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        // Get language from query parameter, default to 'en'
        const lang = req.query.lang as string || 'en';

        // Map the locale to NewsAPI supported languages
        // NewsAPI supports: ar, de, en, es, fr, he, it, nl, no, pt, ru, sv, ud, zh
        let newsApiLang = lang;

        // Handle specific language mappings or fallbacks
        if (lang === 'zh-CN' || lang === 'zh-TW') {
            newsApiLang = 'zh';
        } else if (lang.includes('-')) {
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
        const response = await axios.get<NewsApiResponse>(url);

        console.log('News API Response:', response.data);

        if (!response.data.articles || response.data.articles.length === 0) {
            console.log('No articles found in response');
            res.status(404).json({
                error: 'No articles found',
                details: 'The news API returned no articles'
            });
            return;
        }

        // ----------------------------------------------
        // Filter out unwanted political/economic articles
        // ----------------------------------------------
        const blocked = getBlockedWords();

        const filtered = response.data.articles.filter(article => {
          const haystack = `${article.title} ${article.description ?? ''}`.toLowerCase();
          return !blocked.some(word => haystack.includes(word));
        });

        // Limit the results to the first 3 articles after filtering
        const limitedArticles = filtered.slice(0, 3);
        res.json(limitedArticles);
    } catch (error: unknown) {
        console.error('Detailed error:', error);

        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as any;
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

export default router;