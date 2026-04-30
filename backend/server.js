import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import roomsSeed from './data/rooms.js';
import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import Room from './models/Room.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const seedRooms = async () => {
  const count = await Room.countDocuments();
  if (count === 0 && roomsSeed.length > 0) {
    await Room.insertMany(roomsSeed);
    console.log(`Seeded ${roomsSeed.length} rooms`);
  }
};

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@rental.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    if (existingUser.role !== 'admin') {
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`Promoted existing user ${normalizedEmail} to admin`);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = new User({
    id: `admin-${Date.now()}`,
    name: 'Administrator',
    email: normalizedEmail,
    password: hashedPassword,
    role: 'admin',
  });
  await adminUser.save();
  console.log(`Seeded admin user ${normalizedEmail}`);
};

connectDB()
  .then(async () => {
    await seedRooms();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization error:', error);
    process.exit(1);
  });
