import express from 'express';
import authenticate from '../middleware/auth.js';
import { signup, login, logout, verify, verifyOTP, resendOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/verify', authenticate, verify);

export default router;
