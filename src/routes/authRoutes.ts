// routes/authRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import authService from "../auth/authService";
import { TokenManager } from '../auth/tokenManager';

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

      // Guardar storeId en la sesión
      req.session.storeId = user.store_id;

      res.status(200).json({ token });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Invalid token format" });
  }
  const token = authHeader.substring(7); // Eliminar el prefijo "Bearer "

  try {
    const decoded = authService.verifyToken(token);
    const expiration = decoded.exp * 1000; // Convertir a milisegundos

    // Verificar si el token ya ha sido revocado
    if (TokenManager.isTokenRevoked(token)) {
      return res.status(401).json({ error: "Token has already been revoked" });
    }

    // Agregar el token a la lista de tokens revocados
    TokenManager.addRevokedToken(token, expiration);

    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
