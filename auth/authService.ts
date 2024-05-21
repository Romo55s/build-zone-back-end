import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Client } from 'cassandra-driver';
import { v4 as uuidv4 } from 'uuid';
import jwtConfig from '../config/jwtConfig';
import client from '../config/cassandra';

interface AuthService {
  register(username: string, password: string, role: string, storeId: string): Promise<string>;
  login(username: string, password: string): Promise<string>;
  verifyToken(token: string): any;
}

const authService: AuthService = {
  async register(username, password, role, storeId) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const authToken = jwt.sign({ userId, username, role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    const query = 'INSERT INTO users (user_id, store_id, auth_token, username, password, role) VALUES (?, ?, ?, ?, ?, ?)';
    await client.execute(query, [userId, storeId, authToken, username, hashedPassword, role], { prepare: true });

    return authToken;
  },

  async login(username, password) {
    const query = 'SELECT user_id, username, password, role FROM users WHERE username = ? ALLOW FILTERING';
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const authToken = jwt.sign({ userId: user.user_id, username, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return authToken;
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

export default authService;
