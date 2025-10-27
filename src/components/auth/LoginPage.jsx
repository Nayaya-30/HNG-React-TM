import React, { useState } from 'react';
import { User, Check, AlertCircle } from 'lucide-react';
import { setSession, setCurrentUser } from '../../utils/auth';
import PasswordInput from '../../components/common/PasswordInput';

const LoginPage = ({ setCurrentPage, setIsAuthenticated, setCurrentUserState, showToast }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loginProgress, setLoginProgress] = useState(0);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleBlur = (field) => {
    if (!field) {
      setTouched({ ...touched, [field]: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginProgress(0);
    
    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      showToast('Please fix the validation errors', 'error');
      return;
    }

    // Clear previous errors
    setErrors({});

    // Simulate login process with progress - ALWAYS SUCCESS
    setLoginProgress(33);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoginProgress(66);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoginProgress(100);
    console.log('✅ LOGIN SUCCESS!');
    
    // Create or get user
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === formData.email);
    
    if (!user) {
      // Creating a user if doesn't exist
      user = {
        id: Date.now(),
        name: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    const token = 'token_' + Date.now() + '_' + Math.random();
    setSession(token);
    setCurrentUser(user);
    
    showToast(`Welcome back, ${user.name}!`, 'success');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setCurrentUserState(user);
    setCurrentPage('dashboard');
    
    setIsLoading(false);
    setLoginProgress(0);
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return '';
    if (errors[field]) return 'error';
    if (formData[field]) return 'success';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden dark:bg-gray-800">
        {/* Progress bar during login */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${loginProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/30">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-300">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              {getFieldStatus('email') === 'error' && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500 dark:text-red-400" />
              )}
            </div>
            {touched.email && errors.email && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
            {touched.email && !errors.email && formData.email && (
              <div className="flex items-center gap-2 mt-2 text-green-500 text-sm animate-slide-in">
                <Check className="w-4 h-4" />
                <span>Email looks good</span>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Password</label>
            <div className="relative">
              <PasswordInput
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                  getFieldStatus('password') === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700' :
                  getFieldStatus('password') === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
                  'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {getFieldStatus('password') === 'success' && (
                <Check className="absolute right-3 top-3 w-5 h-5 text-green-500 dark:text-green-400" />
              )}
              {getFieldStatus('password') === 'error' && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500 dark:text-red-400" />
              )}
            </div>
            {touched.password && errors.password && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-slide-in">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-[1.02]'}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {loginProgress < 50 ? 'Verifying credentials...' : 
                 loginProgress < 100 ? 'Logging you in...' : 'Success!'}
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                Login to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <button 
              onClick={() => setCurrentPage('signup')} 
              className="text-blue-600 font-semibold hover:underline dark:text-blue-400"
              disabled={isLoading}
            >
              Sign up here
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

export { LoginPage };