import React from 'react'

const Progress = ({progress, status}) => {
    const getColor = () => {
        switch (status) {
            case "In progress":
                return "bg-yellow-500 text-yellow-500 border-yellow-200";
            case "Completed":
                return "bg-green-500 text-green-500 border-green-200";
            default:
                return "bg-red-500 text-red-500 border-red-200";
        }
    }
  return (
    <div className='w-full flex items-center gap-1.5 text-xs md:text-sm text-primary whitespace-nowrap font-medium bg-white hover:bg-blue-50 px-4 py-2 rounded-lg border-primary cursor-pointer'>
        <div className={`w-3 h-3 rounded-full ${getColor()}`}>
            
        </div>
        </div>
        
  )
}

export default Progress