import React from "react";
import { WifiOff } from "lucide-react";


const OfflinePopUp = ({ isOnline }) => {


	if (isOnline) return null; // Hide when online

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4">
			<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 text-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center transform animate-bounce">
				<div className="flex justify-center mb-4">
					<WifiOff className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
				</div>
				<h2 className="text-xl font-bold text-yellow-400 tracking-wide">
					You’re Offline
				</h2>
				<p className="mt-2 text-gray-300 text-sm">
					Please check your internet connection.
					Some features may be temporarily unavailable.
				</p>

				<button
					onClick={() => window.location.reload()}
					className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-yellow-500/30"
				>
					Retry Connection
				</button>
			</div>
		</div>
	);
};

export default OfflinePopUp;