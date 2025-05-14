import ProductModel from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts=async (req,res)=>{
    try{
        const products=await ProductModel.find({});
        res.json({products});
    }
    catch(error){
        console.log("Error in getAllProducts function",error.message);
        res.status(500).json({message:'Internal Server Error',error:error.message});
    }
}

export const getFeaturedProducts=async (req,res)=>{
    try{
        let featuredProducts=await redis.get("featured_products");
        if(featuredProducts) return res.json(JSON.parse(featuredProducts));

        featuredProducts=await ProductModel.find({isFeatured:true}).lean();
        if(!featuredProducts) return res.status(404).json({message:"No featured products found"});
        await redis.set("featured_products",JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    }
    catch(error){
        console.log("Error in getFeaturedProducts controller",error.message);
        return res.status(500).json({message:'Internal Server Error',error:error.message});
    }
}

export const createProduct=async (req,res)=>{
    try{
        const {name,description,price,image,category}=req.body;
        let cloudinaryResponse=null;
        if(image){
            cloudinaryResponse=await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product=await ProductModel.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url:"",
            category
        })
        res.status(201).json(product);
    }
    catch(error){
        console.log("Error in createProduct controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}

export const deleteProduct=async (req,res)=>{
    try{
        const product=await ProductModel.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});

        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0];
            try{
                await cloudinary.uploader.destroy(`/product/${publicId}`);
                console.log("deleted image from cloudinary");
            }
            catch(error){
                console.log("Error in deleting image from cloudinary",error);
            }
        }
        await ProductModel.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted successfully"});
    }
    catch(error){
        console.log("Error in deleteProduct controller",error.message);
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}

export const getRecommendedProducts=async (req,res)=>{
    try{
        const products=await ProductModel.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1,
                }
            }
        ])
        res.json(products);
    }
    catch(error){
        console.log("Error in getRecommendedProducts controller",error.message);
        res.status(500).json({message:'Internal Server Error',error:error.message});
    }
}

export const getProductsByCategory=async (req,res)=>{
    const {category}=req.params;
    try{
        const products=await ProductModel.find({category:category});
        res.json({products});
    }
    catch(error){
        console.log('Error in getProductsByCategory controller',error.message);
        res.status(500).json({message:'Internal Server Error',error:error.message});
    }
}

async function updateFeaturedProductCache(){
    try{
        const featuredProducts=await ProductModel.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts));
    }
    catch(error){
        console.log('Error in update cache function',error.message);
    }
}
export const toggleFeaturedProduct=async (req,res)=>{
    try{
        const product=await ProductModel.findById(req.params.id);
        if(product){
            product.isFeatured=!product.isFeatured;
            const updatedProduct=await product.save();
            await updateFeaturedProductCache();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message:"Product not found"});
        }
    }
    catch(error){
        console.log('Error in toggleFeaturedProducts controller',error.message);
        res.status(500).json({message:'Internal Server Error',error:error.message});
    }
}