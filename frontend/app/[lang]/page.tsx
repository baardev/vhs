'use client';

import { useEffect, useState } from 'react';
import GolfNewsHeadlines from '../../components/GolfNewsHeadlines';
import RandomQuote from '../../components/RandomQuote';
import { getHomeDictionary } from './dictionaries';

/**
 * @page HomePage
 * @description The main landing page (homepage) for the application.
 * It displays a welcome message, a random quote, a list of key features,
 * and a section for golf news headlines.
 * 
 * Now implemented as a Client Component in the App Router.
 */
export default function Home({ params }: { params: { lang: string } | Promise<{ lang: string }> }) {
  const [dict, setDict] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const [lang, setLang] = useState<string>('');

  // Handle params properly regardless of whether it's a Promise or direct object
  useEffect(() => {
    async function extractLang() {
      try {
        // Handle both Promise and direct object cases
        const resolvedParams = params instanceof Promise ? await params : params;
        if (resolvedParams && 'lang' in resolvedParams) {
          setLang(resolvedParams.lang);
        }
      } catch (error) {
        console.error('Error resolving params:', error);
      }
    }
    
    extractLang();
  }, [params]);

  useEffect(() => {
    // Load dictionary using the local state variable
    async function loadDictionary() {
      if (!lang) return; // Skip if lang is not set yet
      const dictionary = await getHomeDictionary(lang);
      setDict(dictionary);
      setTimestamp(new Date().toISOString());
    }
    loadDictionary();
  }, [lang]);

  if (!dict) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{dict.title} (UPDATED VERSION)</h1>
        <p className="text-xl mb-6">{dict.subtitle}</p>
        <div className="max-w-lg mx-auto">
          <RandomQuote />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Key Features (Client Updated: {timestamp})</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Easy Handicap Tracking</h3>
            <p>Record your golf scores and automatically calculate your handicap index based on the World Handicap System (WHS) rules.</p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Course Database</h3>
            <p>Access our comprehensive database of golf courses, complete with slope ratings, course ratings, and par information.</p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Score History</h3>
            <p>View your progress over time with detailed statistics and historical trends of your golf game.</p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Latest Golf News</h2>
        {/* <GolfNewsHeadlines /> */}
      </section>
    </div>
  );
} 