// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";

declare module "express-serve-static-core" {
  interface Request {
    user?: User | JwtPayload | string;
  }
}
