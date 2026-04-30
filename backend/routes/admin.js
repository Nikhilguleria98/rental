import express from 'express';
import multer from 'multer';
import authenticate from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getAdminUsers, getAdminRooms, createRoom, updateRoom, deleteRoom, getAdminBookings, toggleRoomAvailability } from '../controllers/adminController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/users', authenticate, isAdmin, getAdminUsers);
router.get('/rooms', authenticate, isAdmin, getAdminRooms);
router.get('/bookings', authenticate, isAdmin, getAdminBookings);
router.post('/rooms', authenticate, isAdmin, upload.array('images', 6), createRoom);
router.put('/rooms/:id', authenticate, isAdmin, upload.array('images', 6), updateRoom);
router.patch('/rooms/:id/availability', authenticate, isAdmin, toggleRoomAvailability);
router.delete('/rooms/:id', authenticate, isAdmin, deleteRoom);

export default router;
