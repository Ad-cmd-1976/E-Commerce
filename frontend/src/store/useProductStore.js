import {create} from 'zustand';
import axios from '../lib/axios.js';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios.js';

export const useProductStore=create((set,get)=>({
    products:[],
    loading:false,
    isloading:false,

    setProducts:(products)=>set({products:products}),

    createProduct:async (productData)=>{
        set({loading:true});
        try{
            const res=await axios.post('/product', productData);
            set((prevState)=>({
                products:[...prevState.products, res.data],
                loading:false
            }));
        }
        catch(error){
            toast.error(error.response.data.error);
            set({loading:false});
        }
    },

    fetchAllProducts: async ()=>{
        set({loading:true});
        try{
            const res=await axios.get('/product');
            set({products:res.data.products,loading:false});
        }
        catch(error){
            toast.error(error.response.data.error || "Failed to fetch products");
            set({loading:false});
        }
    },

    fetchProductsByCategory:async (category)=>{
        set({loading:true});
        try{
            const res=await axios.get(`/product/category/${category}`);
            set({products:res.data.products,loading:false});
        }
        catch(error){
            set({error:"Failed to fetch products", loading:false});
            toast.error("Failed to fetch products" || error.response.data.error);
        }
    },

    deleteProduct: async (productId)=>{
        set({loading:true});
        try{
            await axios.delete(`/product/${productId}`);
            set((prevProducts)=>({
                products:prevProducts.products.filter((product)=>(product._id!==productId)),
                loading:false
            }))
        }
        catch(error){
            set({loading:false});
            toast.error(error.response.data.error || "Failed to delete product");
        }

    },

    toggleFeatured: async (productId)=>{
        set({loading:true});
        try{
            const res=await axios.patch(`/product/${productId}`);
            set((prevProducts)=>({
                products:prevProducts.products.map((product)=>(
                    product._id===productId?{...product,isFeatured:res.data.isFeatured}:product
                )),
                loading:false
            }))
        }
        catch(error){
            set({loading:false});
            toast.error(error.response.data.error || "Failed to update response");
        }
    },

    fetchFeaturedProducts:async ()=>{
        set({isloading:true});
        try{
            const res=await axiosInstance.get('/product/featured');
            set({ products:res.data });
        }
        catch(error){
            toast.error(error.response?.data?.message || "An Error Occured While Fetching Featured Products");
        }finally{
            set({isloading:false});
        }
    }
}))