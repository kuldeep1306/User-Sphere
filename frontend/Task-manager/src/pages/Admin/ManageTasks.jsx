import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';


const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const navigate = useNavigate();

  // Function to fetch all tasks based on filterStatus
// Function to fetch all tasks based on filterStatus
const getAllTasks = async (status) => {
  console.log('Fetching tasks with status:', status);  // Debug log for the status being passed
  try {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
      params: {
        status: status === 'All' ? undefined : status,
      },
    });
    console.log('API Response:', response.data);  // Debug log for the API response

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


  // Handle navigation to create task page
  const handleClick = (taskData) => {
    const isValidTaskId = /^[a-fA-F0-9]{24}$/.test(taskData._id); // Assuming task ID is MongoDB ObjectID
    if (isValidTaskId) {
      navigate('/admin/create-task', { state: { taskId: taskData._id } });
    } else {
      console.error("Invalid task ID format");
    }
  };
  
  // Download report logic (stub for now)
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: 'blob',
      });
  
      console.log('Response:', response);  // Log response object
  
      // Check if response or data is undefined
      if (!response || !response.data) {
        throw new Error('No data received from the API');
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };
  

// Inside your ManageTasks component
useEffect(() => {
  getAllTasks(filterStatus);
}, [filterStatus]); 

return (
  <DashboardLayout activemenu="Manage Tasks">
    <div className="my-5">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium md:text-xl">My Tasks</h2>

        </div>
        
        {/* Ensure tabs render even if counts are zero */}
        {tabs?.[0]?.count > 0 && (
          <div className="flex items-center gap-8">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
            {/* Remove one button based on screen size */}
          <button className="flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>

          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              dueDate={item.dueDate}
              priority={item.priority}
              progress={item.progress}
              createdAt={item.createdAt}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoCheckList={item.todoCheckList || []}
              onClick={() =>{

               handleClick(item)}
          }
            />
          ))}
      </div>
    </div>
  </DashboardLayout>
);
}
export default ManageTasks;