import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url=process.env.MONGO_URI;

export const connectdb=async ()=>{
    try{
        const conn=await mongoose.connect(url);
        console.log(`MongoDB connected:${conn.connection.host}`);
    }
    catch(err){
        console.log("Error connecting to MongoDB",err.message);
    }
}