import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import { mockProperties } from '../utils/mockStore.js';

// Helper to check DB
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all properties with filtering, searching, sorting, pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  // Fallback to mock if DB offline
  if (!isDbConnected()) {
    let filtered = [...mockProperties];
    if (req.query.search || req.query.keyword) {
      const kw = (req.query.search || req.query.keyword).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.address.toLowerCase().includes(kw) ||
          p.title.toLowerCase().includes(kw) ||
          p.tag.toLowerCase().includes(kw) ||
          p.neighborhood.toLowerCase().includes(kw)
      );
    }
    if (req.query.neighborhood && req.query.neighborhood !== 'All') {
      filtered = filtered.filter((p) => p.neighborhood === req.query.neighborhood);
    }
    if (req.query.beds) {
      filtered = filtered.filter((p) => p.beds >= Number(req.query.beds));
    }
    if (req.query.type) {
      filtered = filtered.filter((p) => p.type === req.query.type);
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return res.status(200).json({
      success: true,
      count: paginated.length,
      total: filtered.length,
      pagination: {},
      data: paginated,
      mock: true,
    });
  }

  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'keyword'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let mongoQuery = JSON.parse(queryStr);

  // Search
  if (req.query.search || req.query.keyword) {
    const keyword = req.query.search || req.query.keyword;
    mongoQuery.$or = [
      { address: { $regex: keyword, $options: 'i' } },
      { title: { $regex: keyword, $options: 'i' } },
      { tag: { $regex: keyword, $options: 'i' } },
      { neighborhood: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Additional filters: neighborhood, status, type, price range, beds
  if (req.query.neighborhood && req.query.neighborhood !== 'All') {
    mongoQuery.neighborhood = req.query.neighborhood;
  }
  if (req.query.status) mongoQuery.status = req.query.status;
  if (req.query.type) mongoQuery.type = req.query.type;
  if (req.query.beds) mongoQuery.beds = { $gte: Number(req.query.beds) };
  if (req.query.baths) mongoQuery.baths = { $gte: Number(req.query.baths) };
  if (req.query.minPrice || req.query.maxPrice) {
    mongoQuery.priceValue = {};
    if (req.query.minPrice) mongoQuery.priceValue.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) mongoQuery.priceValue.$lte = Number(req.query.maxPrice);
  }

  query = Property.find(mongoQuery).populate('agent', 'name email avatar');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(mongoQuery);

  query = query.skip(startIndex).limit(limit);

  const properties = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    pagination,
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const property = mockProperties.find((p) => p._id === req.params.id);
    if (!property) {
      res.status(404);
      throw new Error(`Property not found with id ${req.params.id}`);
    }
    return res.status(200).json({ success: true, data: property, mock: true });
  }
  const property = await Property.findById(req.params.id).populate('agent', 'name email avatar phone');

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id ${req.params.id}`);
  }

  // Increment views
  property.views += 1;
  await property.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, data: property });
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private (agent/admin)
export const createProperty = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const newProp = {
      _id: `mock${Date.now()}`,
      ...req.body,
      agent: req.user.id,
      image: req.body.image || req.body.images?.[0],
      images: req.body.images || [req.body.image],
      priceValue: req.body.priceValue || Number((req.body.price || '').replace(/[^0-9]/g, '')),
      views: 0,
      createdAt: new Date().toISOString(),
    };
    mockProperties.unshift(newProp);
    return res.status(201).json({ success: true, data: newProp, mock: true });
  }
  req.body.agent = req.user.id;

  // Auto-generate image from images[0] if not provided
  if (req.body.images && req.body.images.length > 0 && !req.body.image) {
    req.body.image = req.body.images[0];
  }

  // Parse priceValue from price string if not provided
  if (!req.body.priceValue && req.body.price) {
    req.body.priceValue = Number(req.body.price.replace(/[^0-9]/g, ''));
  }

  const property = await Property.create(req.body);

  res.status(201).json({ success: true, data: property });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner/admin)
export const updateProperty = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const idx = mockProperties.findIndex((p) => p._id === req.params.id);
    if (idx === -1) {
      res.status(404);
      throw new Error(`Property not found with id ${req.params.id}`);
    }
    mockProperties[idx] = { ...mockProperties[idx], ...req.body };
    if (req.body.images && req.body.images.length > 0 && !mockProperties[idx].image) {
      mockProperties[idx].image = req.body.images[0];
    }
    return res.status(200).json({ success: true, data: mockProperties[idx], mock: true });
  }
  let property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id ${req.params.id}`);
  }

  // Check ownership unless admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  if (req.body.images && req.body.images.length > 0 && !req.body.image) {
    req.body.image = req.body.images[0];
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: property });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner/admin)
export const deleteProperty = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const idx = mockProperties.findIndex((p) => p._id === req.params.id);
    if (idx === -1) {
      res.status(404);
      throw new Error(`Property not found with id ${req.params.id}`);
    }
    mockProperties.splice(idx, 1);
    return res.status(200).json({ success: true, data: {}, mock: true });
  }
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id ${req.params.id}`);
  }

  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  await property.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get featured properties
// @route   GET /api/properties/featured/list
// @access  Public
export const getFeatured = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    const properties = mockProperties.filter((p) => p.featured).slice(0, 6);
    return res.status(200).json({ success: true, count: properties.length, data: properties, mock: true });
  }
  const properties = await Property.find({ featured: true, isPublished: true })
    .limit(6)
    .sort('-createdAt');
  res.status(200).json({ success: true, count: properties.length, data: properties });
});

// @desc    Get stats
// @route   GET /api/properties/stats/overview
// @access  Public
export const getStats = asyncHandler(async (req, res) => {
  if (!isDbConnected()) {
    return res.status(200).json({
      success: true,
      data: { total: mockProperties.length, avgPrice: 72600000, totalSalesVolume: '$4.2B+' },
      mock: true,
    });
  }
  const total = await Property.countDocuments({ isPublished: true });
  const avgPriceAgg = await Property.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: null, avgPrice: { $avg: '$priceValue' } } },
  ]);
  res.status(200).json({
    success: true,
    data: {
      total,
      avgPrice: avgPriceAgg[0]?.avgPrice || 0,
      totalSalesVolume: '$4.2B+',
    },
  });
});
