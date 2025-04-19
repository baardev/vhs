import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from 'next-i18next';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
// Import i18n configuration
import '../i18n';
import nextI18NextConfig from '../next-i18next.config.js';
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

function MyApp({ Component, pageProps }: AppProps) {
  // console.log('MyApp pageProps:', pageProps); // Log pageProps - Removed

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
