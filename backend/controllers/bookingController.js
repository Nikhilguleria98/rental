import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(bookings);
};

export const createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut, guests } = req.body;
  if (!roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'roomId, checkIn, checkOut, and guests are required' });
  }

  const room = await Room.findOne({ id: roomId });
  if (!room) {
    return res.status(400).json({ message: 'Room not found' });
  }

  const booking = new Booking({
    id: `${Date.now()}`,
    userId: req.user.id,
    roomId,
    roomName: room.name,
    price: room.price,
    checkIn,
    checkOut,
    guests,
  });

  await booking.save();
  res.status(201).json({ booking, message: 'Booking confirmed!' });
};
