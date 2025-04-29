import React from 'react';

const UserCard = ({ user }) => {  // <-- FIXED prop name
  return (
    <div className='user-card p-4 shadow-md rounded-md border'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img
            src={user?.profileImageUrl || "https://via.placeholder.com/100"}
            alt={"Avatar"}
            className='w-12 h-12 rounded-full border-2 border-white object-cover'
          />
          <div>
            <p className='text-sm font-semibold'>{user?.name}</p>
            <p className='text-xs text-gray-500'>{user?.email}</p>
            <p className='text-xs text-gray-500'>Role: {user?.role}</p>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2 mt-5'>
        <StatCard
          label="Pending"
          count={user?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={user?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={user?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-green-500 bg-gray-50";
      default:
        return "text-red-500 bg-gray-50";
    }
  };

  return (
    <div className={`flex-1 text-center text-[12px] font-medium ${getStatusTagColor()} px-4 py-2 rounded-lg`}>
      <div className='text-[14px] font-bold'>{count}</div>
      {label}
    </div>
  );
};
