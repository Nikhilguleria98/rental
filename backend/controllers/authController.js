import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTPEmail } from '../utils/emailService.js';

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
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  const user = new User({
    id: `${Date.now()}`,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'user',
    isEmailVerified: false,
    otp,
    otpExpiry,
  });

  await user.save();

  // Send OTP email
  const emailSent = await sendOTPEmail(normalizedEmail, otp);
  if (!emailSent) {
    return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
  }

  res.json({ message: 'Signup successful. Please verify your email with the OTP sent to your email.', userId: user.id, email: user.email });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email already verified' });
  }

  if (user.otp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  if (new Date() > user.otpExpiry) {
    return res.status(401).json({ message: 'OTP has expired' });
  }

  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ message: 'Email verified successfully', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email already verified' });
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  const emailSent = await sendOTPEmail(email.toLowerCase(), otp);
  if (!emailSent) {
    return res.status(500).json({ message: 'Failed to resend OTP email. Please try again.' });
  }

  res.json({ message: 'OTP resent successfully' });
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

  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Please verify your email first' });
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
