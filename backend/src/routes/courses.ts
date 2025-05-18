/**
 * @fileoverview Routes for managing golf courses, tee boxes, holes, and attachments.
 *
 * @remarks
 * This module defines API endpoints for CRUD operations on golf courses, including their tee boxes and holes.
 * It also handles file uploads for course-related attachments like scorecards and rating certificates.
 * Authentication is required for creating courses and uploading attachments.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `express-validator` (external library - for input validation)
 * - `../db` (likely `backend/src/db.ts` or `backend/src/db/index.ts` - provides database connection pool)
 * - `./authenticateToken` (`backend/src/routes/authenticateToken.ts` - middleware for JWT authentication)
 * - `multer` (external library - for handling file uploads)
 * - `path` (Node.js built-in module - for file path manipulation)
 * - `fs` (Node.js built-in module - for file system operations, e.g., creating directories)
 */
import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Simplified approach - use any for multer callbacks
const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadDir = path.join(__dirname, '../../uploads/courses');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Get all courses
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('=== GET /api/courses received ===');

  // Using x_course_names table to get courses
  const q = `
    SELECT 
      course_id, 
      course_name AS name, 
      city, 
      country_code AS country, 
      province AS province_state 
    FROM 
      x_course_names 
    ORDER BY 
      course_name ASC
  `;
  
  console.log('Query running with x_course_names table:', q);

  try {
    const coursesResult = await pool.query(q);    
    console.log(`Found ${coursesResult.rowCount} courses`);    
    res.json(coursesResult.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    next(error);
  }
});

// Get a simplified list of all course names and IDs
router.get('/list-names', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Assuming your table is x_course_names with course_id and course_name
    const query = 'SELECT course_id, course_name FROM x_course_names ORDER BY course_name ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching course names list:', error);
    next(error);
  }
});

// Get a specific course with its tee boxes and holes
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Get course details from the view
    const q = `
      SELECT 
        course_id, 
        course_name AS name, 
        'Argentina' AS country, 
        SPLIT_PART(course_name, ' - ', 1) AS city_province, 
        NULL AS website, 
        NOW() AS created_at
      FROM 
        data_by_tee 
      WHERE 
        course_id = $1
      LIMIT 1
    `;
    
    console.log('Query running with data_by_tee view:', q);

    const courseResult = await pool.query(q, [id]);

    if (courseResult.rows.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const course = courseResult.rows[0];

    // Get tee boxes for this course from the view
    const teeBoxesResult = await pool.query(`
      SELECT 
        course_id, 
        tee_name AS name, 
        course_rating, 
        slope_rating, 
        yardage
      FROM 
        data_by_tee 
      WHERE 
        course_id = $1
    `, [id]);

    // Get holes for this course - use course_holes view now instead of direct x_course_holes table
    const holesResult = await pool.query(
      'SELECT hole_number, par, men_stroke_index, women_stroke_index FROM course_holes WHERE course_id = $1 ORDER BY hole_number',
      [id]
    );

    // Return complete course data
    res.json({
      ...course,
      tee_boxes: teeBoxesResult.rows,
      holes: holesResult.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get all tee types for a specific course
router.get('/:courseId/tees', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const query = `
      SELECT
        tt.tee_id, 
        tt.tee_name
      FROM
        x_course_tee_types tt
      WHERE
        tt.course_id = $1
      ORDER BY
        tt.tee_name ASC;
    `;
    // The original query joined with x_course_names, but if x_course_tee_types.course_id is reliable,
    // a direct query on x_course_tee_types might be simpler if x_course_names.course_id isn't needed for filtering beyond tt.course_id.
    // If the join is important (e.g. to ensure the course_id exists in x_course_names), then revert to the more complex join.
    // For this implementation, using the direct tt.course_id assuming it's the foreign key to x_course_names.course_id.
    
    const result = await pool.query(query, [courseId]);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error fetching tee types for course ${req.params.courseId}:`, error);
    next(error);
  }
});

// Create a new course - requires authentication
router.post(
  '/',
  authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('country').trim().isLength({ min: 2, max: 2 }).withMessage('Country code should be 2 characters'),
    body('cityProvince').trim().notEmpty().withMessage('City/Province is required'),
    body('website').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Website must be a valid URL'),
    body('teeBoxes').isArray({ min: 1 }).withMessage('At least one tee box is required'),
    body('teeBoxes.*.name').trim().notEmpty().withMessage('Tee box name is required'),
    body('teeBoxes.*.gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('teeBoxes.*.courseRating').isFloat({ min: 50, max: 90 }).withMessage('Course rating must be a valid number'),
    body('teeBoxes.*.slopeRating').isInt({ min: 55, max: 155 }).withMessage('Slope rating must be a valid number'),
    body('teeBoxes.*.yardage').optional({ nullable: true }).isInt({ min: 1000, max: 9000 }).withMessage('Yardage must be a valid number'),
    body('holes').isArray({ min: 18, max: 18 }).withMessage('Course must have exactly 18 holes'),
    body('holes.*.holeNumber').isInt({ min: 1, max: 18 }).withMessage('Hole number must be between 1 and 18'),
    body('holes.*.par').isInt({ min: 3, max: 6 }).withMessage('Par must be between 3 and 6'),
    body('holes.*.strokeIndex').isInt({ min: 1, max: 18 }).withMessage('Stroke index must be between 1 and 18')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, country, cityProvince, website, teeBoxes, holes } = req.body;

      // Start transaction
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Create the course
        const courseResult = await client.query(
          'INSERT INTO courses (name, country, province_state, website, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, country, cityProvince, website || null, req.user?.id]
        );

        const courseId = courseResult.rows[0].id;

        // Create tee boxes for this course
        for (const teeBox of teeBoxes) {
          await client.query(
            `INSERT INTO tee_boxes
             (course_id, name, gender, course_rating, slope_rating, yardage)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              courseId,
              teeBox.name,
              teeBox.gender,
              teeBox.courseRating,
              teeBox.slopeRating,
              teeBox.yardage || null
            ]
          );
        }

        // Create holes for this course
        for (const hole of holes) {
          await client.query(
            `INSERT INTO course_holes
             (course_id, hole_number, par, stroke_index)
             VALUES ($1, $2, $3, $4)`,
            [courseId, hole.holeNumber, hole.par, hole.strokeIndex]
          );
        }

        await client.query('COMMIT');

        res.status(201).json({
          id: courseId,
          message: 'Course created successfully'
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      next(error);
    }
  }
);

// Upload attachments for a course
router.post(
  '/:id/attachments',
  authenticateToken,
  upload.fields([
    { name: 'scorecardUpload', maxCount: 1 },
    { name: 'ratingCertificateUpload', maxCount: 1 },
    { name: 'courseInfoUpload', maxCount: 1 }
  ]),
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const files = req.files;

      // Check if course exists
      const courseResult = await pool.query('SELECT id FROM courses WHERE id = $1', [id]);

      if (courseResult.rows.length === 0) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Process each file type
        const fileTypes = {
          scorecardUpload: 'scorecard',
          ratingCertificateUpload: 'rating_certificate',
          courseInfoUpload: 'course_info'
        };

        for (const [fieldName, fileType] of Object.entries(fileTypes)) {
          if (files[fieldName] && files[fieldName].length > 0) {
            const file = files[fieldName][0];

            await client.query(
              `INSERT INTO course_attachments
               (course_id, attachment_type, file_path, original_filename, mime_type, file_size, uploaded_by)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                id,
                fileType,
                file.path,
                file.originalname,
                file.mimetype,
                file.size,
                req.user?.id
              ]
            );
          }
        }

        await client.query('COMMIT');

        res.status(201).json({ message: 'Attachments uploaded successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;