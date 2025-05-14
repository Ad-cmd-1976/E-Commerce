import { useEffect, useState } from 'react'
import { PlusCircle, ShoppingCart, BarChart } from 'lucide-react'
import CreateProductForm from '../components/CreateProductForm.jsx'
import ProductList from '../components/ProductList.jsx'
import AnalyticsTab from '../components/AnalyticsTab.jsx'
import { motion } from 'framer-motion'
import { useProductStore } from '../store/useProductStore.js'

const tabs=[
    {id:"create",label:"Create Product",icon:PlusCircle},
    {id:"products",label:"Products",icon:ShoppingCart},
    {id:"analytics",label:"Analytics",icon:BarChart}
];

const AdminPage = () => {
    const [activeTab,setactiveTab]=useState("create");

    const {fetchAllProducts}=useProductStore();

    useEffect(()=>{
        fetchAllProducts();
    },[fetchAllProducts]);

  return (
    <div className='min-h-screen relative overflow-hidden'>
        <div className='relative z-10 container mx-auto px-4 py-8'>
            <motion.h1
            className="text-4xl md:text-5xl font-bold text-emerald-400 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            >
            Admin Dashboard
            </motion.h1>
        </div>

        <div className='flex flex-wrap justify-center gap-3 mb-8 px-4'>
            {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setactiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
            </button>
            ))}
        </div>

        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductList />}
        {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  )
}

export default AdminPage