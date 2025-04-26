import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';

const router = Router();

// Get all course names
router.get('/course-names', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        course_id, 
        course_name, 
        city, 
        state, 
        country
      FROM 
        course_names
      ORDER BY 
        course_name ASC
    `);
    
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
        course_id, 
        course_name, 
        city, 
        state, 
        country,
        address1,
        facility_name
      FROM 
        course_names
      WHERE 
        course_id = $1
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
    
    const result = await pool.query(`
      SELECT 
        id, 
        course_id, 
        tee_name,
        gender,
        par,
        course_rating,
        slope_rating,
        length,
        par_h01, par_h02, par_h03, par_h04, par_h05, par_h06, 
        par_h07, par_h08, par_h09, par_h10, par_h11, par_h12, 
        par_h13, par_h14, par_h15, par_h16, par_h17, par_h18
      FROM 
        course_data
      WHERE 
        course_id = $1
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
    
    const result = await pool.query(`
      SELECT 
        id, 
        course_id, 
        category,
        gender,
        h01, h02, h03, h04, h05, h06, 
        h07, h08, h09, h10, h11, h12, 
        h13, h14, h15, h16, h17, h18
      FROM 
        course_hole_data
      WHERE 
        course_id = $1
      ORDER BY
        category, gender
    `, [id]);
    
    res.json(result.rows);
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
    
    const result = await pool.query(`
      UPDATE course_names 
      SET 
        course_name = $1,
        facility_name = $2,
        address1 = $3,
        city = $4,
        state = $5,
        country = $6
      WHERE 
        course_id = $7
      RETURNING *
    `, [course_name, facility_name, address1, city, state, country, id]);
    
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