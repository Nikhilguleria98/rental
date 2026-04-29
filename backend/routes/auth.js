import express from 'express';
import authenticate from '../middleware/auth.js';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);

export default router;
