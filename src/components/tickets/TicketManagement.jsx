import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Ticket, Search } from 'lucide-react';
import { TicketList } from './TicketList';
import { TicketForm } from './TicketForm';
import { getTickets, saveTickets, getCurrentUser } from '../../utils/storage';
import DarkModeToggle from '../common/DarkModeToggle';
import Logo from '../common/Logo';

const TicketManagementApp = ({
	setCurrentPage,
	currentUser,
	handleLogout,
	showToast,
}) => {
	const [tickets, setTickets] = useState([]);
	const [filteredTickets, setFilteredTickets] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingTicket, setEditingTicket] = useState(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		status: 'open',
		priority: 'medium',
	});
	const [errors, setErrors] = useState({});
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const allTickets = getTickets();
		setTickets(allTickets);
		setFilteredTickets(allTickets);
	}, []);

	useEffect(() => {
		const filtered = tickets.filter(
			(ticket) =>
				ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(ticket.description &&
					ticket.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()))
		);
		setFilteredTickets(filtered);
	}, [searchTerm, tickets]);

	const validate = (data) => {
		const newErrors = {};
		if (!data.title) newErrors.title = 'Title is required';
		if (!data.status) newErrors.status = 'Status is required';
		if (!['open', 'in_progress', 'closed'].includes(data.status)) {
			newErrors.status = 'Status must be open, in_progress, or closed';
		}
		return newErrors;
	};

	const handleSubmit = (formPayload) => {
		const validationErrors = validate(formPayload);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			showToast('Please fix the validation errors', 'error');
			return;
		}

		const user = getCurrentUser();
		if (!user) {
			showToast('User not found. Please login again.', 'error');
			handleLogout();
			return;
		}

		const allTickets = getTickets();

		if (editingTicket) {
			const index = allTickets.findIndex(
				(t) => t.id === editingTicket.id
			);
			if (index !== -1) {
				allTickets[index] = {
					...formPayload,
					id: editingTicket.id,
					userId: user.id,
					createdAt: editingTicket.createdAt,
					updatedAt: new Date().toISOString(),
				};
				saveTickets(allTickets);
				setTickets(allTickets);
				setFilteredTickets(allTickets);
				showToast('✅ Ticket updated successfully!', 'success');
				console.log('✅ Ticket updated:', allTickets[index]);
			}
		} else {
			const newTicket = {
				...formPayload,
				id: Date.now(),
				userId: user.id,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			allTickets.push(newTicket);
			saveTickets(allTickets);
			setTickets(allTickets);
			setFilteredTickets(allTickets);
			showToast('✅ Ticket created successfully!', 'success');
			console.log('✅ Ticket created:', newTicket);
		}

		resetForm();
	};

	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			status: 'open',
			priority: 'medium',
		});
		setEditingTicket(null);
		setShowForm(false);
		setErrors({});
	};

	const startEdit = (ticket) => {
		setFormData(ticket);
		setEditingTicket(ticket);
		setShowForm(true);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
			{/* ======= NAVBAR ======= */}
			<nav className='bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
				<div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<Logo />
						<div className='flex items-center gap-4'>
							<DarkModeToggle />

							{/* Dashboard Button (Desktop) */}
							<button
								onClick={() => setCurrentPage('dashboard')}
								className='hidden md:inline-flex items-center text-gray-600 hover:text-gray-800 font-medium dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md'>
								Dashboard
							</button>

							{/* Dashboard Icon (Mobile) */}
							<button
								onClick={() => setCurrentPage('dashboard')}
								className='inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
								aria-label='Dashboard'>
								<Ticket className='w-5 h-5' />
							</button>

							{/* Logout */}
							<button
								onClick={handleLogout}
								className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all'>
								<LogOut className='w-4 h-4' />
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* ======= MAIN CONTENT ======= */}
			<div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
					<div>
						<h2 className='text-3xl font-bold text-gray-800 mb-2 dark:text-white'>
							Ticket Management
						</h2>
						<p className='text-gray-600 dark:text-gray-300'>
							Create, view, edit, and delete tickets
						</p>
					</div>

					<div className='flex gap-2 w-full md:w-auto'>
						{/* Search Box */}
						<div className='relative flex-1 md:w-64'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Search className='h-4 w-4 text-gray-400' />
							</div>
							<input
								type='text'
								placeholder='Search tickets...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>

						{/* New Ticket Button */}
						<button
							onClick={() => setShowForm(true)}
							className='bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap'>
							<Plus className='w-5 h-5' />
							<span className='hidden sm:inline'>New Ticket</span>
							<span className='sm:hidden'>New</span>
						</button>
					</div>
				</div>

				{/* Ticket Form */}
				{showForm && (
					<TicketForm
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						editingTicket={editingTicket}
						onSubmit={handleSubmit}
						resetForm={resetForm}
					/>
				)}

				{/* Ticket List */}
				<TicketList
					tickets={filteredTickets}
					startEdit={startEdit}
					setTickets={setTickets}
					showToast={showToast}
				/>
			</div>

			{/* ======= FOOTER ======= */}
			<footer className='bg-gray-900 text-white py-12 mt-20'>
				<div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<p className='text-gray-400'>
						© 2025 TicketFlow. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
};

export { TicketManagementApp };

