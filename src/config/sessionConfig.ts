// config/sessionConfig.ts
import session from 'express-session';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'default_secret_key', // Usa la clave de .env o una clave por defecto
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Para desarrollo; en producción, usa true con HTTPS
});

export default sessionConfig;
