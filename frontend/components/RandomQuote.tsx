import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Quote {
  quote: string;
  author: string;
}

const RandomQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('/api/random-quote');
        setQuote(response.data);
      } catch (error) {
        console.error('Error fetching random quote:', error);
      }
    };

    fetchQuote();
  }, []);

  if (!quote) {
    return <p>Loading...</p>;
  }
  return (
    <div className="random-quote">
      <blockquote>
        &quot;{quote.quote}&quot;
        <footer>- {quote.author}</footer>
      </blockquote>
    </div>
  );
};

export default RandomQuote;