import express from 'express'
import { adminRoute, protectedRoute } from '../middlewares/protected.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';


const router=express.Router();

router.get('/', protectedRoute, adminRoute, async (req,res)=>{
    try{
        const analyticsdata=await getAnalyticsData();

        const endDate=new Date();
        const startDate=new Date(endDate.getTime()-7*24*60*60*1000);

        const dailySalesData=await getDailySalesData(startDate,endDate);

        return res.json({analyticsdata, dailySalesData});
    }
    catch(error){
        console.log("Error in analytics route",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

export default router;