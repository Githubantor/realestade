import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(optionalAuth, createInquiry).get(protect, authorize('admin', 'agent'), getInquiries);

router.route('/:id').put(protect, authorize('admin', 'agent'), updateInquiryStatus).delete(protect, authorize('admin'), deleteInquiry);

export default router;
