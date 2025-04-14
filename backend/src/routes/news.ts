import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Define the expected structure of the response
interface NewsApiResponse {
    articles: Array<{
        source: { name: string };
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

router.get('/golf-news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const url = `https://newsapi.org/v2/everything?q=golf&sortBy=publishedAt&apiKey=${apiKey}`;

        // Explicitly define type
        const response = await axios.get<NewsApiResponse>(url);

        res.json(response.data.articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch news.' });
    }
});

export default router;
