import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Plus, LogOut, Edit2, Trash2, Check, X, Home, BarChart3, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TicketType {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface User {
  email: string;
  name: string;
  token: string;
}

const AuthService = {
  login: (email: string, password: string): User | null => {
    if (email === 'demo@ticketapp.com' && password === 'demo123') {
      const user = { email, name: 'Demo User', token: 'mock_token_' + Date.now() };
      localStorage.setItem('ticketapp_session', JSON.stringify(user));
      return user;
    }
    return null;
  },
  signup: (email: string, password: string, name: string): User => {
    const user = { email, name, token: 'mock_token_' + Date.now() };
    localStorage.setItem('ticketapp_session', JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem('ticketapp_session');
    localStorage.removeItem('tickets');
  },
  getUser: (): User | null => {
    const data = localStorage.getItem('ticketapp_session');
    return data ? JSON.parse(data) : null;
  },
  isAuthenticated: (): boolean => {
    return !!AuthService.getUser();
  }
};

const TicketService = {
  getAll: (): TicketType[] => {
    const data = localStorage.getItem('tickets');
    return data ? JSON.parse(data) : [];
  },
  save: (tickets: TicketType[]) => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  },
  create: (ticket: Omit<TicketType, 'id' | 'createdAt'>): TicketType => {
    const tickets = TicketService.getAll();
    const newTicket = { ...ticket, id: 'ticket_' + Date.now(), createdAt: new Date().toISOString() };
    tickets.push(newTicket);
    TicketService.save(tickets);
    return newTicket;
  },
  update: (id: string, updates: Partial<TicketType>) => {
    const tickets = TicketService.getAll();
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates };
      TicketService.save(tickets);
    }
  },
  delete: (id: string) => {
    const tickets = TicketService.getAll().filter(t => t.id !== id);
    TicketService.save(tickets);
  }
};

const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  return (
    <div ref={cardRef} className={`transform-gpu transition-transform duration-300 ${className}`} style={{ transform }} onMouseMove={handleMouseMove} onMouseLeave={() => setTransform('')}>
      {children}
    </div>
  );
};

const MagneticButton = ({ children, className = "", onClick, type = "button" }: { children: React.ReactNode; className?: string; onClick?: () => void; type?: "button" | "submit" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  return (
    <button ref={buttonRef} type={type} className={className} style={{ transform: `translate(${position.x}px, ${position.y}px)`, transition: 'transform 0.3s ease-out' }} onMouseMove={handleMouseMove} onMouseLeave={() => setPosition({ x: 0, y: 0 })} onClick={onClick}>
      {children}
    </button>
  );
};

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${type === 'success' ? 'bg-green-500/90 border-green-400' : 'bg-red-500/90 border-red-400'}`}>
      {type === 'success' ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
      <span className="text-white font-semibold">{message}</span>
    </div>
  );
};

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 text-center z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500">
              <Ticket className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              TicketFlow
            </span>
          </h1>

          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Streamline your support operations with our powerful ticket management system. Track, prioritize, and resolve issues efficiently.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <MagneticButton onClick={() => onNavigate('login')} className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-lg font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-500">
              Login
            </MagneticButton>
            <MagneticButton onClick={() => onNavigate('signup')} className="px-10 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white text-lg font-bold transition-all duration-500">
              Get Started
            </MagneticButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" className="w-full h-auto">
            <path fill="rgba(59, 130, 246, 0.1)" d="M0,100 C320,150 640,50 960,100 C1280,150 1440,100 1440,100 L1440,200 L0,200 Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-32">
        <h2 className="text-5xl font-bold text-center text-white mb-16">Why Choose TicketFlow?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your ticket metrics in real-time', color: 'from-blue-500 to-cyan-500' },
            { icon: Users, title: 'Team Collaboration', desc: 'Work together seamlessly on tickets', color: 'from-purple-500 to-pink-500' },
            { icon: TrendingUp, title: 'Performance Insights', desc: 'Optimize your support workflow', color: 'from-amber-500 to-orange-500' }
          ].map((feature, idx) => (
            <Card3D key={idx}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            </Card3D>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>© 2025 TicketFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const AuthPage = ({ mode, onNavigate, onAuth }: { mode: 'login' | 'signup'; onNavigate: (page: string) => void; onAuth: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (mode === 'signup' && !name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'login') {
      const user = AuthService.login(email, password);
      if (user) {
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(onAuth, 1000);
      } else {
        setToast({ message: 'Invalid credentials. Try demo@ticketapp.com / demo123', type: 'error' });
      }
    } else {
      AuthService.signup(email, password, name);
      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(onAuth, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-md w-full">
        <Card3D>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div>
                  <label className="block text-white mb-2 font-medium">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all" />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-white mb-2 font-medium">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all" />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all" />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <MagneticButton type="submit" className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500">
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </MagneticButton>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => onNavigate(mode === 'login' ? 'signup' : 'login')} className="text-blue-400 hover:text-blue-300 transition-colors">
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white transition-colors">
                ← Back to Home
              </button>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate, onLogout }: { onNavigate: (page: string) => void; onLogout: () => void }) => {
  const tickets = TicketService.getAll();
  const user = AuthService.getUser();

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TicketFlow</h1>
              <p className="text-slate-400 text-sm">Welcome back, {user?.name}</p>
            </div>
          </div>
          <MagneticButton onClick={onLogout} className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </MagneticButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'from-blue-500 to-cyan-500' },
            { label: 'Open', value: stats.open, icon: AlertCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'from-slate-500 to-slate-600' }
          ].map((stat, idx) => (
            <Card3D key={idx}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            </Card3D>
          ))}
        </div>

        <Card3D>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MagneticButton onClick={() => onNavigate('tickets')} className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 flex items-center justify-center gap-3">
                <Ticket className="w-6 h-6" />
                Manage Tickets
              </MagneticButton>
              <MagneticButton onClick={() => onNavigate('landing')} className="px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:border-blue-500/30 transition-all duration-500 flex items-center justify-center gap-3">
                <Home className="w-6 h-6" />
                Back to Home
              </MagneticButton>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};

const TicketManagement = ({ onNavigate, onLogout }: { onNavigate: (page: string) => void; onLogout: () => void }) => {
  const [tickets, setTickets] = useState<TicketType[]>(TicketService.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'open' as const, priority: 'medium' as const });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!['open', 'in_progress', 'closed'].includes(formData.status)) newErrors.status = 'Invalid status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTicket) {
      TicketService.update(editingTicket.id, formData);
      setToast({ message: 'Ticket updated successfully!', type: 'success' });
    } else {
      TicketService.create(formData);
      setToast({ message: 'Ticket created successfully!', type: 'success' });
    }

    setTickets(TicketService.getAll());
    setShowForm(false);
    setEditingTicket(null);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      TicketService.delete(id);
      setTickets(TicketService.getAll());
      setToast({ message: 'Ticket deleted successfully!', type: 'success' });
    }
  };

  const handleEdit = (ticket: TicketType) => {
    setEditingTicket(ticket);
    setFormData({ title: ticket.title, description: ticket.description, status: ticket.status, priority: ticket.priority });
    setShowForm(true);
  };

  const statusColors = {
    open: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
    in_progress: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    closed: { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Ticket Management</h1>
          <div className="flex gap-4">
            <MagneticButton onClick={() => onNavigate('dashboard')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:border-blue-500/30 transition-all">
              Dashboard
            </MagneticButton>
            <MagneticButton onClick={onLogout} className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <MagneticButton onClick={() => { setShowForm(true); setEditingTicket(null); setFormData({ title: '', description: '', status: 'open', priority: 'medium' }); }} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 flex items-center gap-3">
            <Plus className="w-6 h-6" />
            Create New Ticket
          </MagneticButton>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card3D>
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-3xl font-bold text-white mb-6">{editingTicket ? 'Edit Ticket' : 'Create Ticket'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 font-medium">Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all" />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all resize-none"></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">Status *</label>
                      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all">
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Priority</label>
                      <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MagneticButton type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold hover:shadow-2xl transition-all duration-500">
                      {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                    </MagneticButton>
                    <MagneticButton type="button" onClick={() => { setShowForm(false); setEditingTicket(null); setErrors({}); }} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:border-red-500/30 transition-all duration-500">
                      Cancel
                    </MagneticButton>
                  </div>
                </form>
              </div>
            </Card3D>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Ticket className="w-20 h-20 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-xl">No tickets yet. Create your first ticket!</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Card3D key={ticket.id}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-4 py-2 ${statusColors[ticket.status].bg} border ${statusColors[ticket.status].border} rounded-xl ${statusColors[ticket.status].text} text-sm font-semibold`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(ticket)} className="w-10 h-10 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(ticket.id)} className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{ticket.title}</h3>
                  
                  {ticket.description && (
                    <p className="text-slate-400 text-sm mb-4 flex-grow">{ticket.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className={`text-xs font-semibold ${ticket.priority === 'high' ? 'text-red-400' : ticket.priority === 'medium' ? 'text-amber-400' : 'text-green-400'}`}>
                      {ticket.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card3D>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [theme, setTheme] = useState(ThemeService.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated && ['dashboard', 'tickets'].includes(currentPage)) {
        setCurrentPage('login');
      }
    };

    checkAuth();
  }, [currentPage]);

  const handleAuth = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    if (['dashboard', 'tickets'].includes(page) && !AuthService.isAuthenticated()) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    ThemeService.setTheme(newTheme);
  };

  return (
    <div className="min-h-screen">
      <style>{`
        :root[data-theme="dark"] {
          --bg-primary: #020617;
          --bg-secondary: #0f172a;
          --bg-tertiary: #1e293b;
          --bg-card: rgba(255, 255, 255, 0.05);
          --bg-card-hover: rgba(255, 255, 255, 0.1);
          --border-primary: rgba(255, 255, 255, 0.1);
          --border-secondary: rgba(255, 255, 255, 0.2);
          --text-primary: #ffffff;
          --text-secondary: #cbd5e1;
          --text-tertiary: #94a3b8;
          --shadow-color: rgba(0, 0, 0, 0.5);
        }

        :root[data-theme="light"] {
          --bg-primary: #f8fafc;
          --bg-secondary: #ffffff;
          --bg-tertiary: #f1f5f9;
          --bg-card: rgba(15, 23, 42, 0.03);
          --bg-card-hover: rgba(15, 23, 42, 0.06);
          --border-primary: rgba(15, 23, 42, 0.1);
          --border-secondary: rgba(15, 23, 42, 0.2);
          --text-primary: #0f172a;
          --text-secondary: #334155;
          --text-tertiary: #64748b;
          --shadow-color: rgba(0, 0, 0, 0.1);
        }

        body {
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .themed-bg-primary { background: var(--bg-primary); }
        .themed-bg-secondary { background: var(--bg-secondary); }
        .themed-bg-tertiary { background: var(--bg-tertiary); }
        .themed-bg-card { background: var(--bg-card); }
        .themed-bg-card:hover { background: var(--bg-card-hover); }
        .themed-border { border-color: var(--border-primary); }
        .themed-border-secondary { border-color: var(--border-secondary); }
        .themed-text { color: var(--text-primary); }
        .themed-text-secondary { color: var(--text-secondary); }
        .themed-text-tertiary { color: var(--text-tertiary); }
        .themed-shadow { box-shadow: 0 10px 30px var(--shadow-color); }

        /* Override Tailwind classes with CSS variables */
        .bg-gradient-to-br.from-slate-950 {
          background: linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary));
        }
        
        .bg-white\\/5 { background: var(--bg-card); }
        .bg-white\\/10 { background: var(--bg-card-hover); }
        .border-white\\/10 { border-color: var(--border-primary); }
        .border-white\\/20 { border-color: var(--border-secondary); }
        .text-white:not(.text-white\\/90):not(.text-white\\/80):not(.text-white\\/70):not(.text-white\\/60):not(.text-white\\/50) { 
          color: var(--text-primary); 
        }
        .text-slate-300 { color: var(--text-secondary); }
        .text-slate-400 { color: var(--text-tertiary); }
        .text-slate-500 { color: var(--text-tertiary); }
        .text-slate-600 { color: var(--text-tertiary); }

        /* Card backgrounds */
        .backdrop-blur-xl { backdrop-filter: blur(20px); }
        
        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }

        /* Preserve gradient text */
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .text-transparent { -webkit-text-fill-color: transparent; }

        /* Status colors remain unchanged for both themes */
        .text-green-400, .text-amber-400, .text-red-400, 
        .text-blue-400, .text-purple-400, .text-cyan-400,
        .bg-green-500\\/20, .bg-amber-500\\/20, .bg-red-500\\/20,
        .bg-blue-500\\/20, .bg-purple-500\\/20,
        .border-green-500\\/30, .border-amber-500\\/30, .border-red-500\\/30,
        .border-blue-500\\/30, .border-purple-500\\/30 {
          /* Keep original colors for status indicators */
        }
      `}</style>
      
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <AuthPage mode="login" onNavigate={handleNavigate} onAuth={handleAuth} />}
      {currentPage === 'signup' && <AuthPage mode="signup" onNavigate={handleNavigate} onAuth={handleAuth} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />}
      {currentPage === 'tickets' && <TicketManagement onNavigate={handleNavigate} onLogout={handleLogout} />}
    </div>
  );
} = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    if (['dashboard', 'tickets'].includes(page) && !AuthService.isAuthenticated()) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <AuthPage mode="login" onNavigate={handleNavigate} onAuth={handleAuth} />}
      {currentPage === 'signup' && <AuthPage mode="signup" onNavigate={handleNavigate} onAuth={handleAuth} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />}
      {currentPage === 'tickets' && <TicketManagement onNavigate={handleNavigate} onLogout={handleLogout} />}
    </div>
  );
}