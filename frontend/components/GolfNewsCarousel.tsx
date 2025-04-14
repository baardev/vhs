import { useEffect, useState } from 'react';

interface Article {
    title: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: { name: string };
}

export default function GolfNewsCarousel() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/golf-news`)
            .then((res) => res.json())
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % articles.length);
        }, 5000); // Change news every 5 seconds

        return () => clearInterval(timer);
    }, [articles]);

    if (loading) return <p>Loading golf news...</p>;
    if (articles.length === 0) return <p>No articles available.</p>;

    const article = articles[current];

    return (
        <div className="w-full mx-auto max-w-xl border rounded-lg shadow-lg overflow-hidden">
            <img
                src={article.urlToImage || '/placeholder.jpg'}
                alt={article.title}
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {article.title}
                    </a>
                </h3>
                <p className="text-sm text-gray-500">
                    {article.source.name} - {new Date(article.publishedAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
