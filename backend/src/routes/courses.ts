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

  // Using data_by_tee view to get unique courses
  const q = `
    SELECT DISTINCT 
      id AS course_id, 
      name, 
      SPLIT_PART(name, ' - ', 1) AS city, 
      'Argentina' AS country, 
      'Buenos Aires Province' AS province_state 
    FROM 
      data_by_tee 
    ORDER BY 
      name ASC
  `;
  
  console.log('Query running with data_by_tee view:', q);

  try {
    const coursesResult = await pool.query(q);    
    res.json(coursesResult.rows);
  } catch (error) {
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
        id AS course_id, 
        name, 
        'Argentina' AS country, 
        SPLIT_PART(name, ' - ', 1) AS city_province, 
        NULL AS website, 
        NOW() AS created_at
      FROM 
        data_by_tee 
      WHERE 
        id = $1
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
        id AS course_id, 
        tee_name AS name, 
        course_rating, 
        slope_rating, 
        yardage
      FROM 
        data_by_tee 
      WHERE 
        id = $1
    `, [id]);

    // Get holes for this course - still need x_course_holes table
    const holesResult = await pool.query(
      'SELECT hole_number, par, men_stroke_index, women_stroke_index FROM x_course_holes WHERE course_id = $1 ORDER BY hole_number',
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