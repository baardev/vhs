/**
 * @fileoverview Middleware for JWT authentication.
 *
 * @remarks
 * This module provides middleware to verify JWT tokens from the authorization header.
 * It defines a custom `AuthRequest` interface that extends Express's `Request` type to include user information.
 * If authentication is successful, it attaches the user object (containing `id` and optionally `is_editor`) to the request object.
 *
 * Called by:
 * - `backend/src/routes/admin.ts`
 * - `backend/src/routes/adminAuth.ts`
 * - `backend/src/routes/auth.ts`
 * - `backend/src/routes/courses.ts`
 * - `backend/src/routes/coursesData.ts`
 * - `backend/src/routes/playerCards.ts`
 *
 * Calls:
 * - `express` (external library - for Request, Response, NextFunction types)
 * - `jsonwebtoken` (external library - for JWT verification)
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom interface for the request with user property
interface AuthRequest extends Request {
  user?: { 
    id: number;
    is_editor?: boolean;
  };
  // Explicitly include properties from Express.Request that might be causing issues
  // These should be inherited, but being explicit can sometimes help the linter.
  headers: Request['headers'];
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
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

    // Use a default secret if environment variable is not set
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

    const decoded = jwt.verify(token, jwtSecret) as { userId: number; is_editor?: boolean };
    req.user = { 
      id: decoded.userId,
      is_editor: decoded.is_editor
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;
export type { AuthRequest };