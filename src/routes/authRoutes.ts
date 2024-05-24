import { Router, Request, Response, NextFunction } from 'express';
import authService from '../auth/authService';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role, storeId } = req.body;
    const token = await authService.register(username, password, role, storeId);
    res.status(201).json({ token });
  } catch (error: any) {
    next(error);  // Use next() to pass the error to error-handling middleware
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json({ token });
  } catch (error: any) {
    next(error);  // Use next() to pass the error to error-handling middleware
  }
});

export default router;
