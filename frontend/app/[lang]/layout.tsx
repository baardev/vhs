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