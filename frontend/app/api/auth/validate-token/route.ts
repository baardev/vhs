import { NextResponse } from 'next/server';

/**
 * API route handler for token validation
 * Proxies the request to the backend service to validate the token
 */
export async function POST(request: Request) {
  try {
    console.log('[API Route] Token validation request received');
    // Forward the authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('[API Route] No Authorization header found');
      return NextResponse.json(
        { valid: false, error: 'No authorization header provided' },
        { status: 401 }
      );
    }

    // Make request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    console.log(`[API Route] Forwarding token validation to backend: ${backendUrl}/api/auth/validate-token`);
    
    const response = await fetch(`${backendUrl}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    // Forward the response from the backend
    if (!response.ok) {
      console.error(`[API Route] Backend returned error status: ${response.status}`);
      return NextResponse.json(
        { valid: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API Route] Backend validated token: ${JSON.stringify(data)}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Error validating token:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 