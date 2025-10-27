import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { TicketManagementPage } from './components/tickets/TicketManagement';
import { ThemeProvider } from './context/ThemeContext';
import { Footer } from './components/common/Footer';
import Toast from './components/common/Toast';
import { getSession, getCurrentUser } from './utils/auth';
import OfflinePopUp from './components/common/IsOffline'
import { useNetworkStatus } from './hooks/useNetworkStatus'


const ProtectedRoute = ({ children }) => {
	const session = getSession();
	const user = getCurrentUser();
	if (!session || !user) {
		return <Navigate to="/login" replace />;
	}
	return children;
};

function App() {
	const [toast, setToast] = useState(null);
	const [currentUser, setCurrentUserState] = useState(null);

	const inOnline = useNetworkStatus();


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

		const user = getCurrentUser();
		if (user) setCurrentUserState(user);
	}, []);

	const showToast = (message, type = 'success') => setToast({ message, type });

	const handleLogout = () => {
		localStorage.removeItem('ticketapp_session');
		localStorage.removeItem('currentUser');
		showToast('Logged out successfully', 'success');
	};

	return (
		<ThemeProvider>
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route
						path="/login"
						element={<LoginPage showToast={showToast} setCurrentUserState={setCurrentUserState} />}
					/>
					<Route path="/signup" element={<SignupPage showToast={showToast} />} />

					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard
									currentUser={currentUser}
									handleLogout={handleLogout}
								/>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/tickets"
						element={
							<ProtectedRoute>
								<TicketManagementPage
									currentUser={currentUser}
									handleLogout={handleLogout}
									showToast={showToast}
								/>
							</ProtectedRoute>
						}
					/>

					<Route path="*" element={<Navigate to="/" />} />
				</Routes>

				<Footer />
				{toast && (
					<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
				)}
			</Router>
			<OfflinePopUp isOnline={isOnline} />
		</ThemeProvider>
	);
}

export default App;