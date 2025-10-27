import React from 'react';
import { Ticket } from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-blue-600 p-2 rounded-lg">
      <Ticket className="text-white" size={24} />
    </div>
    <span className="text-xl font-bold text-gray-800 dark:text-white">TicketFlow</span>
  </div>
);

export default Logo;