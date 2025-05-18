'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { getCommonDictionary } from '../dictionaries';

/**
 * @interface Quote
 * @description Defines the structure for a quote object.
 * @property {string} quote - The text of the quote.
 * @property {string} author - The author of the quote.
 */
interface Quote {
  quote: string;
  author: string;
}

/** 
 * @component RandomQuote
 * @description A React functional component that fetches and displays a random quote.
 *
 * @remarks
 * - Manages a `quote` state, which holds an object containing the quote text and author, or `null` initially.
 * - `useEffect`: On component mount, it calls `fetchQuote`.
 * - `fetchQuote`: Asynchronously fetches a random quote from the `/api/random-quote` endpoint using `axios.get`.
 *   - Updates the `quote` state with the fetched data.
 *   - Logs an error to the console if the fetch fails.
 * - If `quote` state is `null` (i.e., data is being fetched or fetch failed without setting data), it renders a "Loading..." paragraph.
 * - Once `quote` data is available, it renders the quote within a `<blockquote>` and the author within a `<footer>` element.
 * - The component is styled with the class `random-quote` on its root div.
 *
 * Called by:
 * - `frontend/app/[lang]/page.tsx` (on the homepage in the hero section)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `axios.get` (to fetch data from `/api/random-quote`)
 *
 * @returns {React.FC} The rendered random quote or a loading message.
 */
const RandomQuote: React.FC = () => {
  const params = useParams() || {};
  const lang = (params.lang as string) || 'en';
  const [quote, setQuote] = useState<Quote | null>(null);
  const [dict, setDict] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getCommonDictionary(lang);
        setDict(dictionary);
      } catch (error) {
        console.error('Error loading dictionary in RandomQuote:', error);
      }
    };
    
    loadDictionary();
    
    const fetchQuote = async () => {
      try {
        const response = await axios.get('/api/random-quote');
        setQuote(response.data);
      } catch (error) {
        console.error('Error fetching random quote:', error);
      }
    };

    fetchQuote();
  }, [lang]);

  if (!quote) {
    return <p>{dict.loading || 'Loading...'}</p>;
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