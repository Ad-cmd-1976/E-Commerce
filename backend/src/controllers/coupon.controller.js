import CouponModel from "../models/coupon.model.js";

export const getCoupon=async (req,res)=>{
    try{
        const coupon=await CouponModel.findOne({userId:req.user._id,isActive:true});
        res.json(coupon || null);
    }
    catch(error){
        console.log("Error in getCoupon controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}

export const validateCoupon=async (req,res)=>{
    try{
        const {code}=req.body;
        const coupon=await CouponModel.findOne({userId:req.user._id,couponCode:code,isActive:true});

        if(!coupon){
           return res.status(404).json({message:"Coupon not found!"});
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive=false;
            await coupon.save();
            return res.status(404).json({message:"Coupon Expired"});
        }
        res.json({
            message:"Coupon Valid",
            code:coupon.code,
            discountPercentage:coupon.discountPercentage
        })
    }
    catch(error){
        console.log("Error in validateCoupon controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}