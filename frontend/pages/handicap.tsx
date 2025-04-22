import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import HandicapCalculator from '../components/handicap/HandicapCalculator';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// In handicap.tsx - remove these components
const HandicapPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Golf Handicap Calculator</title>
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Remove Navbar from here */}
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#2d6a4f] dark:text-white">
              Golf Handicap Calculator
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