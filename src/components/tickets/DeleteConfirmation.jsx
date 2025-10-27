import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteConfirmation = ({ deleteConfirm, handleDelete, setDeleteConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 dark:bg-gray-800">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">Delete Ticket?</h3>
        <p className="text-gray-600 mb-6 dark:text-gray-300">This action cannot be undone. Are you sure you want to delete this ticket?</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleDelete(deleteConfirm)}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export { DeleteConfirmation };