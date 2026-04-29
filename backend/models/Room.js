import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  shortDescription: { type: String },
  description: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  availability: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
