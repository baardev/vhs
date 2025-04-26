import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom interface for the request with user property
interface AuthRequest extends Request {
  user?: { 
    id: number;
    is_editor?: boolean;
  };
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