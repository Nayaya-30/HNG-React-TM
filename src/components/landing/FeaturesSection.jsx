import React from 'react';

const FeaturesSection = () => (
  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h2 className="text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white">Why Choose TicketFlow?</h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: 'Easy to Use', desc: 'Intuitive interface designed for speed and efficiency', icon: '🚀' },
        { title: 'Real-time Updates', desc: 'Track ticket status changes instantly', icon: '⚡' },
        { title: 'Secure & Reliable', desc: 'Your data is protected with industry-standard security', icon: '🔒' }
      ].map((feature, idx) => (
        <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-5xl mb-4">{feature.icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3 dark:text-white">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
        </div>
      ))}
    </div>

    {/* Decorative Circle */}
    <div className="absolute right-0 top-1/2 w-48 h-48 bg-indigo-200 rounded-full opacity-30 -z-10"></div>
  </div>
);

export { FeaturesSection };