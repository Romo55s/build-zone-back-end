import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";
import jwtConfig from "../config/jwtConfig";
import client from "../config/cassandra";

interface AuthService {
  register(
    username: string,
    password: string,
    role: string,
    storeId: string
  ): Promise<{ status: number, message: string }>;
  login(username: string, password: string): Promise<{ status: number, message: string, authToken?: string }>;
  getUserByUsername(username: string): Promise<{ status: number, message: string, user?: any }>;
  getStoreById(storeId: string): Promise<{ status: number, message: string, storeId?: string }>;
}

const authService: AuthService = {
  async register(username: string, password: string, role: string, storeId: string) {
    try {
      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO users (user_id, store_id, username, password, role) VALUES (?, ?, ?, ?, ?)";
      await client.execute(
        query,
        [userId, storeId, username, hashedPassword, role],
        { prepare: true }
      );

      return { status: 200, message: "Successfully registered" };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { status: 500, message: `Registration failed: ${errorMessage}` };
    }
  },

  async login(username: string, password: string): Promise<{ status: number, message: string, authToken?: string, user?: any }> {
    try {
      const query =
        "SELECT user_id, username, password, role, store_id FROM users WHERE username = ? ALLOW FILTERING";
      const result = await client.execute(query, [username], { prepare: true });
  
      if (result.rows.length === 0) {
        return { status: 404, message: "User not found" };
      }
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return { status: 401, message: "Invalid password" };
      }
  
      const authToken = jwt.sign(
        { username, role: user.role, user_id: user.user_id, store_id: user.store_id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );
  
      return { status: 200, message: "Login successful", authToken, user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { status: 500, message: `Login failed: ${errorMessage}` };
    }
  },

  async getUserByUsername(username: string) {
    try {
      const query = "SELECT user_id, username, password, role, store_id FROM users WHERE username = ? ALLOW FILTERING";
      const result = await client.execute(query, [username], { prepare: true });

      if (result.rows.length === 0) {
        return { status: 404, message: "User not found" };
      }

      const user = result.rows[0];

      // Convert UUID buffers to strings
      user.user_id = user.user_id.toString();
      user.store_id = user.store_id.toString();

      return { status: 200, message: "User found", user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { status: 500, message: `Failed to retrieve user: ${errorMessage}` };
    }
  },

  async getStoreById(storeId: string) {
    try {
      const query = "SELECT store_id FROM store WHERE store_id = ? ALLOW FILTERING";
      const result = await client.execute(query, [storeId], { prepare: true });
  
      if (result.rows.length === 0) {
        return { status: 404, message: "Store not found" };
      }
  
      const store = result.rows[0];
  
      // Convert UUID buffer to string
      store.store_id = store.store_id.toString();
  
      return { status: 200, message: "Store found", storeId: store.store_id };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { status: 500, message: `Failed to retrieve store: ${errorMessage}` };
    }
  },
};

export default authService;
