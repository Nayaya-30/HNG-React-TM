import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TicketCard = ({ ticket, startEdit, setDeleteConfirm }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case 'open':
				return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
			case 'in_progress':
				return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
			case 'closed':
				return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
			default:
				return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	return (
		<div className='relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700'>
			{/* action icons - positioned top-right */}
			<div className='absolute bottom-4 right-4 flex items-center gap-2'>
				<button
					onClick={() => startEdit(ticket)}
					aria-label='Edit ticket'
					className='p-2 rounded-full text-blue-50 bg-blue-600 hover:bg-blue-700 transition-colors'>
					<Edit2 className='w-4 h-4' />
				</button>
				<button
					onClick={() => setDeleteConfirm(ticket.id)}
					aria-label='Delete ticket'
					className='p-2 rounded-full text-red-50 bg-red-600 hover:bg-red-700 transition-colors'>
					<Trash2 className='w-4 h-4' />
				</button>
			</div>

			<div className='flex items-start gap-4 mb-4'>
				<h3 className='text-lg font-bold text-gray-800 flex-1 pr-12 dark:text-white'>
					{ticket.title}
				</h3>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
						ticket.status
					)}`}>
					{ticket.status.replace('_', ' ').toUpperCase()}
				</span>
			</div>

			{ticket.description && (
				<p className='text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-300'>
					{ticket.description}
				</p>
			)}

			<div className='flex items-center gap-2 mb-4'>
				<span
					className={`text-xs px-2 py-1 rounded ${
						ticket.priority === 'high'
							? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
							: ticket.priority === 'medium'
							? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
							: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
					}`}>
					{ticket.priority.toUpperCase()}
				</span>
				<span className='text-xs text-gray-500 dark:text-gray-400'>
					{new Date(ticket.createdAt).toLocaleDateString()}
				</span>
			</div>

			{/* actions moved to top-right icons */}
		</div>
	);
};

export { TicketCard };

