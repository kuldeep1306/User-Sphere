import React from 'react'
import UI_IMG from"../../assets/images/auth-img.png";
const AuthLayout = ({children}) => {
  return <div className='flex'>
    <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Task manager</h2>
        {children}
        </div>
        <div className="hidden md:flex w-[40w] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-4">
            <img src={UI_IMG} className="" />
        </div>

    </div>
};

export default AuthLayout