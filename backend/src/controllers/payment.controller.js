import {stripe} from '../lib/stripe.js';
import CouponModel from '../models/coupon.model.js';
import OrderModel from '../models/order.model.js';
import dotenv from 'dotenv'

dotenv.config();

const BASE_URI=(process.env.NODE_ENV==="development")?"http://localhost:5173":"";

export const createCheckoutSession=async (req,res)=>{
    try{
        const {products,couponCode}=req.body;

        if(!Array.isArray(products) || products.length===0){
            res.status(400).json({error:"Invalid or empty Products array"});
        }

        let totalAmount=0;
        
        const lineItems=products.map((product)=>{
            const amount=Math.round(product.price*100); 
            totalAmount+=(amount*product.quantity);
            
            return {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:product.name,
                        images:[product.image]
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1
            }
        })

        const coupon=null;
        
        if(couponCode){
            coupon=await CouponModel.findOne({couponCode: couponCode,userId:req.user._id,isActive:true});
            if(coupon){
                totalAmount-=Math.round(totalAmount*discountPercentage/100);
            }
        }
        
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card",],
            line_items:lineItems,
            mode:"payment",
            success_url:`${BASE_URI}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${BASE_URI}/purchase-cancel`,
            discounts:coupon ? [ { coupon: await createStripeCoupon(coupon.discountPercentage), }, ] : [],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode || "",
                products: JSON.stringify(
                    products.map((p)=>({
                        id:p._id,
                        quantity:p.quantity,
                        price:p.price
                    }))
                )
            }
        })
        
        if(totalAmount>=20000){
            await createNewCoupon(req.user._id);
        }
        res.status(200).json({ id:session.id,totalAmount:totalAmount/100 })
    }
    catch(error){
        console.log("Error in createCheckout function controller");
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
};

export const checkoutSucess=async (req,res)=>{
    try{
        const {sessionId}=req.body;
        const session=await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status=="paid"){
            if(session.metadata.couponCode){
                await CouponModel.findByIdAndUpdate({code:session.metadata.couponCode,userId:session.metadata.userId},{isActive:false})
            }

            const products=JSON.parse(session.metadata.products);
            const newOrder=new OrderModel({
                user:session.metadata.userId,
                products:products.map((product)=>({
                    productId:product.id,
                    quantity:product.quantity,
                    price:product.price
                })),
                totalAmount:session.amount_total/100, 
                stripeSessionId:sessionId
            })

            await newOrder.save();

            res.status(200).json({
                success:true,
                message:"Payment Successfull, Order Created, and coupon deactivated if used!",
                orderId:newOrder._id
            })
        }
    }
    catch(error){
        console.error("Error processing successfull checkout",error.message);
        res.status(500).json({message:"Error processing Succesfull Checkout",error:error.message});
    }
};

async function createStripeCoupon(discountPercentage){
    const coupon=await stripe.coupons.create({
        percentage_off:discountPercentage,
        duration:"once"
    })

    return coupon.id;
}

async function createNewCoupon(userId){
    await CouponModel.findOneAndDelete({userId});
    const newCoupon=new CouponModel({
        couponCode:"GIFT"+Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:10,
        expirationDate:new Date(Date.now()+30*24*60*60*1000),
        userId:userId,
        isActive:true
    })

    await newCoupon.save();

    return newCoupon;
}