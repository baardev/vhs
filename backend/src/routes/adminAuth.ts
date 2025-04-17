import { Response, NextFunction } from 'express';
import { pool } from '../db';
import { AuthRequest } from './authenticateToken';

/**
 * Middleware to verify if a user has admin privileges
 * This middleware should be used after authenticateToken middleware
 */
const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // User ID should be available from authenticateToken middleware
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user has admin privileges
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!result.rows[0].is_admin) {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    // User is admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in admin authentication:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default isAdmin;