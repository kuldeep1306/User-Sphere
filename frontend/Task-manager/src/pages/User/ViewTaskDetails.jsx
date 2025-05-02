import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import moment from 'moment';
import AvtaraGroup from '../../components/AvtaraGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  // Function to determine task status color
  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-green-500 bg-gray-50";
      default:
        return "text-red-500 bg-gray-50";
    }
  };

  // Fetch task details by ID
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // Update checklist status (complete/incomplete)
  const updateTodoCheckList = async (index) => {
    const todoCheckList = [...task?.todoCheckList];
    const taskId = id;

    if (todoCheckList && todoCheckList[index]) {
      todoCheckList[index].completed = !todoCheckList[index].completed;
      try {
        const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
          todoCheckList,
        });
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoCheckList[index].completed = !todoCheckList[index].completed;
        }
      } catch (error) {
        todoCheckList[index].completed = !todoCheckList[index].completed;
      }
    }
  };

  // Handle external link click
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    getTaskDetailsById();
  }, []);

  return (
    <DashboardLayout activeMenu="My-Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-xl font-medium text-black">{task?.title}</h2>
                <div className={`text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-2 rounded`}>
                  {task?.status}
                </div>
              </div>
              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">ToDo checkList</label>
                  {task?.todoCheckList?.map((item, index) => (
                    <TodoCheckList
                      key={`todo-${index}`}
                      text={item?.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoCheckList(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Due Date" value={task?.dueDate ? moment(task?.dueDate).format('YYYY-MM-DD') : "N/A"} />
                </div>
                <div className="mb-4">
                  <label className="block text-sx font-medium text-gray-700">Assigned To</label>
                  <AvtaraGroup users={task?.assignedTo?.map((item) => item?.profileImageUrl) || []} maxVisible={5} />
                </div>
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  {task?.attachments?.map((link, index) => (
                    <Attachments key={`link_${index}`} link={link} onClick={() => handleLinkClick(link)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

// InfoBox Component
const InfoBox = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-sm text-gray-600">{value}</p>
  </div>
);

// TodoCheckList Component
const TodoCheckList = ({ text, isChecked, onChange }) => (
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
    />
    <p className="text-[13px] text-gray-600">{text}</p>
  </div>
);

// Attachments Component
const Attachments = ({ link, onClick }) => (
  <div className="flex items-center mb-2" onClick={onClick}>
    <div className="flex-1 flex items-center gap-3 border border-gray-100">
      <span className="text-sm text-gray-600">{link}</span>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);
