/**
 * @fileoverview Admin routes for managing users.
 *
 * @remarks
 * This module defines API endpoints for administrative actions such as listing, creating, updating, and deleting users,
 * as well as managing admin privileges. All routes in this module require authentication and admin privileges.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `bcrypt` (external library)
 * - `express-validator` (external library)
 * - `../db` (likely `backend/src/db.ts` or `backend/src/db/index.ts` - provides database connection pool)
 * - `./authenticateToken` (`backend/src/routes/authenticateToken.ts` - middleware for JWT authentication)
 * - `./adminAuth` (`backend/src/routes/adminAuth.ts` - middleware for admin authorization)
 */
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';
import isAdmin from './adminAuth';

const router = express.Router();

// Middleware: All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(isAdmin);

// Get all users
router.get('/users', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'id';
    const sortOrder = (req.query.sortOrder as string) || 'ASC';

    // Valid column names to prevent SQL injection
    const validColumns = ['id', 'username', 'email', 'created_at', 'is_admin', 'is_editor'];
    const validSortOrders = ['ASC', 'DESC'];

    const column = validColumns.includes(sortBy) ? sortBy : 'id';
    const order = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

    const usersResult = await pool.query(
      `SELECT id, username, email, created_at, is_admin, is_editor
       FROM users
       ORDER BY ${column} ${order}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');

    res.json({
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (error) {
    console.error('Error getting users:', error);
    next(error);
  }
});

// Get user details
router.get('/users/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const userResult = await pool.query(
      `SELECT id, username, email, created_at, first_name, family_name, matricula, handicap, is_admin, is_editor
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Error getting user details:', error);
    next(error);
  }
});

// Create new user
router.post(
  '/users',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('email')
      .isEmail()
      .withMessage('Must provide a valid email'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters'),
    body('is_admin')
      .optional()
      .isBoolean()
      .withMessage('is_admin must be a boolean value')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password, is_admin = false } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        res.status(400).json({ error: 'User with this username or email already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const newUser = await pool.query(
        `INSERT INTO users (username, email, password, is_admin)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, created_at, is_admin`,
        [username, email, hashedPassword, is_admin]
      );

      res.status(201).json(newUser.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      next(error);
    }
  }
);

// Update user
router.put(
  '/users/:id',
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Must provide a valid email'),
    body('password')
      .optional()
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters'),
    body('is_admin')
      .optional()
      .isBoolean()
      .withMessage('is_admin must be a boolean value')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Check if user exists
      const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      if (existingUser.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const { username, email, password, is_admin, name, family_name, matricula, handicap } = req.body;

      // Build SET clause for SQL dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (username !== undefined) {
        updates.push(`username = $${paramCount++}`);
        values.push(username);
      }

      if (email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
      }

      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push(`password = $${paramCount++}`);
        values.push(hashedPassword);
      }

      if (is_admin !== undefined) {
        updates.push(`is_admin = $${paramCount++}`);
        values.push(is_admin);
      }

      if (name !== undefined) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(name);
      }

      if (family_name !== undefined) {
        updates.push(`family_name = $${paramCount++}`);
        values.push(family_name);
      }

      if (matricula !== undefined) {
        updates.push(`matricula = $${paramCount++}`);
        values.push(matricula);
      }

      if (handicap !== undefined) {
        updates.push(`handicap = $${paramCount++}`);
        values.push(handicap);
      }

      if (updates.length === 0) {
        res.status(400).json({ error: 'No update data provided' });
        return;
      }

      // Add user ID as the last parameter
      values.push(userId);

      // Update user
      const updatedUser = await pool.query(
        `UPDATE users
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, username, email, created_at, first_name AS name, family_name, matricula, handicap, is_admin`,
        values
      );

      res.json(updatedUser.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      next(error);
    }
  }
);

// Delete user
router.delete('/users/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    // Prevent admin from deleting themselves
    if (userId === req.user?.id) {
      res.status(400).json({ error: 'Cannot delete your own account through the admin interface' });
      return;
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
});

// Set admin status
router.patch('/users/:id/admin',
  [
    body('is_admin')
      .isBoolean()
      .withMessage('is_admin must be a boolean value')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { is_admin } = req.body;

      const result = await pool.query(
        'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, username, is_admin',
        [is_admin, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating admin status:', error);
      next(error);
    }
  }
);

export default router;