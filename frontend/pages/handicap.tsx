import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import HandicapCalculator from '../components/handicap/HandicapCalculator';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';
import { Geist, Geist_Mono } from "next/font/google";

/**
 * @constant geistSans
 * @description Next.js font optimization for Geist Sans font, applied via CSS variable.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font, applied via CSS variable.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page HandicapPage
 * @description A Next.js page component that hosts the OHS Golf Handicap Calculator.
 * It primarily serves as a container for the `HandicapCalculator` component and sets the page title.
 *
 * @remarks
 * - **Component Composition**: The main feature of this page is the `HandicapCalculator` component.
 * - **Metadata**: Sets the HTML document title to "OHS Handicap Calculator" using `next/head`.
 * - **Styling**: Applies Geist fonts (`geistSans`, `geistMono`) to the page.
 * - Assumes global layout components like Navbar and Footer are provided by `_app.tsx`.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/handicap`.
 *
 * Calls:
 * - `Head` (from `next/head` for setting document head metadata).
 * - `HandicapCalculator` (the main component for handicap calculation functionality).
 *
 * @returns {JSX.Element} The rendered handicap calculator page.
 */
// In handicap.tsx - remove these components
const HandicapPage: NextPage = () => {
  return (
    <>
      <Head>
      <title>OHS Handicap Calculator</title>
      </Head>
      <div style={{border: "1px solid red"}} className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Remove Navbar from here */}
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#2d6a4f] dark:text-white">
              OHS Golf Handicap Calculator
            </h1>
            <HandicapCalculator />
            {/* Rest of content */}
          </div>
        </main>
        {/* Remove Footer from here */}
      </div>
    </>
  );
};
export default HandicapPage; 