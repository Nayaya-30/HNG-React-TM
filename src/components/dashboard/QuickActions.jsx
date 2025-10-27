import React from 'react';
import { Ticket, Plus, BarChart3, Eye } from 'lucide-react';

const QuickActions = ({ setCurrentPage }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800">
    <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Quick Actions</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button
        onClick={() => setCurrentPage('tickets')}
        className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-gray-800 dark:text-white">Manage Tickets</span>
      </button>
      
      <button
        onClick={() => setCurrentPage('tickets')}
        className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-all group dark:bg-green-900/30 dark:hover:bg-green-900/50"
      >
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-gray-800 dark:text-white">Create Ticket</span>
      </button>
      
      <button
        className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all group dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
      >
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-gray-800 dark:text-white">View Reports</span>
      </button>
      
      <button
        className="flex flex-col items-center justify-center p-6 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-all group dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50"
      >
        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-gray-800 dark:text-white">View Analytics</span>
      </button>
    </div>
  </div>
);

export { QuickActions };