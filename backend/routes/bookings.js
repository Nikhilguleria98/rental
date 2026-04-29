import express from 'express';
import authenticate from '../middleware/auth.js';
import { getUserBookings, createBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', authenticate, getUserBookings);
router.post('/', authenticate, createBooking);

export default router;
