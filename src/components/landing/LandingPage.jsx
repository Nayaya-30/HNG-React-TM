import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';

const LandingPage = ({ setCurrentPage }) => {
	return (
		<div className='page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
			<HeroSection setCurrentPage={setCurrentPage} />
			<FeaturesSection />
		</div>
	);
};

export { LandingPage };
