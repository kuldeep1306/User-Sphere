import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useState } from 'react'
import {useLocation, useNavigate} from "react-router-dom"
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu';
import SelctDropdown from '../../components/inputs/SelectDropdown'
import SelectUsers from '../../components/inputs/SelectUsers'
import TodoListInput from '../../components/inputs/TodoListInput'
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput'
import { toast } from 'react-hot-toast'
import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'

const CreateTask = () => {

const location = useLocation()
const navigate = useNavigate()
const { taskId } = location.state || {};

const [taskData, setTaskData] = useState({
  title: '',
  description: '',  
  dueDate: '',
  priority: 'Low',  
  assignedTo: '',
  attachments: [],
  todoChecklist: []  
});

const [currentTask, setCurrentTask] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [openDeleteAlert,  setOpenDeleteAlert] = useState(false);



const handleValueChange = (key , value ) => {
  setTaskData((prevData)   => ({...prevData, [key]: value}));
}

const clearData = () => {
  setTaskData({
    title: '',
    description: '',  
    dueDate: '',
    priority: 'Low',  
    assignedTo: '',
    attachments: [],
    todoChecklist: []  
  })
}

const createTask = async () => {
  setLoading(true);

  try {
    
    const todolist = taskData.todoChecklist?.map((item) => ( {
      text: item,
      checked: false
    }));

    const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todolist
    });
    toast.success('Task created successfully');

    clearData();

  } catch (error) {
    console.error('Error creating task:', error);
    setLoading(false);
  } finally {
    setLoading(false);    
  }
};

const deleteTask = async () => {
  try {

    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
    setOpenDeleteAlert(false);
    toast.success('Task deleted successfully');
    navigate('/admin/tasks');

  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message);
}
}

const updateTask = async () => {
  try {

    const todolist = taskData.todoChecklist?.map((item) =>  {
      const prevTodoChecklist = currentTask?.todoChecklist || [];
      const matchedTask = prevTodoChecklist.find(task => task.text === item);

      return {
        text: item,
        checked: matchedTask?.checked || false
      };
    });

    const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),

      todoChecklist: todolist
    });

    toast.success('Task updated successfully');

  } catch (error) {
    console.error('Error updating task:', error);
    setLoading(false);
  } finally {
    setLoading(false);

  }
}

const getTaskDetailsById = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
    if (response.data) {
      const taskInfo = response.data; // Define taskInfo first
      setCurrentTask(taskInfo);  // Then setCurentTask with taskInfo
      setTaskData((prevState) => ({
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
        assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
        todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
        attachments: taskInfo?.attachments || [],
      }));
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
  }
};

const handleSubmit = async () => {
  setError(null);

  if(!taskData.title.trim()) {
    setError('Title is required');
    return;
  }

  if(!taskData.description.trim()) {
    setError('Description is required');
    return;
  }

  if(!taskData.dueDate) {
    setError('Due date is required');
    return;
  }
  if(taskData.assignedTo?.length === 0) {
    setError('Assigned to is required');
    return;
  }

  if(taskData.todoChecklist?.length === 0) {
    setError('Task checklist is required');
    return;
  }

  if(taskId) {
    updateTask();
    return;
  }

  createTask();

}

useEffect(() => {
  if(taskId) {
    getTaskDetailsById();
  }
}, [taskId]);

  return (
    <DashboardLayout activeMenu="Create tasks">
      <div className='mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <div className='form-card col-span-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl md:text-xl'>
          {taskId ? 'Update Task' : 'Create Task'}
        </h2>

        {taskId && (
          <button className='flex items-center gap-2 text-[13px] text-red-600 bg-rose-100 px-2 py-1 border border-rose-100 hover:border-300 cursor-pointer'
              onClick={() => setOpenDeleteAlert(true)}>
              <LuTrash2 className='text-base' /> Delete
            </button>
        )}
          </div>
          <div className='mt-4'>
            <label className='text-xs font-medium text-slate-600'>
              Title
            </label>

            <input
            placeholder='Enter task title'
            className='form-input'
            value={taskData.title}
            onChange={({target}) => handleValueChange('title', target.value)}
            />
          </div>
          <div className='mt-4'>
            <label className='text-xs font-medium text-slate-600'>
              Description
            </label>

            <textarea
            placeholder='Enter task description'
            className='form-input'
            value={taskData.description}
            onChange={({target}) => handleValueChange('description', target.value)}
            />
          </div>

          <div className='grid grid-cols-12 gap-4 mt-2'>
            <div className='col-span-6 md:col-span-4'>
              <label className='text-xs font-medium text-slate-600'>
                Priority
              </label>

          <SelctDropdown
          options={PRIORITY_DATA}
          value={taskData.priority}
          onChange={(value) => handleValueChange('priority', value)}
          placeholder='Select Priority'
          />
          </div>

          <div className='col-span-6 md:col-span-4'>
            <label className='text-xs font-medium text-slate-600'> 
              Due Date
              </label>

              <input 
              placeholder='Enter due date'
              className='form-input'
              value={taskData.dueDate}
              onChange={({target}) => handleValueChange('dueDate', target.value)} 
              type='date'
              />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <label className='text-xs font-medium text-slate-600'>
              Assign To
            </label>
            <SelectUsers
            SelectedUsers = {taskData.assignedTo}
            setSelectedUsers = {(value) => {
              handleValueChange('assignedTo', value);

            }}
            />
            </div>
          </div>

          <div className=''>
            <label className='text-xs font-medium text-slate-600'>
              TODO CHECKLIST
              </label>

              <TodoListInput
              todoList={taskData?.todoChecklist}
              setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
          </div>
          <div className='mt-3'>
            <label className='text-xs font-medium text-slate-600'>
              Attachments
              </label>

              <AddAttachmentsInput 
              attachments={taskData?.attachments}
              setAttachments={(value) => handleValueChange('attachments', value)}
              />
              </div>

              {error && (
                <p className='text-xs text-rose-600 mt-2'>{error}</p>
              )}

              <div className='flex justify-end mt-7'>
                <button 
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
                >
                  {taskId ? 'Update Task' : 'Create Task'}
                </button>
                </div>


          </div>
          </div>
          </div>
          <Modal
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title='Delete Task'
          >
            <DeleteAlert
            content= "Are you sure you want to delete this task"
            onDelete={() => deleteTask()}
            />
          </Modal>

      </DashboardLayout>
  )
}

export default CreateTask