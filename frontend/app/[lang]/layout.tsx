// import { Metadata } from 'next';
// import { locales } from '../i18n';
// import { notFound } from 'next/navigation';
import '../globals.css';
import { use } from 'react';
// Navbar, Footer, and AuthProvider are provided by the root layout (app/layout.tsx)
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';
// import { AuthProvider } from '../../src/contexts/AuthContext';

// Font imports can remain if this layout applies specific styling, 
// but the main application of these variables should be in the root layout's <body> or <html> tag.
// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export async function generateMetadata(
//   { params: { lang } }: { params: { lang: string } }
// ): Promise<Metadata> {
//   return {
//     title: {
//       default: 'VHS Open Handicap System',
//       template: '%s | VHS Open Handicap System',
//     },
//     description: 'Track your golf handicap easily',
//   };
// }

/**
 * @component LangLayout
 * @description Internationalization layout wrapper for the Open Handicap System.
 * 
 * This layout serves as a critical part of the application's internationalization 
 * architecture, wrapping all pages within language-specific routes. It:
 * 
 * - Captures and processes the language parameter from the URL ([lang])
 * - Handles both synchronous and asynchronous parameter resolution using React.use()
 * - Provides the language context to all child components
 * - Would normally validate language codes against supported locales (currently commented out)
 * 
 * The component is intentionally minimal, focusing solely on language handling
 * while delegating common UI elements (navbar, footer) to the root layout.
 * This separation of concerns allows for clean internationalization without
 * duplicating shared layout elements.
 * 
 * @calledBy
 * - Next.js App Router (automatically for all pages under the [lang] directory)
 * - Parent layout: Root layout (app/layout.tsx)
 * 
 * @calls
 * - React.use() - To unwrap Promise parameters when necessary
 * - (Commented out) notFound() - Would redirect to 404 for invalid language codes
 * 
 * @requires
 * - Next.js App Router with route groups
 * - Dynamic route segment [lang] in the URL
 * - Global CSS styles
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Object|Promise<Object>} props.params - Route parameters, may be a Promise
 * @param {string} props.params.lang - Language code extracted from the URL
 * @returns {JSX.Element} The layout with its children
 */
export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  // Unwrap params Promise with React.use() if it's a Promise
  const resolvedParams = 'then' in params ? use(params as Promise<{ lang: string }>) : params;
  const { lang } = resolvedParams;
  
  console.log('[LangLayout] Received lang parameter:', lang);

  // Temporarily remove locale validation to isolate the params.lang access issue
  // if (!locales.includes(lang)) {
  //   notFound();
  // }
  
  // Simple return
  return (
    <>
      {/* <div style={{ border: '2px dashed blue', padding: '10px' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>LangLayout Start (lang: {lang || "N/A"})</p> */}
        {children}
      {/* <p style={{ margin: 0, fontWeight: 'bold' }}>LangLayout End</p>
      </div> */}
    </>
  );
} 