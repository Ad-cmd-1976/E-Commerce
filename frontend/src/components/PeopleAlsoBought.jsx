import axios from '../lib/axios.js';
import ProductCard from './ProductCard.jsx'
import { useState, useEffect } from 'react';

const PeopleAlsoBought = () => {
  const [recommendations,setRecommendations]=useState([]);
  const [isloading,setisloading]=useState(true);

  useEffect(()=>{
    const fetchRecommendations=async ()=>{
      try{
        const res=await axios.get('/product/recommendations');
        setRecommendations(res.data);
      }
      catch(error){
        toast.error(error.response.data.error || "An Error occured while fetching recommendations");
      }
      finally{
        setisloading(false);
      }
    }
    fetchRecommendations();
  },[]);

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>People Also Bought</h3>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        { recommendations.map((product)=>(
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought