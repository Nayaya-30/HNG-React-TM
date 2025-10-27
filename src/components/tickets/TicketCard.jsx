import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TicketCard = ({ ticket, startEdit, setDeleteConfirm }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex-1 dark:text-white">{ticket.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {ticket.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-300">{ticket.description}</p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded ${
          ticket.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {ticket.priority.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => startEdit(ticket)}
          className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => setDeleteConfirm(ticket.id)}
          className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export { TicketCard };