import React from 'react'

const DeleteAlert = ({content, onDelete}) => {
  return (
    <div>

        <p className='text-sm'>{content}</p>

        <div className='flex justify-end mt-6'>
            <button
            className='flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-400 whitespace-nowrap bg-rose-100 border border-rose-200 rounded-lg px-4 py-2 cursor-pointer'
        onClick={onDelete}
        >
            Delete krdo
        </button>
            </div>
    </div>
  )
}

export default DeleteAlert