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


const port=process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json({limit:"10mb"}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);



if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../frontend/dist');

  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
    connectdb();
})