import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Mock users for offline mode
const mockUsers = [
  {
    _id: 'mock_admin_id',
    name: 'Elara Admin',
    email: 'admin@elaraestates.com',
    password: 'admin123', // plain for mock check
    role: 'admin',
    phone: '3108883527',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  },
  {
    _id: 'mock_agent_id',
    name: 'Sebastian Vance',
    email: 'agent@elaraestates.com',
    password: 'agent123',
    role: 'agent',
    phone: '3108883527',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
];

const generateMockToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  if (!isDbConnected()) {
    const exists = mockUsers.find((u) => u.email === email.toLowerCase());
    if (exists) {
      res.status(400);
      throw new Error('User already exists (mock mode)');
    }
    const newUser = {
      _id: `mock_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'user',
      phone,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    };
    const token = generateMockToken(newUser._id);
    return res.status(201).json({ success: true, token, user: newUser, mock: true });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, phone });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  if (!isDbConnected()) {
    const mockUser = mockUsers.find((u) => u.email === email.toLowerCase());
    // Also allow any registered mock user to login with any password for demo, but check mockUsers first
    if (mockUser) {
      if (mockUser.password !== password) {
        res.status(401);
        throw new Error('Invalid credentials (mock mode: try admin123 / agent123)');
      }
      const token = generateMockToken(mockUser._id);
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          phone: mockUser.phone,
          avatar: mockUser.avatar,
        },
        mock: true,
      });
    }
    // For any other email in mock mode, allow login as user if password length >=6 (demo convenience)
    if (password.length >= 6) {
      const token = generateMockToken(`mock_${email}`);
      return res.status(200).json({
        success: true,
        token,
        user: { _id: `mock_${email}`, name: email.split('@')[0], email, role: 'user', phone: '' },
        mock: true,
      });
    }
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    // req.user is set by auth middleware mock handling
    if (req.user) {
      return res.status(200).json({ success: true, data: req.user, mock: true });
    }
    const mockUser = mockUsers.find((u) => u._id === req.user?.id);
    return res.status(200).json({ success: true, data: mockUser || req.user, mock: true });
  }
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// Helper: Get token & send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
};
