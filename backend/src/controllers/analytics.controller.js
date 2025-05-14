import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

export const getAnalyticsData=async ()=>{
    const totalUsers=await UserModel.countDocuments();
    const totalProducts=await ProductModel.countDocuments();

    const salesData=await OrderModel.aggregate([
        {
            $group:{
                _id:null,
                totalAmount:{$sum:1},
                totalRevenue:{$sum:"$totalAmount"}
            }
        }
    ])

    const {totalAmount, totalRevenue}=salesData[0] || {totalSales:0, totalRevenue:0};

    return {
        users:totalUsers,
        products:totalProducts,
        totalSales:totalAmount,
        totalRevenue:totalRevenue
    }
}

export const getDailySalesData=async (startDate,endDate)=>{
    try{
        const dailySalesData=await OrderModel.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:startDate,
                        $lte:endDate
                    },
                }
            },
            {
                $group:{
                    _id:{$dateToString:{format:"%Y-%m-%d", date:"$createdAt"}},
                    sales:{$sum:1},
                    revenue:{$sum:"$totalAmount"}
                }
            },
            {$sort:{_id:1}}
        ]);
    
        const dateArray=getDatesInRange(startDate,endDate);
    
        return dateArray.map(date=>{
            const foundData=dailySalesData.find(item=>item._id===date);
    
            return {
                date,
                sales:foundData?.sales || 0,
                revenue:foundData?.revenue || 0
            }
        })
    }
    catch(error){
        throw error;
    }
}

function getDatesInRange(startDate,endDate){
    const dates=[];
    const currentDate=new Date(startDate);

    while(currentDate<=endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1);
    }

    return dates;
}