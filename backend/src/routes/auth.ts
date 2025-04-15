import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('username')
      .trim()
      .custom((value) => {
        // Special case for 'jw' username
        if (value === 'jw') return true;
        // Otherwise require at least 3 characters
        return value.length >= 3;
      })
      .withMessage('Username must be at least 3 characters (or be "jw"'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Registration attempt received:', req.body.email);
      console.log('Full request body:', JSON.stringify(req.body));

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password } = req.body;

      // Test database connection
      try {
        console.log('Testing database connection...');
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');
      } catch (dbError: any) {
        console.error('Database connection failed:', dbError);
        res.status(500).json({ error: 'Database connection failed', details: dbError.message });
        return;
      }

      // Check if user already exists
      try {
        console.log('Checking if user exists with email:', email);
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
          console.log('User already exists with email:', email);
          res.status(400).json({ error: 'User with this email already exists' });
          return;
        }
        console.log('No existing user found with email:', email);
      } catch (userCheckError: any) {
        console.error('Error checking existing user:', userCheckError);
        res.status(500).json({ error: 'Failed to check existing user', details: userCheckError.message });
        return;
      }

      // Hash password
      let hashedPassword;
      try {
        console.log('Hashing password...');
        hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');
      } catch (hashError: any) {
        console.error('Error hashing password:', hashError);
        res.status(500).json({ error: 'Failed to hash password', details: hashError.message });
        return;
      }

      // Insert user into database
      try {
        console.log('Inserting user into database:', username, email);
        const result = await pool.query(
          'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
          [username, email, hashedPassword]
        );

        console.log('User successfully registered:', result.rows[0]);
        res.status(201).json(result.rows[0]);
      } catch (insertError: any) {
        console.error('Error inserting user into database:', insertError);
        res.status(500).json({ error: 'Failed to create user', details: insertError.message });
        return;
      }
    } catch (error: any) {
      console.error('Unhandled error during registration:', error);
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Find user
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      // Validate credentials
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Use a default secret if environment variable is not set
      const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '2h' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  [
    body('username').trim().optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').optional().isEmail().withMessage('Must provide a valid email')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email } = req.body;

      // Build SET clause for SQL dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (username) {
        updates.push(`username = $${paramCount++}`);
        values.push(username);
      }

      if (email) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
      }

      if (updates.length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Add user ID as the last parameter
      values.push(req.user?.id);

      // Update user
      const updatedUser = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email`,
        values
      );

      if (updatedUser.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(updatedUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

// Delete user account
router.delete('/profile', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.user?.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;