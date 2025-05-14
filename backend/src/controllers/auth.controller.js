import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import dotenv from "dotenv";

dotenv.config();

const generateTokens=(userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});
    return {accessToken,refreshToken};
}

const storeRefreshToken=async (userId,refreshToken)=>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60);
}

const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly: true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:15*60*60*1000
    });
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    });
}

export const signup=async (req,res)=>{
    const {email,name,password}=req.body;
    try{
        const userExists=await UserModel.findOne({email});
        
        if(userExists){
            return res.status(400).json({message:'User Already Exists!'});
        }

    
        const user=await UserModel.create({email,name,password});

        const {accessToken,refreshToken}=generateTokens(user._id);
        await storeRefreshToken(user._id,refreshToken);

        setCookies(res,accessToken,refreshToken);
        
        return res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        });
    }
    catch(error){
        console.log("Error in signup controller",error.message);
        return res.status(500).json({message:error.message});
    }
}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});

        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateTokens(user._id);

            storeRefreshToken(user._id,refreshToken);
            setCookies(res,accessToken,refreshToken);

            res.status(201).json({
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            })
        }
        else{
            res.status(400).json({message:"Invalid email or password"});
        }
    }catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:error.message});
    }
}

export const logout=async (req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;
        if(refreshToken){
            const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(201).json({message:"Logged Out Successfully"});
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}

export const refreshToken=async (req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;

        if(!refreshToken){
            res.status(401).json({message: "No refresh token provided"});
        }

        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storedToken=await redis.get(`refresh_token:${decoded.userId}`);

        if(storedToken!==refreshToken){
            res.status(401).json({message:"Invalid refresh token"});
        }

        const accessToken=jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
            maxAge:15*60*1000
        })

        res.json({message:"Token Refreshed Successfully"});
    }
    catch(error){
        console.log("Error in refreshToken controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}

export const getProfile=async (req,res)=>{
    try{
        res.json(req.user);
    }
    catch(error){
        console.log("Error in getProfile function of auth controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}