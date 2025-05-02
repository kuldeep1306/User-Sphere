import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const navigate = useNavigate();

  // Fetch tasks based on status filter
  const getAllTasks = async (status) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: status === 'All' ? undefined : status,
        },
      });

      console.log("API Response:", response.data);

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: 'All', count: statusSummary.allTasks || 0 },
        { label: 'Pending', count: statusSummary.pendingTasks || 0 },
        { label: 'In-progress', count: statusSummary.inprogressTasks || 0 },
        { label: 'Completed', count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Navigate to task details page
  const handleClick = (taskId) => {
    const isValidTaskId = /^[a-fA-F0-9]{24}$/.test(taskId); // MongoDB ObjectID validation
    if (isValidTaskId) {
      navigate(`/user/tasks-details/${taskId}`);
    } else {
      console.error("Invalid task ID format");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activemenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium md:text-xl">My Task</h2>
          </div>

          {/* Show tabs even if counts are zero */}
          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              dueDate={item.dueDate}
              priority={item.priority}
              progress={item.progress}
              createdAt={item.createdAt}
              assignedTo={
                Array.isArray(item.assignedTo)
                  ? item.assignedTo.map((user) => user.profileImageUrl)
                  : item.assignedTo?.profileImageUrl
              }
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoCheckList={item.todoCheckList || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
