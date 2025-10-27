// src/utils/auth.js

// --- Session Management ---
export const setCurrentUser = (user) => {
	localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
	const user = localStorage.getItem('currentUser');
	return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
	localStorage.removeItem('currentUser');
	localStorage.removeItem('token');
};

export const setSession = (token) => {
	localStorage.setItem('token', token);
};

export const getSession = () => localStorage.getItem('token');
export const isAuthenticated = () => !!getSession();

// --- Validation Helpers ---
export const validateLogin = (email, password) => {
	const errors = {};

	if (!email) {
		errors.email = 'Email is required.';
	} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		errors.email = 'Please enter a valid email address.';
	}

	if (!password) {
		errors.password = 'Password is required.';
	} else if (password.length < 6) {
		errors.password = 'Password must be at least 6 characters.';
	}

	return errors;
};

// --- Password Strength (for Signup) ---
export const checkPasswordStrength = (password) => {
	if (password.length < 6) return 'weak';
	if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
	return 'strong';
};

// --- User Management ---
export const getAllUsers = () => {
	return JSON.parse(localStorage.getItem('users') || '[]');
};

export const saveUsers = (users) => {
	localStorage.setItem('users', JSON.stringify(users));
};

export const findUser = (email) => {
	const users = getAllUsers();
	return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const registerUser = (user) => {
	const users = getAllUsers();
	const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());

	if (existing) {
		return { success: false, message: 'Email already registered.' };
	}

	users.push(user);
	saveUsers(users);
	return { success: true, user };
};

export const loginUser = (email, password) => {
	const user = findUser(email);

	if (!user) {
		return { success: false, message: 'User not found. Please sign up first.' };
	}

	if (user.password !== password) {
		return { success: false, message: 'Invalid credentials.' };
	}

	setCurrentUser(user);
	setSession('fake-jwt-token');
	return { success: true, user };
};