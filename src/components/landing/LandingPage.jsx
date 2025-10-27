import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { Footer } from './Footer';

const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <HeroSection setCurrentPage={setCurrentPage} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export { LandingPage };