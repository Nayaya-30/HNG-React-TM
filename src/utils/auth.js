// Utility Functions for Authentication
const getSession = () => localStorage.getItem('ticketapp_session');
const setSession = (token) => localStorage.setItem('ticketapp_session', token);
const clearSession = () => localStorage.removeItem('ticketapp_session');

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Set current user
const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export { getSession, setSession, clearSession, getCurrentUser, setCurrentUser };