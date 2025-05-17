import { NextResponse } from 'next/server';

/**
 * GET handler for /api/random-quote
 * Proxies the request to the backend API
 */
export async function GET() {
  try {
    // Proxy the request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://vhs-backend:4000';
    const response = await fetch(`${backendUrl}/api/random-quote`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in random-quote API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch random quote',
        quote: 'Golf is a good walk spoiled.',
        author: 'Mark Twain (Fallback)' 
      },
      { status: 500 }
    );
  }
} 