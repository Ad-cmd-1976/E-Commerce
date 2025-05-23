import { useEffect, useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import { useUserStore } from '../store/useUserStore.js'
import { toast } from 'react-hot-toast';

const FeaturedProducts = ({featuredProducts}) => {
  const [currentIndex,setCurrentIndex]=useState(0);
  const [itemsperPage,setItemsperPage]=useState(4);

  const {user}=useUserStore();
  const {addToCart}=useCartStore();

  const handleAddToCart=(product)=>{
    if(!user){
      toast.error("Please login to add products to cart",{id:"login"});
    }
    else{
      addToCart(product);
    }
  }

  useEffect(()=>{
    const handleResize=()=>{
      if(window.innerWidth<640) setItemsperPage(1);
      else if(window.innerWidth<1024) setItemsperPage(2);
      else if(window.innerWidth<1280) setItemsperPage(3);
      else setItemsperPage(4);
    }
    handleResize();
    window.addEventListener("resize",handleResize);
    return ()=>window.removeEventListener("resize",handleResize);
  },[])

  const nextSlide=()=>{
    setCurrentIndex((prevIndex)=>prevIndex+itemsperPage);
  }

  const prevSlide=()=>{
    setCurrentIndex((prevIndex)=>prevIndex-itemsperPage);
  }

  const isStartDisabled=currentIndex===0;
  const isEndDisabled=currentIndex>=featuredProducts.length-itemsperPage;


  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-6">Featured</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out"
            style={{transform:`translate(-${currentIndex*(100/itemsperPage)}%)`}}
            >
              { featuredProducts?.map((product)=>(
                <div key={product._id} className="w-full sm:w-1/2 lg:1/3 xl:w-1/4 flex-shrink-0 px-2">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
                    <div className="overflow-hidden">
                      <img src={product.image} alt={product.name}
                      className="w-full hover:scale-110 h-48 object-cover transition-transform duration-300 ease-in-out"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                      <p className="text-emerald-300 font-medium mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                      onClick={()=>handleAddToCart(product)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2"/>
                        Add to Cart
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

          <button 
          onClick={prevSlide}
          disabled={isStartDisabled}
          className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transiton-colors duration-300 ${
            isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
          }`}
          >
            <ChevronLeft className="w-6 h-6"/>
          </button>

          <button 
          onClick={nextSlide}
          disabled={isEndDisabled}
          className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transiton-colors duration-300 ${
            isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
          }`}
          >
            <ChevronRight className="w-6 h-6"/>
          </button>


        </div>

      </div>

    </div>
  )
}

export default FeaturedProducts