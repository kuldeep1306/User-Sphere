import React from 'react';
import Progress from '../Progress';
import AvtaraGroup from '../AvtaraGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const TaskCard = ({
  title,
  description,
  status,
  dueDate,
  priority,
  progress,
  createdAt,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoCheckList=[],
  onClick,
}) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  return (
    <div className=' bg-white shadow-lg rounded-xl py-4 px-5 hover:bg-slate-100 cursor-pointer' onClick={onClick}>
      
      {/* Status and Priority */}
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor()}`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityTagColor()}`}>
          {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
        </div>
      </div>

      {/* Task Title and Description */}
      <div className={`px-4 border-l-[3px] ${status === "inprogress" ? "border-yellow-500" : status === "completed" ? "border-green-500" : "border-red-500"}`}>
        <p className='font-semibold text-sm md:text-base'>{title}</p>
        <p className='text-xs md:text-sm text-gray-600 line-clamp-2'>{description}</p>
        
        <p className="text-xs font-medium">Task Done:{" "}
          <span className='font-semibold text-sm'>{completedTodoCount} / {todoCheckList.length || 0}</span>
        </p>
        
        <Progress progress={progress} status={status} />
      </div>

      {/* Dates */}
      <div className='px-4'>
        <div className='flex items-center justify-between my-1'>
          <div>
            <label className="font-medium">Start Date</label>
            <p className='text-[13px] font-medium'>{moment(createdAt).format("DD-MM-YYYY")}</p>
          </div>
          <div>
            <label className="font-medium">Due Date</label>
            <p className='text-[13px] font-medium text-gray-900'>{moment(dueDate).format("DD-MM-YYYY")}</p>
        
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4">
        {/* Assigned Avatars */}
        <AvtaraGroup avtars={assignedTo || []} />

        {/* Attachment Icon */}
        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
            <LuPaperclip className="text-primsry" />{" "}
            <span className="text-xs text-gray-900">{attachmentCount}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
