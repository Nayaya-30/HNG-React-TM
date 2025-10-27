import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-bold mb-2">TicketFlow</h3>
          <p className="text-gray-400">© 2025 TicketFlow. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Twitter className="w-5 h-5 text-white" />
          </a>
          <a href="#" aria-label="GitHub" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Github className="w-5 h-5 text-white" />
          </a>
          <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Linkedin className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };