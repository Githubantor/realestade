import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { mockProperties, getMockInquiries, addMockInquiry } from '../utils/mockStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, message, property, type } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please provide name, email and message');
  }

  if (!isDbConnected()) {
    if (type === 'newsletter') {
      const exists = getMockInquiries().find((i) => i.email === email && i.type === 'newsletter');
      if (exists) {
        res.status(400);
        throw new Error('This email is already subscribed (mock)');
      }
    }
    const inquiry = addMockInquiry({
      name,
      email,
      phone,
      message,
      property: property || undefined,
      type: type || 'general',
      user: req.user ? req.user.id : undefined,
    });
    return res.status(201).json({ success: true, data: inquiry, mock: true });
  }

  // Simple newsletter duplicate check
  if (type === 'newsletter') {
    const exists = await Inquiry.findOne({ email, type: 'newsletter' });
    if (exists) {
      res.status(400);
      throw new Error('This email is already subscribed');
    }
  }

  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    message,
    property: property || undefined,
    type: type || 'general',
    user: req.user ? req.user.id : undefined,
  });

  res.status(201).json({ success: true, data: inquiry });
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const inquiries = getMockInquiries();
    return res.status(200).json({ success: true, count: inquiries.length, data: inquiries, mock: true });
  }
  const inquiries = await Inquiry.find()
    .populate('property', 'title address price')
    .populate('user', 'name email')
    .sort('-createdAt');
  res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  let inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }
  inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.status(200).json({ success: true, data: inquiry });
});

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }
  await inquiry.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
