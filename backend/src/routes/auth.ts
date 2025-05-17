/**
 * @fileoverview Authentication routes for user registration, login, profile management, and password reset.
 *
 * @remarks
 * This module defines API endpoints related to user authentication and authorization.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `bcrypt` (external library)
 * - `jsonwebtoken` (external library)
 * - `express-validator` (external library)
 * - `../db` (likely `backend/src/db.ts` or `backend/src/db/index.ts` - provides database connection pool)
 * - `./authenticateToken` (`backend/src/routes/authenticateToken.ts` - middleware for JWT authentication)
 * - `crypto` (Node.js built-in module - for generating password reset tokens)
 * - `../utils/email` (Added import for email sending functionality)
 */
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from '../db';
import authenticateToken, { AuthRequest } from './authenticateToken';
// Node.js built-in crypto module
import * as crypto from 'crypto';
import { sendEmail } from '../utils/email';

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
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('first_name').optional().isLength({ min: 2 }).withMessage('First name too short'),
    body('family_name').optional().isLength({ min: 2 }),
    body('gender').optional().isIn(['male','female','other']),
    body('matricula').optional(),
    body('birthday').optional().isDate(),
    body('category').optional(),
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

      const { username, email, password, first_name, family_name, gender, matricula, birthday, category } = req.body;

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
          `INSERT INTO users (username, email, password, first_name, family_name, gender, matricula, birthday, category)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           RETURNING id, username, email, first_name, family_name, gender, matricula, birthday, category`,
          [username, email, hashedPassword, first_name, family_name, gender, matricula, birthday, category]
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
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Login attempt received with body:', JSON.stringify(req.body));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Login validation errors:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, password } = req.body;
      console.log('Login attempt with username:', username);

      // Allow login with either username or email
      const userResult = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $1',
        [username]
      );

      if (userResult.rows.length === 0) {
        console.log('No user found with username/email:', username);
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = userResult.rows[0];
      console.log('User found, validating password');

      // Validate credentials
      if (!(await bcrypt.compare(password, user.password))) {
        console.log('Password validation failed');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Use a default secret if environment variable is not set
      const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '15m' });
      console.log('Login successful for user:', user.username);

      // Send login notification email
      try {
        const loginTime = new Date().toLocaleString();
        await sendEmail({
          to: user.email,
          subject: 'Successful Login Notification',
          text: `Hello ${user.username},\n\nYour account was logged into at ${loginTime}.\n\nIf this was not you, please secure your account immediately.\n\nThanks,\nThe VHS Team`,
          html: `<p>Hello ${user.username},</p><p>Your account was logged into at <strong>${loginTime}</strong>.</p><p>If this was not you, please secure your account immediately.</p><p>Thanks,<br/>The VHS Team</p>`
        });
        console.log(`Login notification email sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send login notification email to ${user.email}:`, emailError);
        // Do not block login if email fails
      }

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_admin: user.is_admin,
          is_editor: user.is_editor
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, created_at, first_name, family_name, matricula, handicap, gender, birthday, category, is_admin, is_editor FROM users WHERE id = $1',
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
    body('email').optional().isEmail().withMessage('Must provide a valid email'),
    body('first_name').optional().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('family_name').optional().isLength({ min: 2 }).withMessage('Family name must be at least 2 characters'),
    body('gender').optional().isIn(['male','female','other']),
    body('matricula').optional().isLength({ min: 5 }).withMessage('Matricula must be at least 5 characters'),
    body('birthday').optional().isDate(),
    body('category').optional(),
    body('handicap').optional().isLength({ min: 1 }).withMessage('Handicap must be at least 1 character')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, first_name, family_name, gender, matricula, birthday, category, handicap } = req.body;

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

      if (first_name !== undefined) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(first_name);
      }

      if (family_name !== undefined) {
        updates.push(`family_name = $${paramCount++}`);
        values.push(family_name);
      }

      if (gender !== undefined) {
        updates.push(`gender = $${paramCount++}`);
        values.push(gender);
      }

      if (matricula !== undefined) {
        updates.push(`matricula = $${paramCount++}`);
        values.push(matricula);
      }

      if (birthday !== undefined) {
        updates.push(`birthday = $${paramCount++}`);
        values.push(birthday);
      }

      if (category !== undefined) {
        updates.push(`category = $${paramCount++}`);
        values.push(category);
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
      values.push(req.user?.id);

      // Update user
      const updatedUser = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email, first_name, family_name, gender, matricula, birthday, category, handicap`,
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

// Forgot password - request password reset
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Must provide a valid email')
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      // Find user
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      // Always return success, even if user doesn't exist (for security)
      if (!user) {
        console.log(`Password reset requested for non-existent email: ${email}`);
        res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
        return;
      }

      // Generate a token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // Token valid for 24 hours

      // Save token to database
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expires]
      );

      // Send the password reset email
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      try {
        await sendEmail({
          to: user.email,
          subject: 'Password Reset Request',
          text: `Hello ${user.username},` + 
                `\n\nPlease click the following link to reset your password: ${resetLink}` + 
                `\n\nIf you did not request a password reset, please ignore this email.` + 
                `\n\nThis link will expire in 24 hours.` + 
                `\n\nThanks,\nThe VHS Team`,
          html: `<p>Hello ${user.username},</p>` + 
                `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>` + 
                `<p>If you did not request a password reset, please ignore this email.</p>` + 
                `<p>This link will expire in 24 hours.</p>` + 
                `<p>Thanks,<br/>The VHS Team</p>`
        });
        console.log(`Password reset email sent to ${user.email} with link: ${resetLink}`);
      } catch (emailError) {
        console.error(`Failed to send password reset email to ${user.email}:`, emailError);
        // Optionally, you could decide to return an error to the user here if email is critical
        // For now, we still return the generic message for security (don't reveal if email exists/works)
      }

      // console.log(`Password reset token generated for user ${user.id}:`);
      // console.log(`Reset link would be: ${resetLink}`); // Already logged above

      res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    } catch (error: any) {
      console.error('Error in forgot-password:', error);
      next(error);
    }
  }
);

// Logout endpoint
router.post('/logout', authenticateToken, (req: AuthRequest, res: Response): void => {
  // Since JWT tokens are stateless, we can't truly invalidate them on the server
  // In a production environment, you might want to add the token to a blacklist
  // or use Redis to track invalidated tokens until they expire

  // For now, we'll just return a success message
  console.log('User logged out:', req.user?.id);
  res.status(200).json({ message: 'Successfully logged out' });
});

// Validate token endpoint
router.post('/validate-token', authenticateToken, (req: AuthRequest, res: Response): void => {
  // If this endpoint is reached, it means the token is valid (authenticateToken middleware passed)
  console.log('Token validated for user:', req.user?.id);
  
  // Return user ID to confirm token is valid for a specific user
  res.status(200).json({ 
    valid: true, 
    userId: req.user?.id 
  });
});

// Reset password using token
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
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

      const { token, password } = req.body;

      console.log(`[Reset Password] Attempting to reset password with token: ${token}`);

      // Log current time from database for comparison
      try {
        const dbTimeResult = await pool.query('SELECT NOW() as db_current_time;');
        console.log(`[Reset Password] Current DB time: ${dbTimeResult.rows[0].db_current_time}`);
      } catch (timeError) {
        console.error('[Reset Password] Error fetching DB time:', timeError);
      }

      // Find valid token
      const tokenResult = await pool.query(
        'SELECT *, expires_at > NOW() as is_valid_time FROM password_reset_tokens WHERE token = $1 AND used = false',
        [token]
      );

      const resetToken = tokenResult.rows[0];

      if (!resetToken) {
        console.log(`[Reset Password] Token not found or already used. Token value searched: ${token}`);
        res.status(400).json({ error: 'Invalid or expired token' });
        return;
      }

      // Log the retrieved token details for debugging
      console.log('[Reset Password] Found token in DB:', {
        tokenId: resetToken.id,
        userId: resetToken.user_id,
        storedToken: resetToken.token, // Should match the input token
        expiresAt: resetToken.expires_at,
        isUsed: resetToken.used,
        isValidTimeAgainstDBNow: resetToken.is_valid_time // Result of expires_at > NOW()
      });

      if (!resetToken.is_valid_time) {
        console.log(`[Reset Password] Token found but expired based on DB time. Expires At: ${resetToken.expires_at}`);
        res.status(400).json({ error: 'Invalid or expired token' });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, resetToken.user_id]);

      // Mark token as used
      await pool.query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetToken.id]);

      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
      console.error('Error in reset-password:', error);
      next(error);
    }
  }
);

// Change password for authenticated user
router.post(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 5 }).withMessage('New password must be at least 5 characters')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Get user from database
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user?.id]);
      
      if (userResult.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = userResult.rows[0];

      // Verify current password
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in database
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, req.user?.id]
      );

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;