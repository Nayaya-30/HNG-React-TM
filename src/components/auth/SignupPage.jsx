import React, { useState } from 'react';
import { User, Check, AlertCircle } from 'lucide-react';
import { setSession, setCurrentUser } from '../../utils/auth';
import PasswordInput from '../../components/common/PasswordInput';

const SignupPage = ({ setCurrentPage, showToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [signupProgress, setSignupProgress] = useState(0);

  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, text: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { score, text: 'Medium', color: 'text-yellow-500' };
    return { score, text: 'Strong', color: 'text-green-500' };
  };

  const handlePasswordChange = (password) => {
    setFormData({...formData, password});
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignupProgress(0);
    
    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    // Clear previous errors
    setErrors({});

    // Simulate signup process with progress
    setSignupProgress(20);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSignupProgress(40);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === formData.email)) {
      showToast('An account with this email already exists. Please login instead.', 'error');
      setErrors({ email: 'This email is already registered' });
      setIsLoading(false);
      setSignupProgress(0);
      return;
    }

    setSignupProgress(60);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create new user
    const newUser = { 
      id: Date.now(),
      name: formData.name, 
      email: formData.email, 
      password: formData.password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setSignupProgress(80);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSignupProgress(100);
    showToast(`Account created successfully! Welcome, ${formData.name}! Redirecting to login...`, 'success');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to login page (NOT auto-login)
    setCurrentPage('login');
    setIsLoading(false);
    setSignupProgress(0);
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return '';
    if (errors[field]) return 'error';
    if (formData[field]) {
      if (field === 'confirmPassword' && formData.password === formData.confirmPassword) return 'success';
      if (field !== 'confirmPassword') return 'success';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden dark:bg-gray-800">
        {/* Progress bar during signup */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
              style={{ width: `${signupProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/30">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-300">Join TicketFlow today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                  getFieldStatus('name') === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' :
                  getFieldStatus('name') === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                  'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {getFieldStatus('name') === 'success' && (
                <Check className="absolute right-3 top-3 w-5 h-5 text-green-500 dark:text-green-400" />
              )}
            </div>
            {touched.name && errors.name && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                  getFieldStatus('email') === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' :
                  getFieldStatus('email') === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                  'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {getFieldStatus('email') === 'success' && (
                <Check className="absolute right-3 top-3 w-5 h-5 text-green-500 dark:text-green-400" />
              )}
            </div>
            {touched.email && errors.email && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Password</label>
            <PasswordInput
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 rounded-xl border ${
                getFieldStatus('password') === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' :
                getFieldStatus('password') === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score <= 4 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${passwordStrength.color} dark:text-white`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>
            )}
            {touched.password && errors.password && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Confirm Password</label>
            <div className="relative">
              <PasswordInput
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                  getFieldStatus('confirmPassword') === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' :
                  getFieldStatus('confirmPassword') === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                  'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {getFieldStatus('confirmPassword') === 'success' && (
                <Check className="absolute right-3 top-3 w-5 h-5 text-green-500 dark:text-green-400" />
              )}
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="flex items-center gap-2 mt-2 text-green-500 text-sm animate-slide-in">
                <Check className="w-4 h-4" />
                <span>Passwords match perfectly!</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-[1.02]'}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {signupProgress < 40 ? 'Validating...' : 
                 signupProgress < 80 ? 'Creating account...' :
                 signupProgress < 100 ? 'Finalizing...' : 'Success!'}
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button 
              onClick={() => setCurrentPage('login')} 
              className="text-blue-600 font-semibold hover:underline dark:text-blue-400"
              disabled={isLoading}
            >
              Login here
            </button>
          </p>
        </div>

        <button 
          onClick={() => setCurrentPage('landing')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium dark:text-gray-300 dark:hover:text-white"
          disabled={isLoading}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export { SignupPage };