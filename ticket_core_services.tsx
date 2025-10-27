// ==================== TYPES ====================
export interface TicketType {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  token: string;
}

// ==================== AUTHENTICATION SERVICE ====================
export const AuthService = {
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

// ==================== TICKET SERVICE ====================
export const TicketService = {
  getAll: (): TicketType[] => {
    const data = localStorage.getItem('tickets');
    return data ? JSON.parse(data) : [];
  },
  
  save: (tickets: TicketType[]) => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  },
  
  create: (ticket: Omit<TicketType, 'id' | 'createdAt'>): TicketType => {
    const tickets = TicketService.getAll();
    const newTicket = { 
      ...ticket, 
      id: 'ticket_' + Date.now(), 
      createdAt: new Date().toISOString() 
    };
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

// ==================== VALIDATION UTILITIES ====================
export const ValidationUtils = {
  validateEmail: (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
    return null;
  },
  
  validatePassword: (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  },
  
  validateTicketTitle: (title: string): string | null => {
    if (!title.trim()) return 'Title is required';
    return null;
  },
  
  validateTicketStatus: (status: string): string | null => {
    if (!['open', 'in_progress', 'closed'].includes(status)) {
      return 'Invalid status';
    }
    return null;
  }
};

// ==================== UI COMPONENTS ====================
import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

export const Card3D = ({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string 
}) => {
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
    <div 
      ref={cardRef} 
      className={`transform-gpu transition-transform duration-300 ${className}`} 
      style={{ transform }} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => setTransform('')}
    >
      {children}
    </div>
  );
};

export const MagneticButton = ({ 
  children, 
  className = "", 
  onClick, 
  type = "button" 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void; 
  type?: "button" | "submit" 
}) => {
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
    <button 
      ref={buttonRef} 
      type={type} 
      className={className} 
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`, 
        transition: 'transform 0.3s ease-out' 
      }} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => setPosition({ x: 0, y: 0 })} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Toast = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
        type === 'success' 
          ? 'bg-green-500/90 border-green-400' 
          : 'bg-red-500/90 border-red-400'
      }`}
    >
      {type === 'success' ? (
        <Check className="w-6 h-6 text-white" />
      ) : (
        <X className="w-6 h-6 text-white" />
      )}
      <span className="text-white font-semibold">{message}</span>
    </div>
  );
};

// ==================== STATUS CONFIGURATION ====================
export const STATUS_COLORS = {
  open: { 
    bg: 'bg-green-500/20', 
    border: 'border-green-500/30', 
    text: 'text-green-400' 
  },
  in_progress: { 
    bg: 'bg-amber-500/20', 
    border: 'border-amber-500/30', 
    text: 'text-amber-400' 
  },
  closed: { 
    bg: 'bg-slate-500/20', 
    border: 'border-slate-500/30', 
    text: 'text-slate-400' 
  }
};

export const PRIORITY_COLORS = {
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400'
};

// ==================== CONSTANTS ====================
export const DEMO_CREDENTIALS = {
  email: 'demo@ticketapp.com',
  password: 'demo123'
};

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];