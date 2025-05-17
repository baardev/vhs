import { NextResponse } from 'next/server';

/**
 * @apiRoute GET /api/handicap-calc
 * @description API endpoint for retrieving a user's handicap calculation data.
 * 
 * This route forwards user requests to the backend handicap calculation service.
 * It requires authentication - checking for a valid JWT token in the request.
 * The route proxies the request to the backend's handicapCalc API endpoint and returns
 * the result to the frontend for display in the HandicapCalculator component.
 * 
 * @calledBy
 * - HandicapCalculator component (to fetch user's handicap data)
 * 
 * @calls
 * - Backend API: /handicapCalc endpoint
 * 
 * @requires
 * - Valid JWT token for authenticated access
 * - Connection to backend service
 */
export async function GET(request: Request) {
  try {
    // Check for token in request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // If we're in the browser, get the token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // If the request has Authorization header, use it
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Add cache-busting to prevent stale data
    const url = new URL(request.url);
    const timestamp = url.searchParams.get('t') || Date.now().toString();
    
    // Forward the request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/handicapCalc?t=${timestamp}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the handicap data with cache control headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error in handicap-calc API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch handicap data',
        avg_differential: 100.000,
        handicap_index: 100.000,
        rounds_used: 8,
        is_mock: true,
        error_occurred: true
      },
      { status: 500 }
    );
  }
} 