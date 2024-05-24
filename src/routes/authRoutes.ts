import { Router, Request, Response, NextFunction, response } from "express";
import authService from "../auth/authService";
import { TokenManager } from '../auth/tokenManager';

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(200).json({ token });
      res.cookie('access_token', token, {
        httpOnly: true,
      }).status(200).json({ message: 'Login successful' });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const revokedTokens = TokenManager.getRevokedTokens();
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Invalid token format" });
  }
  const token = authHeader.substring(7); // Eliminar el prefijo "Bearer "
  TokenManager.addRevokedToken(token as any);
  // Verificar si el token ya ha sido revocado
  if (revokedTokens.includes(token)) {
    return res.status(401).json({ error: "Token has already been revoked" });
  }

  // Agregar el token a la lista de tokens revocados
  TokenManager.isTokenRevoked(token as string);

  // Responder con éxito
  return res.status(200).json({ message: "Logout successful" });
});


export default router;
