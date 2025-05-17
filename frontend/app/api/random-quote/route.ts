import { NextResponse } from 'next/server';

/** 
 * @apiRoute GET /api/random-quote
 * @description Content delivery API endpoint for retrieving inspirational golf quotes.
 * 
 * This API route proxies requests for random golf quotes between the frontend
 * and backend services. It features:
 * 
 * - Seamless forwarding of requests to the backend quote service
 * - Error handling with graceful fallback to a default quote
 * - Simplified interface for frontend components to consume
 * - No authentication requirements for public quote access
 * 
 * The route implements a fail-safe approach by providing a fallback Mark Twain
 * quote when the backend service is unavailable, ensuring that UI components
 * never encounter empty quote sections.
 * 
 * @calledBy
 * - HomePage component (for featured quotes)
 * - RandomQuote component (frontend/app/components/RandomQuote.tsx)
 * - Dashboard motivational sections
 * - Loading screens or transitional UI
 * 
 * @calls
 * - Backend API: GET /api/random-quote
 * - NextResponse utilities for structured API responses
 * 
 * @requires
 * - Backend URL configuration (BACKEND_URL environment variable)
 * - Functioning backend random quote service
 * 
 * @returns {Promise<NextResponse>} JSON response containing quote and author,
 *          or a fallback quote with error information on failure
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