import React from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import {
	useFormValidation,
	required,
	minLength,
} from '../../hooks/useFormValidation';

const validationRules = {
	title: [required, minLength(3)],
	status: [required],
};

const TicketForm = ({
	formData,
	setFormData,
	editingTicket,
	onSubmit,
	resetForm,
}) => {
	const {
		errors,
		touched,
		validate,
		handleBlur,
		clearErrors,
		getFieldStatus,
	} = useFormValidation(validationRules);

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validate(formData);
		if (Object.values(validationErrors).some((error) => error)) {
			return;
		}
		onSubmit(formData);
	};

	const handleFieldChange = (field, value) => {
		const updated = { ...formData, [field]: value };
		setFormData(updated);
		if (touched[field]) {
			validate(updated, field);
		}
	};
	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 dark:bg-gray-800'>
				<div className='flex justify-between items-center mb-6'>
					<h3 className='text-2xl font-bold text-gray-800 dark:text-white'>
						{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
					</h3>
					<button
						onClick={resetForm}
						className='text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100'>
						<X className='w-6 h-6' />
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>
							Title <span className='text-red-500'>*</span>
						</label>
						<div className='relative'>
							<input
								type='text'
								value={formData.title}
								onChange={(e) =>
									handleFieldChange('title', e.target.value)
								}
								onBlur={() => handleBlur('title')}
								className={`w-full px-4 py-3 rounded-xl border ${
									getFieldStatus('title') === 'error'
										? 'border-red-500 bg-red-50 dark:bg-red-900/20'
										: getFieldStatus('title') === 'success'
										? 'border-green-500 bg-green-50 dark:bg-green-900/20'
										: 'border-gray-300 dark:border-gray-600'
								} focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10`}
								placeholder='Enter ticket title'
							/>
							{getFieldStatus('title') === 'success' && (
								<Check className='absolute right-3 top-3 w-5 h-5 text-green-500' />
							)}
							{getFieldStatus('title') === 'error' && (
								<AlertCircle className='absolute right-3 top-3 w-5 h-5 text-red-500' />
							)}
						</div>
						{touched.title && errors.title && (
							<div className='flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in'>
								<AlertCircle className='w-4 h-4' />
								<span>{errors.title}</span>
							</div>
						)}
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							rows={4}
							className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'
							placeholder='Describe the issue...'
						/>
					</div>

					<div className='grid md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>
								Status <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									value={formData.status}
									onChange={(e) =>
										handleFieldChange(
											'status',
											e.target.value
										)
									}
									onBlur={() => handleBlur('status')}
									className={`w-full px-4 py-3 rounded-xl border ${
										getFieldStatus('status') === 'error'
											? 'border-red-500 bg-red-50 dark:bg-red-900/20'
											: getFieldStatus('status') ===
											  'success'
											? 'border-green-500 bg-green-50 dark:bg-green-900/20'
											: 'border-gray-300 dark:border-gray-600'
									} focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white pr-10`}>
									<option value=''>Select Status</option>
									<option value='open'>Open</option>
									<option value='in_progress'>
										In Progress
									</option>
									<option value='closed'>Closed</option>
								</select>
								{getFieldStatus('status') === 'success' && (
									<Check className='absolute right-3 top-3 w-5 h-5 text-green-500' />
								)}
								{getFieldStatus('status') === 'error' && (
									<AlertCircle className='absolute right-3 top-3 w-5 h-5 text-red-500' />
								)}
							</div>
							{touched.status && errors.status && (
								<div className='flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in'>
									<AlertCircle className='w-4 h-4' />
									<span>{errors.status}</span>
								</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) =>
									setFormData({
										...formData,
										priority: e.target.value,
									})
								}
								className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<option value='low'>Low</option>
								<option value='medium'>Medium</option>
								<option value='high'>High</option>
							</select>
						</div>
					</div>

					<div className='flex gap-4'>
						<button
							type='submit'
							className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all'>
							{editingTicket ? 'Update Ticket' : 'Create Ticket'}
						</button>
						<button
							type='button'
							onClick={resetForm}
							className='flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export { TicketForm };

