import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUser, registerUser } from '../../utils/auth';

export const SignupPage = ({ showToast }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({
		label: '',
		color: '',
		level: 0,
	});

	// --- Password Strength Checker ---
	const evaluatePasswordStrength = (password) => {
		let score = 0;
		if (password.length >= 6) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		switch (score) {
			case 0:
			case 1:
				return { label: 'Weak', color: 'bg-red-500', level: 25 };
			case 2:
				return { label: 'Medium', color: 'bg-yellow-500', level: 50 };
			case 3:
				return { label: 'Strong', color: 'bg-green-500', level: 75 };
			case 4:
				return {
					label: 'Very Strong',
					color: 'bg-emerald-600',
					level: 100,
				};
			default:
				return { label: '', color: '', level: 0 };
		}
	};

	// --- Validation ---
	const validateField = (name, value) => {
		let message = '';

		if (name === 'name' && !value.trim()) message = 'Name is required';
		if (name === 'email') {
			if (!value.trim()) message = 'Email is required';
			else if (!/\S+@\S+\.\S+/.test(value))
				message = 'Enter a valid email';
			else if (findUser(value)) message = 'Email is already registered';
		}
		if (name === 'password') {
			if (!value) message = 'Password is required';
			else if (value.length < 6)
				message = 'Password must be at least 6 characters';
		}
		if (name === 'confirmPassword') {
			if (!value) message = 'Please confirm your password';
			else if (value !== formData.password)
				message = 'Passwords do not match';
		}
		return message;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Clear the error as user types
		setErrors((prev) => ({ ...prev, [name]: '' }));

		if (name === 'password') {
			setPasswordStrength(evaluatePasswordStrength(value));
		}
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		const errorMsg = validateField(name, value);
		setErrors((prev) => ({ ...prev, [name]: errorMsg }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};
		Object.keys(formData).forEach((key) => {
			const msg = validateField(key, formData[key]);
			if (msg) newErrors[key] = msg;
		});

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		setIsSubmitting(true);
		setTimeout(() => {
			const newUser = {
				id: Date.now(),
				name: formData.name,
				email: formData.email,
				password: formData.password,
				createdAt: new Date().toISOString(),
			};
			registerUser(newUser);
			showToast(
				'🎉 Account created successfully! Please log in.',
				'success'
			);
			navigate('/login');
			setIsSubmitting(false);
		}, 600);
	};

	return (
		<div className='page flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4'>
			<form
				onSubmit={handleSubmit}
				className='bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md animate-bounce-in'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white'>
					Create Account
				</h2>

				{/* Name */}
				<div className='mb-4'>
					<label className='block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1'>
						Full Name
					</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						onBlur={handleBlur}
						className='w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
					/>
					{errors.name && (
						<p className='text-red-500 text-sm'>{errors.name}</p>
					)}
				</div>

				{/* Email */}
				<div className='mb-4'>
					<label className='block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1'>
						Email
					</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						onBlur={handleBlur}
						className='w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
					/>
					{errors.email && (
						<p className='text-red-500 text-sm'>{errors.email}</p>
					)}
				</div>

				{/* Password */}
				<div className='mb-4'>
					<label className='block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1'>
						Password
					</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						onBlur={handleBlur}
						className='w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
					/>
					{passwordStrength.label && (
						<div className='mt-2'>
							<div className='w-full h-2 bg-gray-200 rounded-md overflow-hidden'>
								<div
									className={`h-2 ${passwordStrength.color}`}
									style={{
										width: `${passwordStrength.level}%`,
									}}></div>
							</div>
							<p
								className={`text-sm mt-1 font-medium ${
									passwordStrength.color.includes('red')
										? 'text-red-500'
										: passwordStrength.color.includes(
												'yellow'
										  )
										? 'text-yellow-500'
										: 'text-green-500'
								}`}>
								{passwordStrength.label}
							</p>
						</div>
					)}
					{errors.password && (
						<p className='text-red-500 text-sm'>
							{errors.password}
						</p>
					)}
				</div>

				{/* Confirm Password */}
				<div className='mb-6'>
					<label className='block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1'>
						Confirm Password
					</label>
					<input
						type='password'
						name='confirmPassword'
						value={formData.confirmPassword}
						onChange={handleChange}
						onBlur={handleBlur}
						className='w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
					/>
					{errors.confirmPassword && (
						<p className='text-red-500 text-sm'>
							{errors.confirmPassword}
						</p>
					)}
				</div>

				{/* Buttons */}
				<div className='w-full flex flex-col sm:flex-row gap-3'>
					<button
						type='submit'
						disabled={isSubmitting}
						className='w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-transform transform active:scale-95'>
						{isSubmitting ? 'Creating...' : 'Sign Up'}
					</button>
				</div>

				<p className='text-sm text-center mt-4 text-gray-600 dark:text-gray-300'>
					Already have an account?{' '}
					<span
						onClick={() => navigate('/login')}
						className='text-indigo-600 hover:underline cursor-pointer'>
						Log in
					</span>
				</p>

				<div className='text-center mt-4'>
					<button
						onClick={() => navigate('/')}
						className='text-indigo-600 hover:text-indigo-800 font-semibold transition btn-bounce'>
						← Back to Home
					</button>
				</div>
			</form>
		</div>
	);
};
