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
    <div className="relative w-full h-screen bg-neon-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-neon-cyan rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-neon-pink rounded-full blur-3xl"
        />
        
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'linear-gradient(#00F0FF 0.5px, transparent 0.5px), linear-gradient(90deg, #00F0FF 0.5px, transparent 0.5px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-pink to-electric-mint opacity-30 blur-3xl rounded-3xl" />
        
        {/* Card */}
        <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8">
          
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-8"
          >
            <h1 
              className="text-7xl font-black font-urbanist mb-2"
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #FF007A 50%, #00FF85 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.6))'
              }}
            >
              DIBS
            </h1>
            <p className="text-white font-bold text-lg font-urbanist tracking-wider">
              LIVE THRIFT DROPS
            </p>
          </motion.div>

          {/* Toggle Login Method */}
          <div className="flex gap-2 mb-6 bg-neon-black/50 p-1 rounded-xl">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                loginMethod === 'phone'
                  ? 'bg-neon-cyan text-neon-black'
                  : 'text-soft-silver hover:text-white'
              }`}
            >
              📱 Phone
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                loginMethod === 'email'
                  ? 'bg-neon-cyan text-neon-black'
                  : 'text-soft-silver hover:text-white'
              }`}
            >
              ✉️ Email
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-soft-silver text-sm font-bold mb-2 block font-urbanist">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 bg-neon-black/50 border-2 border-white/10 rounded-xl text-white placeholder-soft-silver/50 focus:outline-none focus:border-neon-cyan transition-all font-inter"
              />
            </div>

            {/* Phone/Email Input */}
            <div>
              <label className="text-soft-silver text-sm font-bold mb-2 block font-urbanist">
                {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              {loginMethod === 'phone' ? (
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-4 bg-neon-black/50 border-2 border-white/10 rounded-xl text-white placeholder-soft-silver/50 focus:outline-none focus:border-neon-cyan transition-all font-inter"
                />
              ) : (
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-4 bg-neon-black/50 border-2 border-white/10 rounded-xl text-white placeholder-soft-silver/50 focus:outline-none focus:border-neon-cyan transition-all font-inter"
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neon-pink/20 border border-neon-pink rounded-xl px-4 py-3"
              >
                <p className="text-neon-pink text-sm font-bold">⚠️ {error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="relative w-full py-5 rounded-2xl font-black text-xl uppercase tracking-wider overflow-hidden group disabled:opacity-50"
            >
              {/* Animated gradient */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-electric-mint to-neon-cyan"
                style={{ backgroundSize: '200% 200%' }}
              />
              
              {/* Glow */}
              <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              
              {/* Text */}
              <span className="relative text-neon-black font-urbanist flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.span>
                    LOGGING IN...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    ENTER LIVE DROP
                  </>
                )}
              </span>
            </motion.button>

            {/* Terms */}
            <p className="text-soft-silver/60 text-xs text-center font-inter">
              By continuing, you agree to our{' '}
              <button className="text-neon-cyan hover:underline">Terms</button>
              {' '}and{' '}
              <button className="text-neon-cyan hover:underline">Privacy Policy</button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-soft-silver text-sm text-center mb-4 font-urbanist">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => login({ name: 'Google User', email: 'google@user.com' })}
                className="py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:border-neon-cyan transition-all text-white font-bold text-sm"
              >
                🔵 Google
              </button>
              <button 
                onClick={() => login({ name: 'Apple User', email: 'apple@user.com' })}
                className="py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:border-neon-pink transition-all text-white font-bold text-sm"
              >
                🍎 Apple
              </button>
            </div>
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
