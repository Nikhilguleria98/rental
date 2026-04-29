import express from 'express';
import { getRooms, getRoomById } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);

export default router;
