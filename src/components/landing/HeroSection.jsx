import React from 'react';
import { Ticket } from 'lucide-react';

const HeroSection = ({ setCurrentPage }) => (
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
);

export { HeroSection };