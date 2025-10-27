import React, { useState, useEffect } from 'react';
import { TicketManagementApp } from './components/tickets/TicketManagement';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Dashboard } from './components/dashboard/Dashboard';
import Footer from './components/common/Footer';
import { ThemeProvider } from './context/ThemeContext';
import Toast from './components/common/Toast';
import { getSession, getCurrentUser } from './utils/auth';

function App() {
	const [currentPage, setCurrentPage] = useState('landing');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [toast, setToast] = useState(null);
	const [currentUser, setCurrentUserState] = useState(null);

	useEffect(() => {
		// Create a test account if no users exist
		const users = JSON.parse(localStorage.getItem('users') || '[]');
		if (users.length === 0) {
			const testUser = {
				id: 1,
				name: 'Test User',
				email: 'test@example.com',
				password: 'test123',
				createdAt: new Date().toISOString(),
			};
			localStorage.setItem('users', JSON.stringify([testUser]));
			console.log('✅ Created test account: test@example.com / test123');
		}

		// Check for existing session on mount
		const session = getSession();
		const storedUser = getCurrentUser();

		if (session && storedUser) {
			console.log('✅ Found existing session, auto-logging in...');
			setIsAuthenticated(true);
			setCurrentUserState(storedUser);
			setCurrentPage('dashboard');
		}
	}, []);

	const showToast = (message, type = 'success') => {
		setToast({ message, type });
	};

	const handleLogout = () => {
		console.log('🚪 Logging out...');
		localStorage.removeItem('ticketapp_session');
		localStorage.removeItem('currentUser');
		setIsAuthenticated(false);
		setCurrentUserState(null);
		setCurrentPage('landing');
		showToast('Logged out successfully', 'success');
	};

	const renderPage = () => {
		console.log(
			'Rendering page:',
			currentPage,
			'Authenticated:',
			isAuthenticated
		);

		switch (currentPage) {
			case 'landing':
				return <LandingPage setCurrentPage={setCurrentPage} />;
			case 'login':
				return (
					<LoginPage
						setCurrentPage={setCurrentPage}
						setIsAuthenticated={setIsAuthenticated}
						setCurrentUserState={setCurrentUserState}
						showToast={showToast}
					/>
				);
			case 'signup':
				return (
					<SignupPage
						setCurrentPage={setCurrentPage}
						showToast={showToast}
					/>
				);
			case 'dashboard':
				if (!isAuthenticated) {
					console.log(
						'Not authenticated, showing login instead of dashboard'
					);
					return (
						<LoginPage
							setCurrentPage={setCurrentPage}
							setIsAuthenticated={setIsAuthenticated}
							setCurrentUserState={setCurrentUserState}
							showToast={showToast}
						/>
					);
				}
				return (
					<Dashboard
						setCurrentPage={setCurrentPage}
						currentUser={currentUser}
						handleLogout={handleLogout}
					/>
				);
			case 'tickets':
				if (!isAuthenticated) {
					console.log(
						'Not authenticated, showing login instead of tickets'
					);
					return (
						<LoginPage
							setCurrentPage={setCurrentPage}
							setIsAuthenticated={setIsAuthenticated}
							setCurrentUserState={setCurrentUserState}
							showToast={showToast}
						/>
					);
				}
				return (
					<TicketManagementApp
						setCurrentPage={setCurrentPage}
						currentUser={currentUser}
						handleLogout={handleLogout}
						showToast={showToast}
					/>
				);
			default:
				return <LandingPage setCurrentPage={setCurrentPage} />;
		}
	};

	return (
		<ThemeProvider>
			{renderPage()}
			<Footer />
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
			<style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
		</ThemeProvider>
	);
}

export default App;

