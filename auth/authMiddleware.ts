import { Request, Response, NextFunction } from 'express';
import authService from './authService';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

export default authMiddleware;
