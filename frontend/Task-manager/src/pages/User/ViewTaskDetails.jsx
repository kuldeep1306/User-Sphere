import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-200";
      case "Completed":
        return "text-green-600 bg-green-50 border border-green-200";
      default:
        return "text-red-600 bg-red-50 border border-red-200";
    }
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const updateTodoCheckList = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      try {
        const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
          todoChecklist,
        });
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };

  useEffect(() => {
    getTaskDetailsById();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My-Tasks">
      <div className="mt-6 p-6 bg-blue-100 rounded-xl shadow-md">
        {task && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">{task?.title}</h2>
              <div className={`text-sm px-4 py-1 rounded-full font-medium ${getStatusTagColor(task?.status)}`}>
                {task?.status}
              </div>
            </div>

            <InfoBox label="Description" value={task?.description || "N/A"} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ToDo Checklist</label>
              {task?.todoChecklist?.length ? (
                <div className="bg-white border border-gray-300 rounded-md p-4 space-y-3">
                  {task.todoChecklist.map((item, index) => (
                    <TodoCheckList
                      key={`todo-${item?._id || index}`}
                      text={item?.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoCheckList(index)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No checklist items</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox label="Priority" value={task?.priority || "N/A"} />
              <InfoBox label="Due Date" value={task?.dueDate ? moment(task?.dueDate).format('YYYY-MM-DD') : "N/A"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              {Array.isArray(task?.assignedTo) && task.assignedTo.length > 0 ? (
                <ul className="text-sm text-gray-700 bg-gray-50 border border-gray-300 p-3 rounded-md space-y-2">
                  {task.assignedTo.map((user, index) => {
                    const userId = typeof user === 'string' ? user : user._id || 'Unknown';
                    const displayName = typeof user === 'object' && user.name ? user.name : userId;
                    return (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                          {userId.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{displayName}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No users assigned</p>
              )}
            </div>

            {task?.attachment?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="space-y-2">
                  {task.attachment.map((link, index) => (
                    <Attachments key={`link_${index}`} link={link} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

// InfoBox Component
const InfoBox = ({ label, value }) => (
  <div>
    <label className="block text-xs uppercase font-semibold text-gray-500 mb-1">{label}</label>
    <div className="p-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700">
      {value}
    </div>
  </div>
);

// TodoCheckList Component
const TodoCheckList = ({ text, isChecked, onChange }) => {
  const id = `todo-${text.replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
        {text}
      </label>
    </div>
  );
};

// Attachments Component
const Attachments = ({ link }) => {
  const formattedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
  return (
    <a
      href={formattedLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm text-blue-600 hover:underline bg-white"
    >
      {link}
      <LuSquareArrowOutUpRight className="text-gray-500" />
    </a>
  );
};
