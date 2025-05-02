import React from 'react'
import moment from 'moment';

const TaskListTable = ({ tableData }) => {
    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500 text-green-500 border-green-200';
            case 'inprogress':
                return 'bg-yellow-500 text-yellow-500 border-yellow-200';
            case 'pending':
                return 'bg-red-500 text-red-500 border-red-200';
            default:
                return 'bg-gray-500 text-gray-500 border-gray-200';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-500 text-red-500 border-red-200';
            case 'medium':
                return 'bg-yellow-500 text-yellow-500 border-yellow-200';
            case 'low':
                return 'bg-green-500 text-green-500 border-green-200';
            default:
                return 'bg-gray-500 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className='overflow-x-auto p-0 rounded-lg mt-3'>
            <table className='min-w-full'>
                <thead>
                    <tr className=''>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Task Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Priority</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((task) => (
                        <tr key={task._id} className='border-t border-gray-200'>
                            <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                            <td className='py-4 px-4'>
                                <span className={`px-2 py-1 text-xs inline-block rounded ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                            </td>
                            <td className='py-4 px-2'>
                                <span className={`px-2 py-1 text-xs inline-block rounded ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
                            </td>
                            <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.createdAt ? moment(task.createdAt).format('DD/MM/YYYY') : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskListTable;
