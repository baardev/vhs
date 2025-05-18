'use client';

import { useEffect, useState } from 'react';
import { getCommonDictionary } from './dictionaries';
import RandomQuote from '../components/RandomQuote';

/**
 * @page HomePage 
 * @description Main landing page for the Open Handicap System application.
 * 
 * This page serves as the entry point for the application, providing:
 * - A visually appealing introduction to the handicap system
 * - A brief overview of the purpose (alternative to expensive handicapping services)
 * - A featured golf quote that changes randomly for engagement
 * - Key features of the system presented in a grid layout
 * 
 * The component handles internationalization through the dictionary system,
 * displaying content in the user's selected language.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to the root / or /{lang})
 * - Navigation links throughout the application (Navbar, Footer, etc.)
 * - Redirect actions from login/registration flows
 * 
 * @calls
 * - Function: getCommonDictionary (for language-specific content)
 * - Component: RandomQuote (to display changing golf quotes)
 * 
 * @requires
 * - Language parameter from the URL (provided by Next.js App Router)
 * - Dictionary translations for homepage content
 * - Background image of a golf course
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
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
      setTimestamp(new Date().toISOString());
    }
    loadDictionary();
  }, [lang]);

  if (!dict) {
    return <div className="container mx-auto px-4 py-8 text-center">{dict?.loading || 'Loading...'}</div>;
  }

  const title = dict.homePage?.mainTitle || dict.welcome || "Open Handicap System";
  const subtitle = dict.homePage?.subtitle || "An alternative to expensive handicapping services in South America";

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-100">
      {/* Hero Section with handicapping system theme */}
      <div className="relative h-[300px] w-full mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-teal-700/50 to-emerald-900/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595783148027-e81f60ab7e69?ixlib=rb-4.0.3')] bg-cover bg-center opacity-65">
          {/* Golf course background */}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 z-20">
          <div className="w-[80%] max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 drop-shadow-md">
              {subtitle}
            </p>
            <div className="max-w-3xl mx-auto">
              <RandomQuote />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-white to-blue-50 py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold mb-10 text-center text-teal-800">
            {dict.homePage?.keyFeatures || 'Key Features'} (Client Updated: {timestamp})
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-teal-200 rounded-lg p-8 hover:shadow-xl transition-all bg-gradient-to-br from-white to-teal-50 hover:-translate-y-1 duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-800 text-center">
                {dict.homePage?.easyHandicapTrackingTitle || 'Easy Handicap Tracking'}
              </h3>
              <p className="text-gray-700">
                {dict.homePage?.easyHandicapTrackingDescription || 'Record your golf scores and automatically calculate your handicap index based on the World Handicap System (WHS) rules.'}
              </p>
            </div>
            <div className="border-2 border-teal-200 rounded-lg p-8 hover:shadow-xl transition-all bg-gradient-to-br from-white to-teal-50 hover:-translate-y-1 duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-800 text-center">
                {dict.homePage?.courseDatabaseTitle || 'Course Database'}
              </h3>
              <p className="text-gray-700">
                {dict.homePage?.courseDatabaseDescription || 'Access our comprehensive database of South American golf courses, complete with slope ratings, course ratings, and par information.'}
              </p>
            </div>
            <div className="border-2 border-teal-200 rounded-lg p-8 hover:shadow-xl transition-all bg-gradient-to-br from-white to-teal-50 hover:-translate-y-1 duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-800 text-center">
                {dict.homePage?.scoreHistoryTitle || 'Score History'}
              </h3>
              <p className="text-gray-700">
                {dict.homePage?.scoreHistoryDescription || 'View your progress over time with detailed statistics and historical trends of your golf game across South American courses.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 