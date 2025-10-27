import React from "react";
import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="relative overflow-hidden text-white bg-gradient-to-b from-gray-900 via-gray-800 to-black">
    {/* ---- Decorative Background Circles ---- */}
    <div className="absolute top-[-6rem] right-[-8rem] w-[400px] h-[400px] bg-yellow-400 opacity-10 blur-3xl rounded-full"></div>
    <div className="absolute bottom-[-5rem] left-[-6rem] w-[300px] h-[300px] bg-indigo-500 opacity-10 blur-3xl rounded-full"></div>
    <div className="absolute bottom-[8rem] right-[10rem] w-[150px] h-[150px] bg-yellow-300 opacity-20 blur-2xl rounded-full"></div>

    {/* ---- Hero Content ---- */}
    <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Manage Your Tickets with{" "}
            <span className="text-yellow-400">Ease</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Streamline your workflow with our elegant ticket management system. 
            Track, prioritize, and resolve with confidence — all in one place.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/signup"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              Login
            </Link>
          </div>
        </div>

        {/* ---- Illustration ---- */}
        <div className="hidden md:flex justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[380px] h-[380px] bg-white/5 backdrop-blur-sm rounded-full"></div>
          </div>
          <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
            <Ticket className="w-[200px] h-[200px] text-yellow-300 opacity-30 mx-auto" />
          </div>
        </div>
      </div>
    </div>

    {/* ---- Dual Wavy Layers ---- */}
    <div className="absolute bottom-0 w-full">
      <svg
        className="w-full"
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Upper gentle wave */}
        <path
          d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V200H0Z"
          fill="#1F2937"
        />
        {/* Lower contrasting wave */}
        <path
          d="M0 150L80 130C160 110 320 70 480 60C640 50 800 70 960 90C1120 110 1280 130 1360 140L1440 150V200H0Z"
          fill="#111827"
        />
      </svg>
    </div>
  </section>
);

export { HeroSection };