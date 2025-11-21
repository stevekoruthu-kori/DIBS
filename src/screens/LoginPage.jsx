import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const LoginScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handlePhoneChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
      if (error) setError('');
    }
  };

  const handleEnter = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (phone.length < 10) {
      setError('10-digit number required');
      return;
    }
    // Basic check for Indian mobile starting digits (6-9)
    if (!/^[6-9]/.test(phone)) {
        setError('Invalid Indian mobile number');
        return;
    }
    
    // Login validation successful
    setError('');
    console.log('Login successful:', { name, phone });
    onComplete();
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-black text-white flex flex-col px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto w-full">
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center"
        >
            <h2 className="font-display font-bold text-4xl tracking-tighter">LOGIN</h2>
        </motion.div>

        <div className="space-y-12">
            {/* Name Input */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                <label className="block text-sm font-black text-white uppercase tracking-widest">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-lg font-medium placeholder-neutral-700 focus:outline-none focus:border-white transition-colors"
                />
            </motion.div>

            {/* Phone Input */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
            >
                <label className="block text-sm font-black text-white uppercase tracking-widest">
                    Registered Phone Number
                </label>
                <div className="flex items-center gap-3 border-b border-neutral-800 focus-within:border-white transition-colors py-3">
                    <span className="text-neutral-500 text-lg font-medium">+91</span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="00000 00000"
                        className="flex-1 bg-transparent text-lg font-medium placeholder-neutral-700 focus:outline-none tracking-wider"
                    />
                </div>
            </motion.div>
        </div>

        {/* Error Message */}
        <div className="h-6 mt-10 text-center">
            {error && (
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-red-500 text-xs font-medium tracking-wide"
                >
                    {error}
                </motion.p>
            )}
        </div>

        <motion.button
            onClick={handleEnter}
            className="w-full mt-6 h-14 bg-white text-black rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            Enter Live
        </motion.button>
      </div>
    </motion.div>
  );
};