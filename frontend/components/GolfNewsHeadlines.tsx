import { useEffect, useState } from 'react';

interface Article {
    title: string;
    url: string;
    publishedAt: string;
    source: { name: string };
}

export default function GolfNewsHeadlines() {
    const [headlines, setHeadlines] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHeadlines() {
            try {
                setLoading(true);
                const apiUrl = '/api/golf-news';
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
    }, []);

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