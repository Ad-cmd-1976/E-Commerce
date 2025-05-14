import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"ProductModel",
                required:"true"
            },
            quantity:{
                type:Number,
                required:true,
                min:1
            },
            price:{
                type:Number,
                required:true,
                min:0
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true,
        min:0
    },
    stripeSessionId:{
        type:String,
        unique:true
    }
},
{ timestamps:true }
)

const OrderModel=mongoose.model("order", orderSchema);
export default OrderModel;