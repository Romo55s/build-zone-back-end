import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes';
import storeRoutes from './src/routes/storeRoutes';
import { authMiddleware } from './src/auth/authMiddleware';

const app = express();

app.use(bodyParser.json());
app.use(authMiddleware);

//Routes
app.use('/auth', authRoutes);
app.use('/store', storeRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Build-zone API');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

export default app;
