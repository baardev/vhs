import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../db';

const router = express.Router();

// Define a custom interface for the request with user property
interface AuthRequest extends Request {
  user?: { id: number };
}

// Middleware to verify JWT token
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register a new user
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
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

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '2h' });

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