import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeatured,
  getStats,
} from '../controllers/propertyController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured/list', getFeatured);
router.get('/stats/overview', getStats);

router.route('/').get(getProperties).post(protect, authorize('agent', 'admin'), createProperty);

router
  .route('/:id')
  .get(optionalAuth, getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
