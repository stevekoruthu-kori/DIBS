import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * DIBS - Premium Login Page
 * Neon Cyber-Streetwear Authentication
 */

const LoginPage = ({ onLoginSuccess }) => {
  const { login, loading } = useAuth();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    if (loginMethod === 'phone' && !formData.phone) {
      setError('Please enter your phone number');
      return;
    }
    
    if (loginMethod === 'email' && !formData.email) {
      setError('Please enter your email');
      return;
    }

    // Call the login function from useAuth
    const result = await login({
      phone: formData.phone,
      email: formData.email,
      name: formData.name || 'Bidder'
    });

    if (result.success) {
      onLoginSuccess?.();
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[430px] h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="relative bg-black border border-white/10 rounded-3xl p-8">
          
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-8"
          >
            <h1 className="text-7xl font-black font-urbanist mb-2 text-white tracking-tighter">
              DIBS
            </h1>
            <p className="text-gray-400 font-bold text-lg font-urbanist tracking-wider">
              LIVE THRIFT DROPS
            </p>
          </motion.div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-gray-300 text-sm font-bold mb-2 block font-urbanist">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-inter text-base"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="text-gray-300 text-sm font-bold mb-2 block font-urbanist">
                Registered Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-white font-bold font-inter text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter 10 digit number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                  }}
                  className="w-full pl-24 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-inter text-base tracking-widest"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3"
              >
                <p className="text-red-200 text-sm font-bold flex items-center gap-2">
                  ⚠️ {error}
                </p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="relative w-full py-3 rounded-lg font-black text-base uppercase tracking-wider overflow-hidden group disabled:opacity-50 mt-2 bg-white text-black"
            >
              {/* Text */}
              <span className="relative font-urbanist flex items-center justify-center gap-2">
                {loading ? 'PROCESSING...' : 'PROCEED'}
              </span>
            </motion.button>


          </div>
        </div>
      </motion.div>

      {/* Background Badge */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-soft-silver/40 text-xs font-inter">
          Secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
