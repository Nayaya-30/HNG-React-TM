import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';

const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <HeroSection setCurrentPage={setCurrentPage} />
      <FeaturesSection />
    </div>
  );
};

export { LandingPage };