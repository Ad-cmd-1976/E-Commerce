import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Loader, Upload } from 'lucide-react'
import { useProductStore } from '../store/useProductStore.js';

const categories=["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
  const [newProduct,setnewProduct]=useState({
    name:"",
    description:"",
    price:"",
    image:"",
    category:""
  });

  const {createProduct, loading}=useProductStore();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    console.log(newProduct);
    try{
      await createProduct(newProduct);
      setnewProduct({name:"",description:"",price:"",image:"",category:""});
    }
    catch(error){
      console.log("Error in creating the product");
    }
  }

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      const reader=new FileReader();

      reader.onloadend=()=>{
        setnewProduct({...newProduct,image:reader.result});
      }
      reader.readAsDataURL(file);
    }
  }

  return (
    <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.8}}
    >
      <h2 className='text-2xl font-semibold mb-6 text-emerald-300 text-center'>Create New Product</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
            Product Name
          </label>
          <input 
          type="text"
          id='name'
          name='name'
          value={newProduct.name}
          onChange={(e)=>setnewProduct({...newProduct,name:e.target.value})}
          className='mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required
          />
        </div>

        <div>
          <label htmlFor="description" className='block text-sm font-medium text-gray-300'>
            Description
          </label>
          <textarea 
          id='description'
          name='description'
          value={newProduct.description}
          onChange={(e)=>setnewProduct({...newProduct,description:e.target.value})}
          rows='3'
          className='mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required
          />
        </div>

        <div>
          <label htmlFor="price" className='block text-sm font-medium text-gray-300'>
            Price
          </label>
          <input 
          type="number"
          id='price'
          name='price'
          value={newProduct.price}
          onChange={(e)=>setnewProduct({...newProduct,price:e.target.value})}
          step='0.01'
          className='mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required
          />
        </div>

        <div>
          <label htmlFor="category" className='block text-sm font-medium text-gray-300'>
            Category
          </label>
          <select 
          id='category'
          name='category'
          value={newProduct.category}
          onChange={(e)=>setnewProduct({...newProduct,category:e.target.value})}
          step='0.01'
          className='mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required
          >
          <option value="">Select a Category</option>
          {categories.map((category)=>(
            <option value={category} key={category}>
              {category}
            </option>
          ))}
          </select>
        </div>

        <div className='flex items-center'>
          <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange}/>
          <label 
          htmlFor="image"
          className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500'
          >
            <Upload className='h-5 w-5 mr-2 inline-block'/>
            Upload Image
          </label>
          {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image Uploaded</span>}
        </div>

        <button
        type='submit'
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 disabled:opacity-50'
        disabled={loading}
        >
          {loading?(
            <>
            <Loader className='h-5 w-5 mr-2 animate-spin' aria-hidden='true'/>
            Loding...
            </>
          ):(
            <>
            <PlusCircle className='h-5 w-5 mr-2'/>
            Create Product
            </>
          )}
        </button>
      </form>

    </motion.div>
  )
}

export default CreateProductForm