import express from 'express';
import { protectedRoute } from '../middlewares/protected.middleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';

const router=express.Router();

router.get('/', protectedRoute, getCoupon);
router.post('/validateCoupon', protectedRoute, validateCoupon);

export default router;