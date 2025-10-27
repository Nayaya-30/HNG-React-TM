  // Signup Component with Visual Activity Tracking
  const SignupPage = () => {
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
      setErrors({});

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        showToast('Please fix the errors in the form', 'error');
        return;
      }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Progress bar during signup */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${signupProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join TicketFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    getFieldStatus('name') === 'error' ? 'border-red-500 bg-red-50' :
                    getFieldStatus('name') === 'success' ? 'border-green-500 bg-green-50' :
                    'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {getFieldStatus('name') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    getFieldStatus('email') === 'error' ? 'border-red-500 bg-red-50' :
                    getFieldStatus('email') === 'success' ? 'border-green-500 bg-green-50' :
                    'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {getFieldStatus('email') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-red-500' :
                          passwordStrength.score <= 4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    getFieldStatus('confirmPassword') === 'error' ? 'border-red-500 bg-red-50' :
                    getFieldStatus('confirmPassword') === 'success' ? 'border-green-500 bg-green-50' :
                    'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {getFieldStatus('confirmPassword') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
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
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setCurrentPage('login')} 
                className="text-blue-600 font-semibold hover:underline"
                disabled={isLoading}
              >
                Login here
              </button>
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  };import React, { useState, useEffect } from 'react';
import { User, LogOut, Plus, Edit2, Trash2, X, Check, AlertCircle, Ticket, Home, BarChart3, Menu, Eye } from 'lucide-react';

// Utility Functions
const getSession = () => localStorage.getItem('ticketapp_session');
const setSession = (token) => localStorage.setItem('ticketapp_session', token);
const clearSession = () => localStorage.removeItem('ticketapp_session');

const getTickets = () => {
  const tickets = localStorage.getItem('tickets');
  return tickets ? JSON.parse(tickets) : [];
};

const saveTickets = (tickets) => {
  localStorage.setItem('tickets', JSON.stringify(tickets));
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in z-50 max-w-md`}>
      {type === 'success' && <Check className="w-5 h-5" />}
      {type === 'error' && <AlertCircle className="w-5 h-5" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main App Component
const TicketManagementApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState(null);
  const [tickets, setTicketsState] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Create a test account if no users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const testUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([testUser]));
      console.log('✅ Created test account: test@example.com / test123');
    }
    
    // Check for existing session on mount
    const session = getSession();
    const storedUser = localStorage.getItem('currentUser');
    
    if (session && storedUser) {
      console.log('✅ Found existing session, auto-logging in...');
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
      setTicketsState(getTickets());
      setCurrentPage('dashboard');
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    clearSession();
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('landing');
    showToast('Logged out successfully', 'success');
  };

  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        setCurrentPage('login');
      }
    }, []);

    if (!isAuthenticated) {
      return null;
    }
    return children;
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section with Wave */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Manage Your Tickets with <span className="text-yellow-300">Ease</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Streamline your support workflow with our powerful ticket management system. Track, prioritize, and resolve tickets efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setCurrentPage('signup')}
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-96 h-96 bg-white/10 backdrop-blur-sm rounded-full absolute -top-20 -right-20"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Ticket className="w-full h-full text-white opacity-20" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Circle */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-400 rounded-full opacity-20"></div>
        
        {/* Wave SVG */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F0F4FF"/>
        </svg>
      </div>

      {/* Features Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose TicketFlow?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Easy to Use', desc: 'Intuitive interface designed for speed and efficiency', icon: '🚀' },
            { title: 'Real-time Updates', desc: 'Track ticket status changes instantly', icon: '⚡' },
            { title: 'Secure & Reliable', desc: 'Your data is protected with industry-standard security', icon: '🔒' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Decorative Circle */}
        <div className="absolute right-0 top-1/2 w-48 h-48 bg-indigo-200 rounded-full opacity-30 -z-10"></div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">TicketFlow</h3>
            <p className="text-gray-400">© 2025 TicketFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  // Login Component with Visual Activity Tracking
  const LoginPage = () => {
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
      setTouched({ ...touched, [field]: true });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setLoginProgress(0);
      setErrors({});
      
      console.log('=== QUICK LOGIN ===');
      
      // Quick validation
      if (!formData.email || !formData.password) {
        setErrors({
          email: !formData.email ? 'Email is required' : '',
          password: !formData.password ? 'Password is required' : ''
        });
        setIsLoading(false);
        showToast('Please fill in all fields', 'error');
        return;
      }

      // Simulate login process with progress - ALWAYS SUCCESS
      setLoginProgress(33);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setLoginProgress(66);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setLoginProgress(100);
      console.log('✅ LOGIN SUCCESS!');
      
      // Create or get user
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let user = users.find(u => u.email === formData.email);
      
      if (!user) {
        // Create user on the fly if doesn't exist
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
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      showToast(`Welcome, ${user.name}!`, 'success');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsAuthenticated(true);
      setCurrentUser(user);
      setTicketsState(getTickets());
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Progress bar during login */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${loginProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    getFieldStatus('email') === 'error' ? 'border-red-500 bg-red-50' :
                    getFieldStatus('email') === 'success' ? 'border-green-500 bg-green-50' :
                    'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {getFieldStatus('email') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
                {getFieldStatus('email') === 'error' && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border ${
                    getFieldStatus('password') === 'error' ? 'border-red-500 bg-red-50' :
                    getFieldStatus('password') === 'success' ? 'border-green-500 bg-green-50' :
                    'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {getFieldStatus('password') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
                {getFieldStatus('password') === 'error' && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
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
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => setCurrentPage('signup')} 
                className="text-blue-600 font-semibold hover:underline"
                disabled={isLoading}
              >
                Sign up here
              </button>
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Signup Component
  const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

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

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});

      console.log('Signup attempt:', formData);

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        showToast('Please fix the errors in the form', 'error');
        return;
      }

      // Simulate signup process with slight delay
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Existing users:', users);
        
        // Check if email already exists
        if (users.find(u => u.email === formData.email)) {
          showToast('An account with this email already exists. Please login instead.', 'error');
          setErrors({ email: 'This email is already registered' });
          setIsLoading(false);
          return;
        }

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
        console.log('User created:', newUser);
        console.log('All users now:', users);
        
        showToast(`Account created successfully! Welcome, ${formData.name}!`, 'success');
        
        // Auto login after signup
        setTimeout(() => {
          const token = 'token_' + Date.now() + '_' + Math.random();
          setSession(token);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          setIsAuthenticated(true);
          setTicketsState(getTickets());
          
          // Force navigation
          setTimeout(() => {
            setCurrentPage('dashboard');
          }, 100);
        }, 1000);
        
        setIsLoading(false);
      }, 500);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join TicketFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="John Doe"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          passwordStrength.score <= 2 ? 'bg-red-500' :
                          passwordStrength.score <= 4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-green-500 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setCurrentPage('login')} className="text-blue-600 font-semibold hover:underline">
                Login here
              </button>
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('landing')}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-800">TicketFlow</h1>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentPage('tickets')}
                    className="hidden md:block text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Manage Tickets
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
              <p className="text-gray-600">Overview of your ticket management</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 font-semibold">Open</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800">{openTickets}</h3>
                <p className="text-gray-600 mt-2">Open Tickets</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-yellow-600 font-semibold">In Progress</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800">{inProgressTickets}</h3>
                <p className="text-gray-600 mt-2">In Progress</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-gray-600 font-semibold">Closed</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800">{closedTickets}</h3>
                <p className="text-gray-600 mt-2">Resolved Tickets</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <button
                onClick={() => setCurrentPage('tickets')}
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                Go to Ticket Management
              </button>
            </div>
          </div>

          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400">© 2025 TicketFlow. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </ProtectedRoute>
    );
  };

  // Ticket Management Component
  const TicketManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium'
    });
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const validate = () => {
      const newErrors = {};
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.status) newErrors.status = 'Status is required';
      if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
        newErrors.status = 'Status must be open, in_progress, or closed';
      }
      return newErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast('Please fix the validation errors', 'error');
        return;
      }

      const allTickets = getTickets();
      
      if (editingTicket) {
        // UPDATE existing ticket
        const index = allTickets.findIndex(t => t.id === editingTicket.id);
        if (index !== -1) {
          allTickets[index] = { 
            ...formData, 
            id: editingTicket.id, 
            createdAt: editingTicket.createdAt,
            updatedAt: new Date().toISOString()
          };
          saveTickets(allTickets);
          setTicketsState(allTickets);
          showToast('✅ Ticket updated successfully!', 'success');
          console.log('✅ Ticket updated:', allTickets[index]);
        }
      } else {
        // CREATE new ticket
        const newTicket = { 
          ...formData, 
          id: Date.now(), 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        allTickets.push(newTicket);
        saveTickets(allTickets);
        setTicketsState(allTickets);
        showToast('✅ Ticket created successfully!', 'success');
        console.log('✅ Ticket created:', newTicket);
      }
      
      resetForm();
    };

    const handleDelete = (id) => {
      const allTickets = getTickets().filter(t => t.id !== id);
      saveTickets(allTickets);
      setTicketsState(allTickets);
      setDeleteConfirm(null);
      showToast('🗑️ Ticket deleted successfully!', 'success');
      console.log('🗑️ Ticket deleted, remaining:', allTickets.length);
    };

    const resetForm = () => {
      setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
      setEditingTicket(null);
      setShowForm(false);
      setErrors({});
    };

    const startEdit = (ticket) => {
      setFormData(ticket);
      setEditingTicket(ticket);
      setShowForm(true);
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'open': return 'bg-green-100 text-green-700 border-green-200';
        case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-800">TicketFlow</h1>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="hidden md:block text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ticket Management</h2>
                <p className="text-gray-600">Create, view, edit, and delete tickets</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Ticket
              </button>
            </div>

            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                    </h3>
                    <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter ticket title"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the issue..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                      >
                        {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tickets Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No tickets yet</h3>
                  <p className="text-gray-600 mb-6">Create your first ticket to get started</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Ticket
                  </button>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">{ticket.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {ticket.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(ticket)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(ticket.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Ticket?</h3>
                    <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete this ticket?</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDelete(deleteConfirm)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400">© 2025 TicketFlow. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </ProtectedRoute>
    );
  };

  // Render Current Page
  const renderPage = () => {
    console.log('Rendering page:', currentPage, 'Authenticated:', isAuthenticated);
    
    switch(currentPage) {
      case 'landing': return <LandingPage />;
      case 'login': return <LoginPage />;
      case 'signup': return <SignupPage />;
      case 'dashboard': 
        if (!isAuthenticated) {
          console.log('Not authenticated, showing login instead of dashboard');
          return <LoginPage />;
        }
        return <Dashboard />;
      case 'tickets': 
        if (!isAuthenticated) {
          console.log('Not authenticated, showing login instead of tickets');
          return <LoginPage />;
        }
        return <TicketManagement />;
      default: return <LandingPage />;
    }
  };

  return (
    <>
      {renderPage()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
    </>
  );
};

export default TicketManagementApp;