import Room from '../models/Room.js';

export const getRooms = async (req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });
  res.json(rooms);
};

export const getRoomById = async (req, res) => {
  const room = await Room.findOne({ id: req.params.id });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  res.json(room);
};
