import { Request, Response, NextFunction } from "express";
import authService from "./authService";
import { User } from "../models/userModel";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(403).send("Token is required");
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded; // TypeScript will now recognize the user property

    // Verificar si el token ha expirado
    const tokenExpired = await authService.isTokenRevoked(token);
    if (tokenExpired) {
      return res.status(401).send("Token has expired");
    }

    // Verificar si el token ha sido revocado
    const tokenRevoked = await authService.isTokenRevoked(token);
    if (tokenRevoked) {
      return res.status(401).send("Token has been revoked");
    }

    // Si el token es válido y no ha expirado ni sido revocado, continuar con la siguiente middleware
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

const authorize = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User; // Ensure user has the expected type
    const requestedStoreId = req.params.storeId; // Assuming store ID is in request parameters
    console.log("User ->", user);
    // If user is admin, allow access
    if (user.role === "admin") {
      return next();
    }

    // If user is manager, verify if requested store ID matches user's store ID
    if (user.role === "manager" && user.store_id === requestedStoreId) {
      console.log("Store id-> ", user.store_id);
      return next();
    }

    // If user does not have required role or does not match store, deny access
    res.status(403).json({ error: "Forbidden" });
  };
};

export { authMiddleware, authorize };
