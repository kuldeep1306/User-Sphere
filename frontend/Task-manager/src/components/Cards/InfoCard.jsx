import React from 'react';

const InfoCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white shadow rounded-lg">
      <div className={`w-4 h-4 ${color} rounded-full`} />
      <div className="flex flex-col">
        <span className="text-md font-semibold text-gray-800">{value}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      {Icon && <Icon className="ml-auto text-xl text-gray-400" />}
    </div>
  );
};

export default InfoCard;
