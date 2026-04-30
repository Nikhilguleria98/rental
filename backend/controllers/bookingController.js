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

  if (!room.availability) {
    return res.status(400).json({ message: 'This room is currently unavailable and cannot be booked' });
  }

  room.availability = false;
  await room.save();

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

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ id: req.params.id, userId: req.user.id });
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const room = await Room.findOne({ id: booking.roomId });
  if (room) {
    room.availability = true;
    await room.save();
  }

  await Booking.deleteOne({ id: req.params.id });
  res.json({ message: 'Booking canceled successfully' });
};
