import React from 'react';

const StatCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`font-semibold ${textColor} dark:text-white`}>
        {title.includes('Open') ? 'Open' : title.includes('In Progress') ? 'In Progress' : 'Closed'}
      </span>
    </div>
    <h3 className="text-4xl font-bold text-gray-800 dark:text-white">{value}</h3>
    <p className="text-gray-600 mt-2 dark:text-gray-300">{title}</p>
  </div>
);

export { StatCard };