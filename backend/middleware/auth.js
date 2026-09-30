import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import User from '../models/User.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const mockUsersById = {
  mock_admin_id: { _id: 'mock_admin_id', id: 'mock_admin_id', name: 'Elara Admin', email: 'admin@elaraestates.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
  mock_agent_id: { _id: 'mock_agent_id', id: 'mock_agent_id', name: 'Sebastian Vance', email: 'agent@elaraestates.com', role: 'agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
};

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!isDbConnected()) {
      // Mock mode: construct user from token
      const mock = mockUsersById[decoded.id];
      if (mock) {
        req.user = mock;
      } else if (decoded.id.startsWith('mock_')) {
        // Generic mock user (from register/login fallback)
        const email = decoded.id.replace('mock_', '');
        req.user = { _id: decoded.id, id: decoded.id, name: email.split('@')[0] || 'Mock User', email: email.includes('@') ? email : 'user@mock.com', role: 'user' };
      } else {
        req.user = { _id: decoded.id, id: decoded.id, name: 'Mock User', email: 'mock@elara.com', role: 'user' };
      }
      return next();
    }
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!isDbConnected()) {
        const mock = mockUsersById[decoded.id];
        if (mock) req.user = mock;
        else if (decoded.id.startsWith('mock_')) {
          const email = decoded.id.replace('mock_', '');
          req.user = { _id: decoded.id, id: decoded.id, name: email.split('@')[0] || 'Mock User', email: email.includes('@') ? email : 'user@mock.com', role: 'user' };
        } else {
          req.user = { _id: decoded.id, id: decoded.id, name: 'Mock User', email: 'mock@elara.com', role: 'user' };
        }
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (e) {
      // ignore
    }
  }
  next();
});
