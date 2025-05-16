'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { getCommonDictionary, getHomeDictionary } from '../dictionaries';

/**
 * @constant geistSans
 * @description Next.js font optimization for Geist Sans font.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page Dashboard
 * @description This Component renders the dashboard page for authenticated users.
 * It is a server component that uses the App Router, receiving the language
 * parameter dynamically from the URL.
 */
export default async function Dashboard({ params }: { params: { lang: string } }) {
  // For now, just using a dummy/stub response
  // const dict = await getDashboardDictionary(params.lang);
  const dict = await getHomeDictionary(params.lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard (Updated to test deployment)</h1>
      <p className="mb-4">Welcome to your dashboard.</p>
      <p>This page is under construction.</p>
    </div>
  );
} 