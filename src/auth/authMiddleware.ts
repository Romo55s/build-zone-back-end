import { Request, Response, NextFunction } from "express";
import authService from "./authService";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

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
    return res.status(401).json("No token found");
  }

  // Validar el formato del token
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret,
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json("Token expired");
          }
          return res.status(403).json("Invalid Token");
        }
        req.user = {
          username: decoded.username,
          role: decoded.role,
          store_id: decoded.store_id,
        };
        next();
      }
    );
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

interface ITokenPayload {
  username: string;
  role: string;
  user_id: string;
  store_id: string;
}

const authorize = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1]; // Extract token from Bearer
      const { username, role, user_id, store_id } = jwt.verify(token, jwtConfig.secret) as ITokenPayload;
      
      const user = { username, role, user_id, store_id };
      if (user && user.user_id) {
        req.user = user; // Attach user to request object
      } else {
        return res.status(403).json({ error: "Invalid user" });
      }

      // If user is admin, allow access
      if (user.role === "admin") {
        return next();
      }

      // If user is manager, check store_id
      if (user.role === "manager") {
        const store_id = user.store_id;
        // If store_id is not provided, deny access
        if (!store_id) {
          return res.status(403).json({ error: "Store ID is required" });
        }
        const requestedStoreId = await authService.getStoreById(store_id);
        // If store_id matches, allow access
        if (user.store_id === requestedStoreId.storeId) {
          return next();
        }
      }

      // If user does not have required role or store_id does not match, deny access
      res.status(403).json({ error: "Forbidden" });
    } else {
      return res.status(403).json({ error: "No token provided" });
    }
  };
};

export { authMiddleware, authorize };
