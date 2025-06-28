import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserService } from './mongodb';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    userData?: any;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    // For admin routes, check if it's admin user
    if (decoded.userId === "admin" || decoded.email === "adminhednor@gmail.com") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Admin access required' });
    }
  } catch (error) {
    console.error('Admin token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we continue without authentication
    }
  }

  next();
}