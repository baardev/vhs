"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const authenticateToken_1 = __importDefault(require("./authenticateToken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Simplified approach - use any for multer callbacks
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/courses');
        // Create directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Unsupported file type'));
        }
    }
});
// Get all courses
router.get('/', async (req, res, next) => {
    try {
        const coursesResult = await db_1.pool.query('SELECT id, name, country, city_province, website, created_at FROM courses ORDER BY name');
        res.json(coursesResult.rows);
    }
    catch (error) {
        next(error);
    }
});
// Get a specific course with its tee boxes and holes
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        // Get course details
        const courseResult = await db_1.pool.query('SELECT id, name, country, city_province, website, created_at FROM courses WHERE id = $1', [id]);
        if (courseResult.rows.length === 0) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        const course = courseResult.rows[0];
        // Get tee boxes for this course
        const teeBoxesResult = await db_1.pool.query('SELECT id, name, gender, course_rating, slope_rating, yardage FROM tee_boxes WHERE course_id = $1 ORDER BY name', [id]);
        // Get holes for this course
        const holesResult = await db_1.pool.query('SELECT hole_number, par, stroke_index FROM course_holes WHERE course_id = $1 ORDER BY hole_number', [id]);
        // Get attachments for this course
        const attachmentsResult = await db_1.pool.query('SELECT id, attachment_type, file_path, original_filename FROM course_attachments WHERE course_id = $1', [id]);
        // Return complete course data
        res.json({
            ...course,
            tee_boxes: teeBoxesResult.rows,
            holes: holesResult.rows,
            attachments: attachmentsResult.rows
        });
    }
    catch (error) {
        next(error);
    }
});
// Create a new course - requires authentication
router.post('/', authenticateToken_1.default, [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Course name is required'),
    (0, express_validator_1.body)('country').trim().isLength({ min: 2, max: 2 }).withMessage('Country code should be 2 characters'),
    (0, express_validator_1.body)('cityProvince').trim().notEmpty().withMessage('City/Province is required'),
    (0, express_validator_1.body)('website').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('teeBoxes').isArray({ min: 1 }).withMessage('At least one tee box is required'),
    (0, express_validator_1.body)('teeBoxes.*.name').trim().notEmpty().withMessage('Tee box name is required'),
    (0, express_validator_1.body)('teeBoxes.*.gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    (0, express_validator_1.body)('teeBoxes.*.courseRating').isFloat({ min: 50, max: 90 }).withMessage('Course rating must be a valid number'),
    (0, express_validator_1.body)('teeBoxes.*.slopeRating').isInt({ min: 55, max: 155 }).withMessage('Slope rating must be a valid number'),
    (0, express_validator_1.body)('teeBoxes.*.yardage').optional({ nullable: true }).isInt({ min: 1000, max: 9000 }).withMessage('Yardage must be a valid number'),
    (0, express_validator_1.body)('holes').isArray({ min: 18, max: 18 }).withMessage('Course must have exactly 18 holes'),
    (0, express_validator_1.body)('holes.*.holeNumber').isInt({ min: 1, max: 18 }).withMessage('Hole number must be between 1 and 18'),
    (0, express_validator_1.body)('holes.*.par').isInt({ min: 3, max: 6 }).withMessage('Par must be between 3 and 6'),
    (0, express_validator_1.body)('holes.*.strokeIndex').isInt({ min: 1, max: 18 }).withMessage('Stroke index must be between 1 and 18')
], async (req, res, next) => {
    try {
        // Validate input
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, country, cityProvince, website, teeBoxes, holes } = req.body;
        // Start transaction
        const client = await db_1.pool.connect();
        try {
            await client.query('BEGIN');
            // Create the course
            const courseResult = await client.query('INSERT INTO courses (name, country, city_province, website, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id', [name, country, cityProvince, website || null, req.user?.id]);
            const courseId = courseResult.rows[0].id;
            // Create tee boxes for this course
            for (const teeBox of teeBoxes) {
                await client.query(`INSERT INTO tee_boxes
             (course_id, name, gender, course_rating, slope_rating, yardage)
             VALUES ($1, $2, $3, $4, $5, $6)`, [
                    courseId,
                    teeBox.name,
                    teeBox.gender,
                    teeBox.courseRating,
                    teeBox.slopeRating,
                    teeBox.yardage || null
                ]);
            }
            // Create holes for this course
            for (const hole of holes) {
                await client.query(`INSERT INTO course_holes
             (course_id, hole_number, par, stroke_index)
             VALUES ($1, $2, $3, $4)`, [courseId, hole.holeNumber, hole.par, hole.strokeIndex]);
            }
            await client.query('COMMIT');
            res.status(201).json({
                id: courseId,
                message: 'Course created successfully'
            });
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        next(error);
    }
});
// Upload attachments for a course
router.post('/:id/attachments', authenticateToken_1.default, upload.fields([
    { name: 'scorecardUpload', maxCount: 1 },
    { name: 'ratingCertificateUpload', maxCount: 1 },
    { name: 'courseInfoUpload', maxCount: 1 }
]), async (req, res, next) => {
    try {
        const { id } = req.params;
        const files = req.files;
        // Check if course exists
        const courseResult = await db_1.pool.query('SELECT id FROM courses WHERE id = $1', [id]);
        if (courseResult.rows.length === 0) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        const client = await db_1.pool.connect();
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
                    await client.query(`INSERT INTO course_attachments
               (course_id, attachment_type, file_path, original_filename, mime_type, file_size, uploaded_by)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                        id,
                        fileType,
                        file.path,
                        file.originalname,
                        file.mimetype,
                        file.size,
                        req.user?.id
                    ]);
                }
            }
            await client.query('COMMIT');
            res.status(201).json({ message: 'Attachments uploaded successfully' });
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=courses.js.map