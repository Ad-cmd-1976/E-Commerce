import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { Toaster } from 'react-hot-toast'

const SignupPage = () => {
  const {signup, loading}=useUserStore();
  const [formData, setformData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })
  const handleSubmit=(e)=>{
    e.preventDefault();
    signup(formData);
  }
  return (
    <div className='flex flex-col justify-center py-0 sm:px-4 lg:px-6'>
      <motion.div
      className='sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity:0, y:-20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.8, delay:0.2 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create Your Account</h2>
      </motion.div>

      <motion.div
      className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.8, delay:0.2 }}
      >
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>

            <div>
              <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
                Full Name
              </label>
              <div className='relative rounded-md shadow-sm mt-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                </div>

                <input
                id='name'
                type='text'
                value={formData.name}
                onChange={(e)=>setformData({...formData,name:e.target.value})}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='John Doe'
                />

              </div>
            </div>

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-300'>
                Email
              </label>
              <div className='relative rounded-md shadow-sm mt-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                </div>

                <input
                id='email'
                type='text'
                value={formData.email}
                onChange={(e)=>setformData({...formData,email:e.target.value})}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='johndoe@gmail.com'
                />

              </div>
            </div>

            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-300'>
                Password
              </label>
              <div className='relative rounded-md shadow-sm mt-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                </div>

                <input
                id='password'
                type='password'
                value={formData.password}
                onChange={(e)=>setformData({...formData,password:e.target.value})}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='••••••••••'
                />

              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-300'>
                Confirm Password
              </label>
              <div className='relative rounded-md shadow-sm mt-1'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                </div>

                <input
                id='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={(e)=>setformData({...formData,confirmPassword:e.target.value})}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='••••••••••'
                />

              </div>
            </div>

            <button 
            type='submit'
            disabled={loading}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
            >
              {loading ? (
                <>
                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
                Loading...
                </>
              ):(
                <>
                <UserPlus className='mr-2 h-5 w-5' aria-hidden='true'/>
                SignUp
                </>
              )}

            </button>
          </form>

          <p className='mt-8 text-sm text-center text-gray-400'>
              Already Have An Account?{" "}
              <Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
              Login Here <ArrowRight className='inline h-4 w-4'/>
              </Link>
          </p>

        </div>
      </motion.div>

      <Toaster/>
    </div>
  )
}

export default SignupPage