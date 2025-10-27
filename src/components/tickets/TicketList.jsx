import React, { useState } from 'react';
import { Ticket, Plus } from 'lucide-react';
import { TicketCard } from './TicketCard';
import { DeleteConfirmation } from './DeleteConfirmation';
import { getTickets, saveTickets } from '../../utils/storage';

const TicketList = ({ tickets, startEdit, setTickets, showToast }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (id) => {
    const allTickets = getTickets().filter(t => t.id !== id);
    saveTickets(allTickets);
    setTickets(allTickets);
    setDeleteConfirm(null);
    showToast('🗑️ Ticket deleted successfully!', 'success');
    console.log('🗑️ Ticket deleted, remaining:', allTickets.length);
  };

  return (
    <>
      {/* Tickets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">No tickets yet</h3>
            <p className="text-gray-600 mb-6 dark:text-gray-300">Create your first ticket to get started</p>
            <button
              onClick={() => document.querySelector('button.bg-blue-600').click()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Ticket
            </button>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              startEdit={startEdit} 
              setDeleteConfirm={setDeleteConfirm} 
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmation 
          deleteConfirm={deleteConfirm}
          handleDelete={handleDelete}
          setDeleteConfirm={setDeleteConfirm}
        />
      )}
    </>
  );
};

export { TicketList };