import React, { useState, useEffect } from 'react';
import { LogOut, Ticket, BarChart3, Check, Search } from 'lucide-react';
import { StatCard } from './StatCard';
import { QuickActions } from './QuickActions';
import { getTickets } from '../../utils/storage';
import Logo from '../common/Logo';
import AnalyticsChart from './AnalyticsChart';

const Dashboard = ({ setCurrentPage, currentUser, handleLogout }) => {
	const [tickets, setTickets] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		setTickets(getTickets());
	}, []);

	const filteredTickets = tickets.filter(
		(ticket) =>
			ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(ticket.description &&
				ticket.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase()))
	);

	const openTickets = tickets.filter((t) => t.status === 'open').length;
	const inProgressTickets = tickets.filter(
		(t) => t.status === 'in_progress'
	).length;
	const closedTickets = tickets.filter((t) => t.status === 'closed').length;

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'>
			<nav className='bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
				<div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<Logo />
						<div className='flex items-center gap-4'>
							{/* icon-only on small screens, text on md+ */}
							<button
								onClick={() => setCurrentPage('tickets')}
								className='hidden md:inline-flex items-center text-gray-600 hover:text-gray-800 font-medium dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md'>
								Manage Tickets
							</button>
							<button
								onClick={() => setCurrentPage('tickets')}
								className='inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
								aria-label='Manage tickets'>
								<Ticket className='w-5 h-5' />
							</button>
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

			<div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='mb-8'>
					<h2 className='text-3xl font-bold text-gray-800 mb-2 dark:text-white'>
						Dashboard
					</h2>
					<p className='text-gray-600 dark:text-gray-300'>
						Overview of your ticket management
					</p>
				</div>

				{/* Removed redundant search bar per request */}

				<div className='grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12'>
					<StatCard
						title='Total Tickets'
						value={tickets.length}
						icon={<BarChart3 className='w-6 h-6 text-blue-600' />}
						bgColor='bg-blue-100 dark:bg-blue-900/30'
						textColor='text-blue-600'
					/>
					<StatCard
						title='Open Tickets'
						value={openTickets}
						icon={<Ticket className='w-6 h-6 text-green-600' />}
						bgColor='bg-green-100 dark:bg-green-900/30'
						textColor='text-green-600'
					/>
					<StatCard
						title='In Progress'
						value={inProgressTickets}
						icon={<BarChart3 className='w-6 h-6 text-yellow-600' />}
						bgColor='bg-yellow-100 dark:bg-yellow-900/30'
						textColor='text-yellow-600'
					/>
					<StatCard
						title='Resolved Tickets'
						value={closedTickets}
						icon={<Check className='w-6 h-6 text-gray-600' />}
						bgColor='bg-purple-100 dark:bg-purple-700/30'
						textColor='text-puple-600'
					/>
				</div>

				<QuickActions setCurrentPage={setCurrentPage} />

				{/* Analytics Section */}
				<AnalyticsChart tickets={tickets} />
			</div>

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

export { Dashboard };

