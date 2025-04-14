import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// This is a debug endpoint to directly check if the backend API is accessible
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Debug API: Attempting to fetch golf news from backend');

    // Try making a direct request to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://backend:4000';
    console.log(`Debug API: Using backend URL: ${backendUrl}`);

    const response = await axios.get(`${backendUrl}/api/golf-news`, {
      timeout: 5000, // 5 second timeout
    });

    console.log('Debug API: Response received:', {
      status: response.status,
      headers: response.headers,
      dataLength: response.data ? (Array.isArray(response.data) ? response.data.length : 'not an array') : 'no data',
    });

    // Return the response with debug info
    res.status(200).json({
      success: true,
      status: response.status,
      headers: response.headers,
      data: response.data,
      backendUrl: backendUrl,
    });
  } catch (error) {
    console.error('Debug API: Error fetching from backend:', error);

    // Return detailed error information
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorObject: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : String(error),
      backendUrl: process.env.BACKEND_URL || 'http://backend:4000',
    });
  }
}