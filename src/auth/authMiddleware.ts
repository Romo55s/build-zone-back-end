import { Request, Response, NextFunction } from 'express';
import authService from './authService';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded; // TypeScript will now recognize the user property
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: string }; // Ensure user has the expected type
    if (user && roles.includes(user.role)) {
      next();
    } else {
      res.status(403).send('You do not have the required permissions');
    }
  };
};

export { authMiddleware, authorize };
