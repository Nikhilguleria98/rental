import express from 'express';
import authenticate from '../middleware/auth.js';
import { getUserBookings, createBooking, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', authenticate, getUserBookings);
router.post('/', authenticate, createBooking);
router.delete('/:id', authenticate, cancelBooking);

export default router;
