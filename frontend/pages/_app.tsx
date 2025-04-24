declare global {
  interface Window {
    logMessage: (msg: string) => void;
  }
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import LogViewer from '../components/LogViewer';
// Import i18n configuration
import '../i18n';
import nextI18NextConfig from '../next-i18next.config.js';
import { Geist, Geist_Mono } from "next/font/google"
import Head from 'next/head';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// In _app.tsx
function MyApp({ Component, pageProps }) {
  const [logViewerVisible, setLogViewerVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    setIsDev(process.env.NODE_ENV === 'development');
    
    // Check if user is admin
    const checkAdminStatus = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setIsAdmin(user.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
    
    // Listen for auth changes
    window.addEventListener('authChange', checkAdminStatus);
    return () => {
      window.removeEventListener('authChange', checkAdminStatus);
    };
  }, []);

  // Attach global logMessage function
  useEffect(() => {
    window.logMessage = (msg) => {
      console.log(`[LOG]: ${msg}`);
    };
  }, []);

  // Always show logs button for testing (remove this line in production)
  // const showLogsButton = isAdmin || isDev;
  const displayLogButton = false;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {/* Log Viewer Toggle Button - always visible for testing */}
      {displayLogButton && (
        <button
          onClick={() => setLogViewerVisible(!logViewerVisible)}
          className="fixed top-4 right-4 z-50 bg-red-600 text-white px-3 py-2 rounded shadow-lg hover:bg-red-700 flex items-center"
          title="Toggle Log Viewer"
        >
          {/* Terminal/Console icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          LOGS
        </button>
      )}
      
      {/* Log Viewer Component */}
      {/* <LogViewer visible={logViewerVisible} onClose={() => setLogViewerVisible(false)} /> */}
      
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
