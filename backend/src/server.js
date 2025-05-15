import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes  from './routes/payment.route.js'
import analyticsRoutes  from './routes/analytics.route.js';
import cookieParser from 'cookie-parser';
import { connectdb } from './lib/db.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app=express();

const originalAppUse = app.use.bind(app);
app.use = function(path, ...handlers) {
  if (typeof path === 'string' && path.startsWith('http')) {
    console.error('🚨 INVALID ROUTE PATH passed to app.use():', path);
  } else if (typeof path === 'string') {
    console.log('📍 app.use path registered:', path);
  }
  return originalAppUse(path, ...handlers);
};


const port=process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json({limit:"10mb"}));
app.use(cookieParser());

try{
    console.log("Mounting /api/auth...");
    app.use('/api/auth', authRoutes);
}
catch(error){
    console.log("Failed to register auth routes",error.message);
}

try{
    console.log("Mounting /api/product...");
    app.use('/api/product', productRoutes);
}
catch(error){
    console.log("Failed to register product routes",error.message);
}

try{
    console.log("Mounting /api/cart...");
    app.use('/api/cart', cartRoutes);
}
catch(error){
    console.log("Failed to register cart routes",error.message);
}

try{
    console.log("Mounting /api/coupons...");
    app.use('/api/coupons', couponRoutes);
}
catch(error){
    console.log("Failed to register coupons routes",error.message);
}

try{
    console.log("Mounting /api/payments...");
    app.use('/api/payments', paymentRoutes);
}
catch(error){
    console.log("Failed to register payment routes",error.message);
}

try{
    console.log("Mounting /api/analytics...");
    app.use('/api/analytics', analyticsRoutes);
}
catch(error){
    console.log("Failed to register analytics routes",error.message);
}


if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../frontend/dist');

  console.log('✅ Serving frontend from:', distPath);

  app.use(express.static(distPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}



app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
    console.log("ENV:", process.env);
    connectdb();
})