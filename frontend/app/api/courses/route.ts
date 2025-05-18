import { NextResponse } from 'next/server';
import axios from 'axios';

// Sample data to use if the backend request fails
const fallbackCourses = [
  {
    course_id: 1,
    name: "GOLF SAN SEBASTIAN",
    city: "BENAVIDEZ",
    country: "AR",
    province_state: "AR-B"
  },
  {
    course_id: 2,
    name: "GOLF CLUB ARGENTINO",
    city: "JOSE C. PAZ",
    country: "AR",
    province_state: "AR-B"
  },
  {
    course_id: 3,
    name: "HIGHLAND PARK COUNTRY CLUB",
    city: "DEL VISO",
    country: "AR",
    province_state: "AR-B"
  }
];

export async function GET(request: Request) {
  console.log('Next.js API route /api/courses called');
  
  try {
    // Attempt to fetch from the backend
    const backendUrl = process.env.BACKEND_URL || 'http://backend:4000';
    console.log(`Attempting to fetch from backend: ${backendUrl}/api/courses`);
    
    // Add a 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await axios.get(`${backendUrl}/api/courses`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(timeoutId);
      console.log(`Backend returned ${response.data.length} courses`);
      
      // Return the data from the backend
      return NextResponse.json(response.data, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error fetching from backend:', error);
      throw error; // Pass to fallback
    }
  } catch (error) {
    console.log('Using fallback data due to error:', error.message);
    
    // Return the fallback data if backend request fails
    return NextResponse.json(fallbackCourses, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache', 
        'Expires': '0'
      }
    });
  }
} 