import { NextResponse } from 'next/server';
import axios from 'axios';

// Sample fallback response for when the backend is unavailable
const sampleCourseData = {
  id: 11,
  name: "CAMPO DE GOLF LA ORQUIDEA",
  country: "AR",
  city_province: "LOS CARDALES, Buenos Aires Province",
  website: null,
  created_at: "2023-08-15T12:00:00Z",
  tee_boxes: [
    {
      id: 1,
      name: "Blue",
      gender: "male",
      course_rating: 72.3,
      slope_rating: 125,
      yardage: 6800
    },
    {
      id: 2,
      name: "White",
      gender: "male",
      course_rating: 70.5,
      slope_rating: 118,
      yardage: 6400
    }
  ],
  holes: [
    { hole_number: 1, par: 4, stroke_index: 11 },
    { hole_number: 2, par: 5, stroke_index: 5 },
    { hole_number: 3, par: 3, stroke_index: 17 },
    { hole_number: 4, par: 4, stroke_index: 3 },
    { hole_number: 5, par: 4, stroke_index: 13 },
    { hole_number: 6, par: 5, stroke_index: 7 },
    { hole_number: 7, par: 3, stroke_index: 15 },
    { hole_number: 8, par: 4, stroke_index: 1 },
    { hole_number: 9, par: 4, stroke_index: 9 },
    { hole_number: 10, par: 4, stroke_index: 10 },
    { hole_number: 11, par: 3, stroke_index: 18 },
    { hole_number: 12, par: 5, stroke_index: 6 },
    { hole_number: 13, par: 4, stroke_index: 14 },
    { hole_number: 14, par: 4, stroke_index: 2 },
    { hole_number: 15, par: 4, stroke_index: 12 },
    { hole_number: 16, par: 3, stroke_index: 16 },
    { hole_number: 17, par: 5, stroke_index: 8 },
    { hole_number: 18, par: 4, stroke_index: 4 }
  ],
  attachments: []
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Next.js API route /api/courses/[id] called with ID:', params.id);
  
  if (!params.id) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }
  
  try {
    // Attempt to fetch from the backend
    const backendUrl = process.env.BACKEND_URL || 'http://backend:4000';
    console.log(`Attempting to fetch course ${params.id} from backend: ${backendUrl}/api/courses/${params.id}`);
    
    // Add a 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await axios.get(`${backendUrl}/api/courses/${params.id}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(timeoutId);
      console.log(`Backend returned course data for ID ${params.id}`);
      
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
      console.error(`Error fetching course ${params.id} from backend:`, error);
      throw error; // Pass to fallback
    }
  } catch (error) {
    console.log(`Using fallback data for course ${params.id} due to error:`, error.message);
    
    // Return the fallback data 
    const courseData = { ...sampleCourseData, id: parseInt(params.id) };
    
    return NextResponse.json(courseData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache', 
        'Expires': '0'
      }
    });
  }
} 