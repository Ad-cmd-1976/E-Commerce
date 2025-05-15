import express from 'express';
import {protectedRoute} from '../middlewares/protected.middleware.js';
import {createCheckoutSession, checkoutSucess} from '../controllers/payment.controller.js';


const router=express.Router();

router.post('/create-checkout-session', protectedRoute, createCheckoutSession);
router.post('/checkout-success', protectedRoute, checkoutSucess);

export default router;