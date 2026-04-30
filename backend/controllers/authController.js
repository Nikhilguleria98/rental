import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rental-demo-secret';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    id: `${Date.now()}`,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'user',
  });

  await user.save();

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  user.isLoggedIn = true;
  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isLoggedIn: user.isLoggedIn, lastLoginAt: user.lastLoginAt } });
};

export const logout = async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.isLoggedIn = false;
  await user.save();
  res.json({ message: 'Logged out' });
};

export const verify = async (req, res) => {
  // Since authenticate middleware already verified the token, just return success
  res.json({ valid: true, user: req.user });
};
