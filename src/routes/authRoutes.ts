import { Router, Request, Response, NextFunction } from "express";
import authService from "../auth/authService";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role, storeId } = req.body;
      const result = await authService.register(username, password, role, storeId);
      res.status(result.status).json({ message: result.message });
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);

      if (result.status === 200 && result.authToken) {
        const userResult = await authService.getUserByUsername(username);

        if (userResult.status === 200 && userResult.user) {
          res.cookie('access_token', { token: result.authToken, user: userResult.user }, {
            httpOnly: true
          });
          res.status(200).json({ token: result.authToken, user: userResult.user });
        } else {
          res.status(userResult.status).json({ message: userResult.message });
        }
      } else {
        res.status(result.status).json({ message: result.message });
      }
    } catch (error: unknown) {
      console.log("error:", error);
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
