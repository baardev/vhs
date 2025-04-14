import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

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

        if (!apiKey) {
            console.error('NEWS_API_KEY not found in environment variables');
            res.status(500).json({
                error: 'Server configuration error',
                details: 'API key not configured'
            });
            return;
        }

        const url = `https://newsapi.org/v2/everything?q=golf&sortBy=publishedAt&apiKey=${apiKey}`;

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

        res.json(response.data.articles);
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