import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { addThousandsSeparator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/charts/CustomPieChart';
import CustomBarChart from '../../components/charts/CustomBarChart';

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for data
  const [pieChartData, setPieChartData] = useState([]); // Pie chart data state
  const [barChartData, setBarChartData] = useState([]); // Bar chart data state

  // Prepare the chart data
  const prepareChartData = (data) => {
    if (!data) return;

    const taskDistribution = data?.taskDistribution || {}; // Ensure taskDistribution exists
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    // Prepare Pie chart data (Task Distribution)
    const taskDistributinData = [
      { status: "Pending", count: taskDistribution?.pending || 0 },
      { status: "In-progress", count: taskDistribution?.inprogress || 0 },
      { status: "Completed", count: taskDistribution?.completed || 0 },
    ];
    setPieChartData(taskDistributinData);

    // Prepare Bar chart data (Task Priority Levels)
    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.medium || 0 },
      { priority: "High", count: taskPriorityLevels?.high || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  // Fetch Dashboard Data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      console.log("Dashboard Data:", response.data);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null); // Pass chart data to prepareChartData
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    getDashboardData();
  }, []);

  const { taskDistribution } = dashboardData?.charts || { taskDistribution: { pending: 0, inprogress: 0, completed: 0 } };

  // Calculate total tasks
  const totalTasks = (taskDistribution.pending || 0) + (taskDistribution.inprogress || 0) + (taskDistribution.completed || 0);

  return (
    <DashboardLayout activeMenu="My Task">
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Or use a spinner component
      ) : (
        <div>
          <div className="card my-5">
            <div>
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">Good MORNING! {user?.name}</h2>
                <p className="text-sm md:text-[13px] text-gray-400 mt-1">
                  {moment().format("dddd, MMMM D, YYYY")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={addThousandsSeparator(totalTasks)}
                color="bg-primary"
              />

              <InfoCard
                label="Pending Tasks"
                value={addThousandsSeparator(taskDistribution.pending || 0)}
                color="bg-violet-500"
              />

              <InfoCard
                label="In Progress Tasks"
                value={addThousandsSeparator(taskDistribution.inprogress || 0)}
                color="bg-cyan-500"
              />

              <InfoCard
                label="Completed Tasks"
                value={addThousandsSeparator(taskDistribution.completed || 0)}
                color="bg-lime-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-5">
            <div>
              <div className="card">
                <div className="flex item-center justify-between">
                  <h5 className="text-lg font-semibold">Task Distribution</h5>
                </div>
                <CustomPieChart data={pieChartData || []} colors={COLORS} />
              </div>
            </div>

            <div>
              <div className="card">
                <div className="flex item-center justify-between">
                  <h5 className="text-lg font-semibold">Task Priority Level</h5>
                </div>
                <CustomBarChart data={barChartData || []} />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="card">
                <div className="flex item-center justify-between">
                  <h5 className="text-lg font-semibold">Recent Tasks</h5>

                  <button className="card-btn" onClick={() => navigate("/admin/tasks")}>
                    See All <LuArrowRight className="text-base" />
                  </button>
                </div>
                <TaskListTable tableData={dashboardData?.recentTasks || []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
