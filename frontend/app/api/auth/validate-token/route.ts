import { NextResponse } from 'next/server';

/**
 * @apiRoute POST /api/auth/validate-token
 * @description Token validation API endpoint for the Open Handicap System authentication flow.
 * 
 * This API route acts as a secure proxy between frontend authentication requests 
 * and the backend validation service. It performs the following functions:
 * 
 * - Receives and validates the presence of an Authorization header
 * - Forwards the token to the backend validation service
 * - Passes backend validation results back to the client
 * - Maintains consistent error handling and status code propagation
 * - Provides detailed logging for debugging authentication issues
 * 
 * The route is designed following the proxy pattern, adding minimal processing
 * while ensuring proper error handling and security boundaries between
 * the frontend client and backend authentication system.
 * 
 * @calledBy
 * - Client-side authentication services
 * - Other API routes that need token validation (like check-session)
 * - Server-side authentication middleware
 * - Protected API operations requiring validation
 * 
 * @calls
 * - Backend API: POST /api/auth/validate-token (on the backend service)
 * - NextResponse utilities for structured API responses
 * 
 * @requires
 * - Valid NEXT_PUBLIC_API_URL environment variable
 * - Authorization header with bearer token
 * - Functioning backend validation service
 * 
 * @returns {Promise<NextResponse>} JSON response with token validation result
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