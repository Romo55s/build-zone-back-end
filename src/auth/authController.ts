import { Request, Response } from "express";
import authService from "./authService";

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, password, role, storeId } = req.body;
      const token = await authService.register(
        username,
        password,
        role,
        storeId
      );
      res.status(201).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const token = await authService.login(username, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  logout: (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logout successful' });
  },
};

export default authController;