import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';

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