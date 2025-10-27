import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/auth';

export const LoginPage = ({ showToast, setCurrentUserState }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateField = (name, value) => {
		switch (name) {
			case 'email':
				if (!value.trim()) return 'Email is required';
				if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
				return '';
			case 'password':
				if (!value) return 'Password is required';
				if (value.length < 6) return 'Password must be at least 6 characters';
				return '';
			default:
				return '';
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: '' })); // remove error while typing
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		const error = validateField(name, value);
		if (error) setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};
		Object.keys(formData).forEach((key) => {
			const error = validateField(key, formData[key]);
			if (error) newErrors[key] = error;
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsSubmitting(true);
		setTimeout(() => {
			const { success, user, message } = loginUser(formData.email, formData.password);
			if (success) {
				setCurrentUserState(user);
				showToast('Account log in successful', 'success');
				navigate('/dashboard', { replace: true });
			} else {
				showToast(message, 'error');
			}
			setIsSubmitting(false);
		}, 400);
	};

	return (
		<div className="page flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 ">
			<form
				onSubmit={handleSubmit}
				className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md animate-bounce-in"
			>
				<h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
					Welcome Back
				</h2>

				{/* Email */}
				<div className="mb-3">
					<label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
						Email
					</label>
					<input
						type="email"
						name="email"
						className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : ''
							}`}
						value={formData.email}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
				</div>

				{/* Password */}
				<div className="mb-3">
					<label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
						Password
					</label>
					<input
						type="password"
						name="password"
						className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${errors.password ? 'border-red-500' : ''
							}`}
						value={formData.password}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
				</div>

				{/* Buttons */}
				<div className="flex  w-full flex-col sm:flex-row justify-between items-center gap-3 mt-5">
					<button
						type="submit"
						className="w-full sm:w-2/3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Logging in...' : 'Login'}
					</button>
				</div>

				<p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
					Don’t have an account?{' '}
					<span
						onClick={() => navigate('/signup')}
						className="text-indigo-600 hover:underline cursor-pointer"
					>
						Sign up
					</span>
				</p>

				<div className="text-center mt-4">
					<button
						onClick={() => navigate('/')}
						className="text-indigo-600 hover:text-indigo-800 font-semibold transition btn-bounce"
					>
						← Back to Home
					</button>
				</div>
			</form>
		</div>
	);
};