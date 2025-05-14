import express from 'express';
import {getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct} from '../controllers/product.controller.js';
import { protectedRoute, adminRoute } from '../middlewares/protected.middleware.js';

const router=express.Router();

router.get('/', protectedRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.patch('/:id', toggleFeaturedProduct);
router.get('/category/:category', getProductsByCategory);
router.get('/recommendations', getRecommendedProducts);
router.post('/', protectedRoute, adminRoute, createProduct);
router.delete('/:id', protectedRoute, adminRoute, deleteProduct);

export default router;