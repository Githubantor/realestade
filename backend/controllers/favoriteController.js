import asyncHandler from 'express-async-handler';
import Favorite from '../models/Favorite.js';

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id }).populate('property');
  res.status(200).json({ success: true, count: favorites.length, data: favorites });
});

// @desc    Add favorite
// @route   POST /api/favorites/:propertyId
// @access  Private
export const addFavorite = asyncHandler(async (req, res) => {
  const propertyId = req.params.propertyId;

  const exists = await Favorite.findOne({ user: req.user.id, property: propertyId });
  if (exists) {
    res.status(400);
    throw new Error('Already in favorites');
  }

  const fav = await Favorite.create({ user: req.user.id, property: propertyId });
  const populated = await fav.populate('property');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Remove favorite
// @route   DELETE /api/favorites/:propertyId
// @access  Private
export const removeFavorite = asyncHandler(async (req, res) => {
  const fav = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
  if (!fav) {
    res.status(404);
    throw new Error('Favorite not found');
  }
  await fav.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Check if favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private
export const checkFavorite = asyncHandler(async (req, res) => {
  const exists = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
  res.status(200).json({ success: true, isFavorite: !!exists });
});
