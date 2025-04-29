import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState('');

    const handleAddOption = () => {
        const trimmed = option.trim();
        if (trimmed !== '') {
            setTodoList([...todoList, trimmed]);
            setOption('');
        }
    };

    const handleDeleteOption = (index) => {
        const updatedOptions = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedOptions);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between bg-gray-50 px-3 border border-gray-100 py-2 rounded mb-3"
                >
                    <p className='text-xs text-black'>
                        <span className='text-xs text-gray-600 font-semibold mr-2'>
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button className='cursor-pointer' onClick={() => handleDeleteOption(index)}>
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>
            ))}

            <div className='flex items-center gap-5 mt-4'>
                <input
                    type="text"
                    placeholder='Enter a task'
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md'
                />
                <button className='card-btn text-nowrap' onClick={handleAddOption}>
                    <HiMiniPlus className='text-lg' /> ADD
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
