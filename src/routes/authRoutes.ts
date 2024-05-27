// src/routes/authRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import authService from "../auth/authService";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role, storeId } = req.body;
      await authService.register(username, password, role, storeId);
      res.status(201).json({ message: "Successfully registered" });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const token = await authService.login(username, password);
      const user = await authService.getUserByUsername(username);
      
      res.cookie('user', user);
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.status(200).json({ username: user.username, token });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('access_token');
  res.clearCookie('user');
  res.status(200).json('Logout success');
});

export default router;
