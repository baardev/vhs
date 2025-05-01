import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';

const router = Router();

// Get all course names
router.get('/course-names', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Use data_by_tee view to get unique course information
  const q = `
    SELECT DISTINCT 
      id AS course_id, 
      name AS course_name, 
      SPLIT_PART(name, ' - ', 1) AS city,
      'Argentina' AS country,
      'Buenos Aires Province' AS state  
    FROM 
      data_by_tee 
    ORDER BY 
      name ASC
  `;
  
  console.log('Query running with data_by_tee view:', q);
  
  try {
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get a specific course name by course_id
router.get('/course-names/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id, 
        id AS course_id, 
        name AS course_name, 
        SPLIT_PART(name, ' - ', 1) AS city,
        'Buenos Aires Province' AS state,
        'Argentina' AS country,
        NULL AS address1,
        NULL AS facility_name
      FROM 
        data_by_tee
      WHERE 
        id = $1
      LIMIT 1
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get course data by course_id
router.get('/course-data/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Use data_by_tee view that already joins all required tables
    const result = await pool.query(`
      SELECT 
        id, 
        id AS course_id, 
        tee_name,
        'M' AS gender, -- Assuming default, modify if gender info is available
        par,
        course_rating,
        slope_rating,
        yardage AS length
        -- Hole par information is not directly available in the view
      FROM 
        data_by_tee
      WHERE 
        id = $1
      ORDER BY
        tee_name ASC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get course hole data by course_id
router.get('/course-hole-data/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // We need to keep using x_course_holes for hole-specific data
    const result = await pool.query(`
      SELECT 
        ch.id, 
        ch.course_id, 
        'par' AS category,
        'M' AS gender,
        MIN(CASE WHEN ch.hole_number = 1 THEN ch.par END) AS h01,
        MIN(CASE WHEN ch.hole_number = 2 THEN ch.par END) AS h02,
        MIN(CASE WHEN ch.hole_number = 3 THEN ch.par END) AS h03,
        MIN(CASE WHEN ch.hole_number = 4 THEN ch.par END) AS h04,
        MIN(CASE WHEN ch.hole_number = 5 THEN ch.par END) AS h05,
        MIN(CASE WHEN ch.hole_number = 6 THEN ch.par END) AS h06,
        MIN(CASE WHEN ch.hole_number = 7 THEN ch.par END) AS h07,
        MIN(CASE WHEN ch.hole_number = 8 THEN ch.par END) AS h08,
        MIN(CASE WHEN ch.hole_number = 9 THEN ch.par END) AS h09,
        MIN(CASE WHEN ch.hole_number = 10 THEN ch.par END) AS h10,
        MIN(CASE WHEN ch.hole_number = 11 THEN ch.par END) AS h11,
        MIN(CASE WHEN ch.hole_number = 12 THEN ch.par END) AS h12,
        MIN(CASE WHEN ch.hole_number = 13 THEN ch.par END) AS h13,
        MIN(CASE WHEN ch.hole_number = 14 THEN ch.par END) AS h14,
        MIN(CASE WHEN ch.hole_number = 15 THEN ch.par END) AS h15,
        MIN(CASE WHEN ch.hole_number = 16 THEN ch.par END) AS h16,
        MIN(CASE WHEN ch.hole_number = 17 THEN ch.par END) AS h17,
        MIN(CASE WHEN ch.hole_number = 18 THEN ch.par END) AS h18
      FROM 
        x_course_holes ch
      WHERE 
        ch.course_id = $1
      GROUP BY
        ch.id, ch.course_id
      ORDER BY
        category, gender
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get course hole data by course_id in the format expected by the frontend
router.get('/normalized-holes/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // First get the data from x_course_holes
    const holeResult = await pool.query(`
      SELECT 
        course_id,
        hole_number,
        par,
        men_stroke_index,
        women_stroke_index
      FROM 
        x_course_holes
      WHERE 
        course_id = $1
      ORDER BY
        hole_number
    `, [id]);
    
    // Get tee info to attach hole data to
    const teeResult = await pool.query(`
      SELECT 
        id,
        tee_name,
        par
      FROM 
        data_by_tee
      WHERE 
        id = $1
    `, [id]);
    
    if (teeResult.rows.length === 0) {
      res.status(404).json({ error: 'Course tee data not found' });
      return;
    }
    
    // Define type to fix TypeScript error
    interface TeeWithHoles {
      id: any;
      course_id: number;
      tee_name: string;
      gender: string;
      par: number;
      [key: string]: any; // Index signature for dynamic par_h* properties
    }
    
    // Build response objects that match the expected format for the frontend
    const responseData = teeResult.rows.map(tee => {
      // Create base object
      const teeWithHoles: TeeWithHoles = {
        id: tee.id,
        course_id: parseInt(id, 10),
        tee_name: tee.tee_name,
        gender: 'M', // Default
        par: tee.par,
        par_h01: null, par_h02: null, par_h03: null, par_h04: null, par_h05: null, 
        par_h06: null, par_h07: null, par_h08: null, par_h09: null, par_h10: null, 
        par_h11: null, par_h12: null, par_h13: null, par_h14: null, par_h15: null, 
        par_h16: null, par_h17: null, par_h18: null
      };
      
      // Fill in hole data
      holeResult.rows.forEach(hole => {
        const holeNum = hole.hole_number;
        const holeProp = `par_h${holeNum.toString().padStart(2, '0')}`;
        teeWithHoles[holeProp] = hole.par;
      });
      
      return teeWithHoles;
    });
    
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// Update course name
router.put('/course-names/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { course_name, facility_name, address1, city, state, country } = req.body;

    // Check if editor
    if (!req.user?.is_editor) {
      res.status(403).json({ error: 'Unauthorized - Editor permissions required' });
      return;
    }
    
    // We need to update the x_course_names table directly as that's the source table for the view
    const result = await pool.query(`
      UPDATE x_course_names 
      SET 
        course_name = $1
      WHERE 
        course_id = $7
      RETURNING *
    `, [course_name, id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    
    res.json({ message: 'Course updated successfully', course: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update course data
router.put('/course-data/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      tee_name, gender, par, course_rating, slope_rating, length,
      par_h01, par_h02, par_h03, par_h04, par_h05, par_h06, 
      par_h07, par_h08, par_h09, par_h10, par_h11, par_h12, 
      par_h13, par_h14, par_h15, par_h16, par_h17, par_h18
    } = req.body;

    // Check if editor
    if (!req.user?.is_editor) {
      res.status(403).json({ error: 'Unauthorized - Editor permissions required' });
      return;
    }
    
    const result = await pool.query(`
      UPDATE course_data 
      SET 
        tee_name = $1,
        gender = $2,
        par = $3,
        course_rating = $4,
        slope_rating = $5,
        length = $6,
        par_h01 = $7, par_h02 = $8, par_h03 = $9, par_h04 = $10, par_h05 = $11, 
        par_h06 = $12, par_h07 = $13, par_h08 = $14, par_h09 = $15,
        par_h10 = $16, par_h11 = $17, par_h12 = $18, par_h13 = $19, par_h14 = $20, 
        par_h15 = $21, par_h16 = $22, par_h17 = $23, par_h18 = $24
      WHERE 
        id = $25
      RETURNING *
    `, [
      tee_name, gender, par, course_rating, slope_rating, length,
      par_h01, par_h02, par_h03, par_h04, par_h05, par_h06, 
      par_h07, par_h08, par_h09, par_h10, par_h11, par_h12, 
      par_h13, par_h14, par_h15, par_h16, par_h17, par_h18,
      id
    ]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course data not found' });
      return;
    }
    
    res.json({ message: 'Course data updated successfully', course_data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update course hole data
router.put('/course-hole-data/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      category, gender,
      h01, h02, h03, h04, h05, h06, 
      h07, h08, h09, h10, h11, h12, 
      h13, h14, h15, h16, h17, h18
    } = req.body;

    // Check if editor
    if (!req.user?.is_editor) {
      res.status(403).json({ error: 'Unauthorized - Editor permissions required' });
      return;
    }
    
    const result = await pool.query(`
      UPDATE course_hole_data 
      SET 
        category = $1,
        gender = $2,
        h01 = $3, h02 = $4, h03 = $5, h04 = $6, h05 = $7, 
        h06 = $8, h07 = $9, h08 = $10, h09 = $11,
        h10 = $12, h11 = $13, h12 = $14, h13 = $15, h14 = $16, 
        h15 = $17, h16 = $18, h17 = $19, h18 = $20
      WHERE 
        id = $21
      RETURNING *
    `, [
      category, gender,
      h01, h02, h03, h04, h05, h06, 
      h07, h08, h09, h10, h11, h12, 
      h13, h14, h15, h16, h17, h18,
      id
    ]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Course hole data not found' });
      return;
    }
    
    res.json({ message: 'Course hole data updated successfully', course_hole_data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get tee types for courses
router.get('/tee-types', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        course_id, 
        tee_type,
        color
      FROM 
        tee_types
      ORDER BY 
        tee_type ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router; 