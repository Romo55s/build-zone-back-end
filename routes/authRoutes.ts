import express from 'express';
import authController from '../auth/authController';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
