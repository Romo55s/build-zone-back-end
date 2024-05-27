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
  ): Promise<string>;
  login(username: string, password: string, role?: string): Promise<string>;
  getUserByUsername(username: string): Promise<any>;
  getStoreIdByName(storeName: string): Promise<any>; //
}

const authService: AuthService = {
  async register(username, password, role, storeId) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (user_id, store_id, username, password, role) VALUES (?, ?, ?, ?, ?)";
    await client.execute(
      query,
      [userId, storeId, username, hashedPassword, role],
      { prepare: true }
    );

    return "Successfully register";
  },

  async login(username: string, password: string): Promise<string> {
    const query =
      "SELECT user_id, username, password, role, store_id FROM users WHERE username = ? ALLOW FILTERING";
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const authToken = jwt.sign(
      { username, password, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return authToken;
  },

  async getUserByUsername(username: string) {
    const query = "SELECT user_id, username, password, role, store_id FROM users WHERE username = ? ALLOW FILTERING";
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    // Convert UUID buffers to strings
    user.user_id = user.user_id.toString();
    user.store_id = user.store_id.toString();

    return user;
  },

  async getStoreIdByName(storeName: string) {
    const query = "SELECT store_id FROM store WHERE store_name = ? ALLOW FILTERING";
    const result = await client.execute(query, [storeName], { prepare: true });
  
    if (result.rows.length === 0) {
      throw new Error("Store not found");
    }
  
    const store = result.rows[0];
  
    // Convert UUID buffer to string
    store.store_id = store.store_id.toString();
  
    return store.store_id;
  },
};

export default authService;
