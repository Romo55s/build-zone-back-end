import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Client } from 'cassandra-driver';
import { v4 as uuidv4 } from 'uuid';
import jwtConfig from '../config/jwtConfig';
import client from '../config/cassandra';
import { TokenManager } from './tokenManager'; // Importa el módulo singleton


interface AuthService {
  register(username: string, password: string, role: string, storeId: string): Promise<string>;
  login(username: string, password: string): Promise<string>;
  verifyToken(token: string): any;
  isTokenRevoked(token: string): boolean; // Nueva función para verificar si un token está revocado
}

const authService: AuthService = {
  async register(username, password, role, storeId) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (user_id, store_id, username, password, role) VALUES (?, ?, ?, ?, ?)';
    await client.execute(query, [userId, storeId, username, hashedPassword, role], { prepare: true });

    return 'Successfully register';
  },


  async login(username, password) {
    const query = 'SELECT user_id, username, password, role, store_id FROM users WHERE username = ? ALLOW FILTERING';
    const result = await client.execute(query, [username], { prepare: true });
    const authToken = jwt.sign({ username, password }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return authToken;
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  isTokenRevoked(token) {
    return TokenManager.isTokenRevoked(token);
  }
};

export default authService;