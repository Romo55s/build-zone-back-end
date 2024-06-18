import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import storeRoutes from './routes/storeRoutes';
import salesRoutes from './routes/salesRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productStoreRoutes';
import { authMiddleware } from './auth/authMiddleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
require('events').EventEmitter.defaultMaxListeners = 20;

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'https://build-zone-front-end.onrender.com'],
  credentials: true
}));

app.use(cookieParser());
app.use(authMiddleware);

app.use(bodyParser.json());

// Apply body-parser after multer routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/store', storeRoutes);
app.use('/sales', salesRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Build-zone API');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

export default app;
