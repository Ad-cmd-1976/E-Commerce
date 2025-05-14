import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true
    },
    discountPercentage:{
        type:String,
        required:true,
        min:0,
        max:100
    },
    expirationDate:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    }
},
{
    timestamps:true
})

const CouponModel=mongoose.model("Coupon", couponSchema);

export default CouponModel;