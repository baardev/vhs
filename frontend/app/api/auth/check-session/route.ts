import { NextResponse } from 'next/server';

/**
 * @apiRoute GET /api/auth/check-session
 * @description Authentication middleware route that validates user sessions in the Open Handicap System.
 * 
 * This API route serves as a bridge between the frontend and backend authentication systems,
 * validating the JWT token from the client against the backend auth service. It:
 * 
 * - Extracts the authorization token from the request headers
 * - Forwards the token to the backend validation endpoint
 * - Returns standardized responses for valid/invalid sessions
 * - Provides appropriate HTTP status codes (401 for invalid, 200 for valid)
 * - Logs session validation outcomes for debugging purposes
 * 
 * The route is designed to be lightweight and focused solely on session validation,
 * with minimal processing before forwarding to the backend service.
 * 
 * @calledBy
 * - Client-side authentication hooks (useAuth, AuthContext)
 * - Protected route components for session verification
 * - Auto-refresh token mechanisms
 * - User session status checks in the UI
 * 
 * @calls
 * - Backend API: POST /api/auth/validate-token
 * - NextResponse utilities for structured API responses
 * 
 * @requires
 * - Valid NEXT_PUBLIC_API_URL environment variable
 * - Properly formatted Authorization header with bearer token
 * - Functioning backend authentication service
 * 
 * @returns {Promise<NextResponse>} JSON response with session validity information
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