import React from 'react';
import { motion } from 'framer-motion';

const WelcomePage = ({ onNavigate }) => {
  return (
    <div className="relative mx-auto w-full max-w-[430px] min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient - Monochrome */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8">
        {/* DIBS Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 1 
          }}
          className="mb-12 text-center"
        >
          <h1 className="text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">
            DIBS
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-white mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-gray-400 text-lg font-medium tracking-wide"
          >
            Live Thrift Drops
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mb-16 max-w-xs"
        >
          <p className="text-gray-500 text-sm font-inter leading-relaxed">
            Experience the thrill of live auctions.
            <br />
            Vintage • Streetwear • Designer
          </p>
        </motion.div>

        {/* Arrow Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          onClick={() => onNavigate('login')}
          className="group relative"
        >
          {/* Animated Ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-white/20 blur-lg"
          />
          
          {/* Button */}
          <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
            <svg 
              className="w-8 h-8 text-black group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-gray-600 text-xs mt-6 font-medium tracking-widest uppercase"
        >
          Tap to enter
        </motion.p>
      </div>
    </div>
  );
};

export default WelcomePage;
