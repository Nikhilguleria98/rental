import User from '../models/User.js';
import Room from '../models/Room.js';
import cloudinary from '../config/cloudinary.js';

const parseAmenities = (amenities) => {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities.map((item) => item.trim()).filter(Boolean);
  return amenities
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const uploadFileToCloudinary = async (file) => {
  if (!file?.buffer) return null;
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'rental_rooms',
    resource_type: 'image',
    transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
  });
  return result.secure_url;
};

export const getAdminUsers = async (req, res) => {
  const users = await User.find().select('-password -__v').sort({ lastLoginAt: -1 });
  res.json(users);
};

export const getAdminRooms = async (req, res) => {
  const rooms = await Room.find().select('-__v').sort({ name: 1 });
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const {
    name,
    type,
    price,
    rating,
    reviews,
    shortDescription,
    description,
    amenities,
    availability,
  } = req.body;

  if (!name || !type || !price || !rating || !reviews) {
    return res.status(400).json({ message: 'Name, type, price, rating and reviews are required' });
  }

  const images = await Promise.all(
    (req.files || []).map(async (file) => {
      const url = await uploadFileToCloudinary(file);
      return url;
    })
  );

  const room = new Room({
    id: `room-${Date.now()}`,
    name,
    type,
    price: Number(price),
    rating: Number(rating),
    reviews: Number(reviews),
    shortDescription,
    description,
    amenities: parseAmenities(amenities),
    images: images.filter(Boolean),
    availability: availability === 'false' ? false : true,
  });

  await room.save();
  res.status(201).json(room);
};

export const updateRoom = async (req, res) => {
  const room = await Room.findOne({ id: req.params.id });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  const {
    name,
    type,
    price,
    rating,
    reviews,
    shortDescription,
    description,
    amenities,
    availability,
  } = req.body;

  if (name !== undefined) room.name = name;
  if (type !== undefined) room.type = type;
  if (price !== undefined) room.price = Number(price);
  if (rating !== undefined) room.rating = Number(rating);
  if (reviews !== undefined) room.reviews = Number(reviews);
  if (shortDescription !== undefined) room.shortDescription = shortDescription;
  if (description !== undefined) room.description = description;
  if (availability !== undefined) room.availability = availability === 'false' ? false : true;
  if (amenities !== undefined) room.amenities = parseAmenities(amenities);

  const uploadedImages = await Promise.all(
    (req.files || []).map(async (file) => {
      const url = await uploadFileToCloudinary(file);
      return url;
    })
  );

  if (uploadedImages.filter(Boolean).length) {
    room.images = [...room.images, ...uploadedImages.filter(Boolean)];
  }

  await room.save();
  res.json(room);
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findOne({ id: req.params.id });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  await Room.deleteOne({ id: req.params.id });
  res.json({ message: 'Room deleted' });
};
