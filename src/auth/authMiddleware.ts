import { Request, Response, NextFunction } from "express";
import authService from "./authService";
import { User } from "../models/userModel";
import jwt from 'jsonwebtoken';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const publicPaths = ["/auth/login", "/auth/register", "/auth/logout"];
  const path = req.path;

  if (publicPaths.includes(path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json('No token found');
  }

  // Validar el formato del token
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  const token = authHeader.substring(7);

  try {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json('Token expired');
        }
        return res.status(403).json('Invalid Token');
      }
      req.user = {
        username: decoded.username,
        role: decoded.role,
        store_id: decoded.store_id
      };
      next();
    });
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

const authorize = (requiredRoles: string[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User; // Ensure user has the expected type
    const storeName = req.params.storeName;
    const requestedStoreId = await authService.getStoreIdByName(storeName);

    if(!req.cookies.user){
      return res.status(403).json({ error: "Error User Logout" });
    }

    user.store_id = req.cookies.user.store_id;
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