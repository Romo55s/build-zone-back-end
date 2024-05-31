import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes';
import storeRoutes from './src/routes/storeRoutes';
import salesRoutes from './src/routes/salesRoutes';
import userRoutes from './src/routes/userRoutes';
import productRoutes from './src/routes/productStoreRoutes';
import { authMiddleware } from './src/auth/authMiddleware';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authMiddleware);

// Routes
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
