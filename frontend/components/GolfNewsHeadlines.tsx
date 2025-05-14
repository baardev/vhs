import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * @interface Article
 * @description Defines the structure for a single news article object.
 * @property {string} title - The title of the news article.
 * @property {string} url - The URL to the full news article.
 * @property {string} publishedAt - The publication date of the article.
 * @property {{ name: string }} source - An object containing the name of the news source.
 */
interface Article {
    title: string;
    url: string;
    publishedAt: string;
    source: { name: string };
}

/**
 * @component GolfNewsHeadlines
 * @description Fetches and displays a list of the latest golf news headlines.
 * It retrieves news articles from the `/api/golf-news` endpoint, respecting the current locale for language.
 *
 * @remarks
 * - Manages internal state for `headlines` (array of articles), `loading`, `error`, and `debug` messages.
 * - Uses `next/router` to get the current `locale` and fetches news accordingly.
 * - On mount and when `locale` changes, it calls `fetchHeadlines`.
 * - `fetchHeadlines`: 
 *   - Makes an asynchronous GET request to `/api/golf-news?lang=[locale]` with `Cache-Control: no-cache` header.
 *   - Limits the displayed headlines to the first 8 articles received.
 *   - Handles API response errors and sets an error message if fetching fails.
 *   - Sets a `debug` string with information about the fetch process (URL, status, number of articles).
 * - Displays a loading message while data is being fetched.
 * - Displays an error message if the fetch fails.
 * - Displays "No headlines available" if the fetch is successful but returns no articles.
 * - Renders a list of article titles, each linking to the full article in a new tab.
 * - Optionally displays debug information if the `debug` state is set.
 *
 * Called by:
 * - `frontend/pages/index.tsx` (on the home page)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/router`: `useRouter` hook (to get current locale)
 * - Browser API: `fetch` (to get data from `/api/golf-news`)
 * - Browser API: `window.location.origin` (to construct the full API URL for debugging)
 *
 * @returns {JSX.Element} The rendered list of golf news headlines, or loading/error/no data states.
 */
export default function GolfNewsHeadlines() {
    const [headlines, setHeadlines] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string | null>(null);
    const router = useRouter();
    const { locale } = router;

    useEffect(() => {
        async function fetchHeadlines() {
            try {
                setLoading(true);
                const apiUrl = `/api/golf-news?lang=${locale || 'en'}`;
                setDebug(`Fetching from ${window.location.origin}${apiUrl}...`);

                const response = await fetch(apiUrl, {
                    headers: { 'Cache-Control': 'no-cache' }
                });

                setDebug(prev => `${prev || ''} Status: ${response.status}`);

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    // Store only the first 8 articles
                    setHeadlines(data.slice(0, 8));
                    setDebug(prev => `${prev || ''} Success! Articles: ${data.length}`);
                } else {
                    throw new Error('Invalid data format');
                }

                setError(null);
            } catch (err) {
                setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        }

        fetchHeadlines();
    }, [locale]);

    // Show loading state
    if (loading) {
        return <div className="p-4 text-center">Loading headlines...</div>;
    }

    // Show error state
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    // No headlines found
    if (headlines.length === 0) {
        return <div className="p-4">No headlines available</div>;
    }

    // Show headlines as a simple list
    return (
        <div className="bg-gray-900 border border-gray-700 rounded p-4">
            {headlines.map((article, i) => (
                <div key={i} className="py-2 border-b border-gray-800 last:border-0">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-400 block"
                    >
                        {article.title}
                    </a>
                </div>
            ))}

            {debug && (
                <div className="mt-4 pt-2 text-xs text-gray-500 border-t border-gray-800">
                    {debug}
                </div>
            )}
        </div>
    );
}