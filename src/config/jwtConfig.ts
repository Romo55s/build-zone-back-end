import * as dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.JWT_SECRET || 'default_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
