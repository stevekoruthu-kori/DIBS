import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LoginScreen } from './LoginPage';

export const SplashScreen = ({ onComplete }) => {
  const [step, setStep] = useState('intro');

  const handleStart = () => {
    setStep('loading');
  };

  return (
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            className="relative flex flex-col items-center justify-between w-full h-full pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full relative px-6">
              {/* Main DIBS Logo */}
              <motion.h1
                className="text-6xl font-display font-black leading-[0.8] tracking-tighter text-white select-none mix-blend-difference"
                initial={{ rotate: 3, y: 50, opacity: 0 }}
                animate={{ rotate: 0, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              >
                DIBS
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mt-8 text-[10px] md:text-xs font-bold tracking-[0.8em] text-neutral-500 uppercase font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                THRIFT DIFFERENT
              </motion.p>
            </div>

            {/* Circular Button */}
            <motion.button
              onClick={handleStart}
              className="group relative flex items-center justify-center w-16 h-16 bg-white rounded-full hover:scale-105 transition-transform active:scale-95"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
              aria-label="Start"
            >
              <ArrowRight className="w-6 h-6 text-black" strokeWidth={3} />
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
            </motion.button>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <CoinStackLoader onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CoinStackLoader = ({ onComplete }) => {
  const [coinCount, setCoinCount] = useState(0);
  const [phase, setPhase] = useState('stacking');
  const totalCoins = 5;

  useEffect(() => {
    if (phase === 'stacking') {
        const interval = setInterval(() => {
            setCoinCount(prev => {
                if (prev >= totalCoins) {
                    clearInterval(interval);
                    setPhase('hammer');
                    return prev;
                }
                return prev + 1;
            });
        }, 200);
        return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'hammer') {
        // Hammer swing duration
        const timer = setTimeout(() => {
            setPhase('impact');
        }, 400); 
        return () => clearTimeout(timer);
    }

    if (phase === 'impact') {
        // Hold on DIBS result before completing
        const timer = setTimeout(() => {
            onComplete();
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
       
       {/* Retro Loading Text - Hide when exploded */}
       <motion.div
         className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4 absolute top-24"
         animate={{ opacity: phase === 'impact' ? 0 : [0.4, 1, 0.4] }}
       >
         LOADING
       </motion.div>

       <div className="relative h-64 w-full flex items-end justify-center mt-10">
          {/* Massive Coins */}
          <AnimatePresence>
            {phase !== 'impact' && Array.from({ length: coinCount }).map((_, i) => (
                <motion.div
                key={i}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute w-48 h-12 bg-white shadow-none"
                style={{ 
                    bottom: i * 14, 
                    zIndex: i,
                    clipPath: 'polygon(10% 0, 90% 0, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0 80%, 0 20%)'
                }} 
                >
                    <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] border-t border-l border-neutral-300 opacity-50"></div>
                    <div className="absolute bottom-0 w-full h-[4px] bg-neutral-400/50"></div>
                </motion.div>
            ))}
          </AnimatePresence>

          {/* Massive Pixel Hammer - Precision Geometry for Impact */}
          <AnimatePresence>
            {phase === 'hammer' && (
                <motion.div
                    className="absolute -right-4 bottom-0 origin-bottom z-50"
                    initial={{ rotate: 25, opacity: 0, scale: 0.9 }}
                    animate={{ rotate: -64, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4, ease: "backIn" }}
                >
                    <div className="relative w-64 h-60">
                        {/* Long Thin Handle - h-60 (240px) reaches exactly to center/top stack */}
                        <div className="absolute left-1/2 bottom-0 w-4 h-60 bg-neutral-800 -translate-x-1/2 border-2 border-white/20"></div>
                        {/* Big Head */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-white origin-bottom">
                            <div className="absolute inset-0 border-8 border-neutral-800"></div>
                            {/* Pixel details */}
                            <div className="absolute top-3 left-3 w-4 h-12 bg-neutral-300"></div>
                            <div className="absolute top-3 right-3 w-4 h-12 bg-neutral-300"></div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* DIBS Reveal & Particles */}
          {phase === 'impact' && (
            <>
                {/* Text */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center z-50"
                >
                    <h1 className="font-display font-black text-7xl text-white tracking-tighter mix-blend-difference bg-black px-4 py-2">DIBS</h1>
                </motion.div>

                {/* Debris Particles - Upscaled */}
                <div className="absolute left-1/2 bottom-20 -translate-x-1/2 w-full h-full pointer-events-none">
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const x = Math.cos(angle) * 120; // Wider debris spread
                    const y = Math.sin(angle) * 120;
                    
                    return (
                    <motion.div
                        key={`debris-${i}`}
                        className="absolute left-1/2 top-1/2 w-4 h-4 bg-white border border-neutral-500"
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                        animate={{ x, y: -Math.abs(y), opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    );
                })}
                </div>
            </>
          )}
       </div>
    </div>
  );
};

// Main WelcomePage component
const WelcomePage = ({ onNavigate }) => {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('login');
  };

  const handleLoginComplete = () => {
    if (onNavigate) {
      onNavigate('mobile'); // Navigate to live auction
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
        {currentScreen === 'login' && (
          <LoginScreen key="login" onComplete={handleLoginComplete} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomePage;
