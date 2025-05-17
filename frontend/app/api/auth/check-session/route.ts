import { NextResponse } from 'next/server';

/**
 * API route handler to check session validity
 * This can be called client-side to validate the user's session
 */
export async function GET(request: Request) {
  try {
    // Extract the authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('[API] Session check failed: No Authorization header');
      return NextResponse.json(
        { valid: false, error: 'No authorization header provided' },
        { status: 401 }
      );
    }

    // Forward to backend validate-token endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    console.log(`[API] Checking session by forwarding to: ${backendUrl}/api/auth/validate-token`);
    
    const response = await fetch(`${backendUrl}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`[API] Session check failed: Backend returned ${response.status}`);
      return NextResponse.json(
        { valid: false },
        { status: 401 } // Important: Forward the 401 status
      );
    }

    const data = await response.json();
    console.log('[API] Session check result:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Session check error:', error);
    return NextResponse.json(
      { valid: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
} 