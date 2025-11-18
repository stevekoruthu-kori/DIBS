import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { InstallPrompt, OfflineIndicator } from './components/PWAFeatures';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './screens/LoginPage';

/**
 * DIBS - PROGRESSIVE WEB APP
 * Neon Cyber-Streetwear Live Thrift Platform
 * Installable • Offline-Ready • Native-Like • Authenticated
 * 
 * ✅ Engineer 1 Dopamine Features:
 * - Framer Motion price pop animation (scale 1.2x on bid change)
 * - React-Confetti explosion on win
 * - Firebase real-time bid updates trigger animations
 * - Secure authentication with useAuth hook
 */

// ============================================
// SCREEN 1: LIVE AUCTION ROOM (MOBILE)
// ============================================

const LiveAuctionMobile = ({ onNavigate }) => {
  const [currentPrice, setCurrentPrice] = useState(900);
  const [isWinning, setIsWinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [priceKey, setPriceKey] = useState(0);
  const [bidCount, setBidCount] = useState(47);
  const [timeLeft, setTimeLeft] = useState(45);

  const recentBids = [
    { id: 1, name: 'Rohan K.', amount: 900, time: '2s ago', avatar: '🔥' },
    { id: 2, name: 'Priya M.', amount: 850, time: '5s ago', avatar: '⚡' },
    { id: 3, name: 'Arjun S.', amount: 800, time: '8s ago', avatar: '💎' },
  ];

  useEffect(() => {
    setPriceKey(prev => prev + 1);
  }, [currentPrice]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBid = () => {
    setCurrentPrice(currentPrice + 50);
    setBidCount(bidCount + 1);
    setIsWinning(true);
    setShowConfetti(true);
    setTimeLeft(45); // Reset timer
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div className="relative w-full h-screen bg-neon-black overflow-hidden">
      {/* Premium Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-graphite to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">📹</div>
            <p className="text-soft-silver text-lg font-urbanist font-bold tracking-wider">LIVE STREAM</p>
          </motion.div>
        </div>
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl"
        />
        {/* Refined Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#00F0FF 0.5px, transparent 0.5px), linear-gradient(90deg, #00F0FF 0.5px, transparent 0.5px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
      </div>

      {/* Enhanced Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-5">
        <div className="flex items-center justify-between">
          {/* Left: LIVE Badge + Viewers */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-neon-pink rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-neon-pink to-pink-600 px-4 py-2 rounded-full shadow-2xl">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <div className="w-2 h-2 bg-white rounded-full absolute left-4 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest font-urbanist">LIVE</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-2xl bg-white/10 px-4 py-2 rounded-full border border-white/20"
            >
              <span className="text-white font-bold text-sm font-inter">👁️ 1.2K</span>
            </motion.div>
          </div>

          {/* Right: Timer */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-2xl bg-neon-cyan/20 px-5 py-2 rounded-full border-2 border-neon-cyan"
          >
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan font-black text-lg font-urbanist">{timeLeft}s</span>
              <span className="text-xs text-soft-silver font-inter">left</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neon-black via-neon-black/95 to-transparent" 
             style={{ height: '70%' }} />
        
        {/* Content */}
        <div className="relative pointer-events-auto px-5 pb-6 pt-32 space-y-4">
          
          {/* Premium Item Card with Glassmorphism */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-pink to-electric-mint opacity-50 blur-xl" />
            
            <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6">
              <div className="flex gap-4 items-start">
                {/* Premium Image with glow */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-neon-pink rounded-2xl blur-xl opacity-60" />
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-neon-pink/50 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" 
                      alt="Item" 
                      className="w-full h-full object-cover"
                    />
                    {/* Condition Badge */}
                    <div className="absolute top-2 right-2 bg-electric-mint text-neon-black text-xs font-black px-2 py-1 rounded-full">
                      9/10
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-black text-xl mb-1 font-urbanist leading-tight">
                        Vintage Nike Tee
                      </h3>
                      <p className="text-soft-silver/80 text-sm font-inter">Size L • 90s Era • Mint</p>
                    </div>
                    <div className="text-right">
                      <p className="text-electric-mint text-xs font-bold">{bidCount} bids</p>
                    </div>
                  </div>
                  
                  {/* Price Display with Premium Animation */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <motion.div
                      key={priceKey}
                      initial={{ scale: 0.8, y: 10, opacity: 0 }}
                      animate={{ scale: [0.8, 1.15, 1], y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: [0.34, 1.56, 0.64, 1] // Bouncy ease
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-neon-cyan rounded-lg blur-2xl opacity-50" />
                      <div className="relative text-6xl font-black font-urbanist"
                           style={{ 
                             background: 'linear-gradient(135deg, #00F0FF 0%, #00FF85 100%)',
                             WebkitBackgroundClip: 'text',
                             WebkitTextFillColor: 'transparent',
                             filter: 'drop-shadow(0 0 20px #00F0FF)'
                           }}>
                        ₹{currentPrice}
                      </div>
                    </motion.div>
                    {isWinning && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-electric-mint text-2xl"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Recent Bids Feed */}
          <div className="space-y-2">
            {recentBids.map((bid, i) => (
              <motion.div
                key={bid.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                className="group relative overflow-hidden backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 hover:border-electric-mint/50 transition-all"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-electric-mint/0 via-electric-mint/10 to-electric-mint/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center gap-3 px-4 py-3">
                  <div className="text-2xl">{bid.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-bold text-sm font-urbanist">{bid.name}</span>
                      <span className="text-soft-silver/60 text-xs font-inter">{bid.time}</span>
                    </div>
                    <span className="text-soft-silver/80 text-xs font-inter">placed a bid</span>
                  </div>
                  <div className="text-right">
                    <div className="text-neon-cyan font-black text-lg font-urbanist">₹{bid.amount}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Premium BID Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBid}
            className="relative w-full py-7 rounded-3xl font-black text-2xl uppercase tracking-wider overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className={`absolute inset-0 ${
                isWinning
                  ? 'bg-gradient-to-r from-electric-mint via-neon-cyan to-electric-mint'
                  : 'bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-cyan'
              }`}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Glow effect */}
            <div className={`absolute inset-0 blur-2xl opacity-50 ${
              isWinning ? 'bg-electric-mint' : 'bg-neon-cyan'
            }`} />
            
            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3 font-urbanist">
              {isWinning ? (
                <>
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl"
                  >
                    ✓
                  </motion.span>
                  <span className="text-neon-black">YOU'RE WINNING!</span>
                </>
              ) : (
                <>
                  <span className="text-neon-black">BID</span>
                  <motion.span
                    key={currentPrice}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-neon-black font-black"
                  >
                    ₹{currentPrice + 50}
                  </motion.span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl"
                  >
                    →
                  </motion.span>
                </>
              )}
            </div>
            
            {/* Ripple effect on tap */}
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              whileTap={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 bg-white rounded-3xl"
            />
          </motion.button>

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => onNavigate('desktop')}
              className="flex-1 py-2 bg-graphite/50 border border-neon-pink/50 text-neon-pink text-xs font-bold rounded-lg"
            >
              DESKTOP VIEW
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className="flex-1 py-2 bg-graphite/50 border border-neon-cyan/50 text-neon-cyan text-xs font-bold rounded-lg"
            >
              ADMIN PANEL
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 DOPAMINE: Confetti explosion on win! */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#00F0FF', '#FF007A', '#00FF85', '#FFFFFF']} // Neon cyber colors!
          recycle={false}
          className="z-50"
        />
      )}
    </div>
  );
};

// ============================================
// SCREEN 2: DESKTOP VIEW
// ============================================

const DesktopView = ({ onNavigate }) => {
  return (
    <div className="w-full h-screen bg-neon-black flex">
      {/* Left: Video (60%) */}
      <div className="w-3/5 relative bg-gradient-to-br from-gray-900 via-graphite to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-9xl mb-6 opacity-20">📹</div>
            <p className="text-soft-silver text-2xl font-urbanist font-bold">LIVE STREAM</p>
          </div>
        </div>
        
        {/* LIVE Badge */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neon-pink px-5 py-2.5 rounded-full shadow-neon-pink">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-black text-base uppercase tracking-widest font-urbanist">LIVE</span>
          </div>
          <div className="bg-graphite/80 backdrop-blur-xl px-5 py-2.5 rounded-full border-2 border-neon-cyan shadow-neon-cyan">
            <span className="text-neon-cyan font-bold text-base font-inter">1.2K watching</span>
          </div>
        </div>
      </div>

      {/* Right: Auction Panel (40%) */}
      <div className="w-2/5 bg-graphite p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-neon-cyan text-3xl font-black font-urbanist mb-2" style={{ textShadow: '0 0 20px #00F0FF' }}>
              LIVE AUCTION
            </h2>
            <p className="text-soft-silver font-inter">Desktop Experience</p>
          </div>

          {/* Item Card */}
          <div className="bg-neon-black/50 border-2 border-neon-pink/30 rounded-2xl p-6">
            <img 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
              alt="Item"
              className="w-full h-48 object-cover rounded-xl mb-4 border-2 border-neon-cyan shadow-neon-cyan"
            />
            <h3 className="text-white font-black text-2xl font-urbanist mb-2">Vintage Nike Tee – Size L</h3>
            <p className="text-soft-silver mb-4 font-inter">Excellent Condition • 90s Era</p>
            <div className="text-5xl font-black text-neon-cyan mb-6 font-urbanist" style={{ textShadow: '0 0 30px #00F0FF' }}>
              ₹900
            </div>
            
            <button className="w-full py-4 bg-neon-cyan text-neon-black font-black text-xl rounded-xl shadow-neon-cyan uppercase tracking-wider font-urbanist">
              BID ₹950
            </button>
          </div>

          {/* Recent Bids */}
          <div className="space-y-3">
            <h4 className="text-electric-mint font-bold text-sm font-urbanist uppercase">Recent Bids</h4>
            {['Rohan', 'Priya', 'Arjun'].map((name, i) => (
              <div key={i} className="flex items-center gap-3 bg-neon-black/50 px-4 py-3 rounded-lg border border-electric-mint/20">
                <span>🔥</span>
                <span className="text-electric-mint font-bold font-urbanist">{name}</span>
                <span className="text-soft-silver text-sm">bid</span>
                <span className="text-neon-pink font-black ml-auto">₹{900 - i * 50}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('mobile')}
            className="w-full py-3 bg-graphite border-2 border-neon-pink text-neon-pink font-bold rounded-lg"
          >
            ← BACK TO MOBILE VIEW
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCREEN 3: ADMIN PANEL
// ============================================

const AdminPanel = ({ onNavigate }) => {
  const [isLive, setIsLive] = useState(false);

  const upcomingItems = [
    { id: 1, name: 'Vintage Nike Tee', price: 800 },
    { id: 2, name: 'Levi\'s 501 Jeans', price: 1200 },
    { id: 3, name: 'Champion Hoodie', price: 1500 },
  ];

  return (
    <div className="w-full min-h-screen bg-neon-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-neon-pink text-4xl font-black font-urbanist mb-2" style={{ textShadow: '0 0 20px #FF007A' }}>
              ADMIN PANEL
            </h1>
            <p className="text-soft-silver font-inter">Host Dashboard</p>
          </div>
          <button 
            onClick={() => onNavigate('mobile')}
            className="px-6 py-3 bg-graphite border-2 border-neon-cyan text-neon-cyan font-bold rounded-lg"
          >
            ← EXIT
          </button>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Auction Status */}
          <div className="bg-graphite border-2 border-neon-cyan/30 rounded-2xl p-6">
            <h3 className="text-neon-cyan font-black text-xl mb-4 font-urbanist">AUCTION STATUS</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-soft-silver font-inter">Status:</span>
                <span className={`font-black ${isLive ? 'text-electric-mint' : 'text-neon-pink'}`}>
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft-silver font-inter">Current High Bid:</span>
                <span className="text-neon-cyan font-black text-2xl">₹900</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft-silver font-inter">Viewers:</span>
                <span className="text-white font-bold">1,234</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`w-full py-4 font-black text-lg rounded-xl uppercase tracking-wider ${
                  isLive 
                    ? 'bg-neon-pink text-white shadow-neon-pink' 
                    : 'bg-electric-mint text-neon-black shadow-neon-mint'
                }`}
              >
                {isLive ? 'STOP AUCTION' : 'START AUCTION'}
              </button>
            </div>
          </div>

          {/* Item Queue */}
          <div className="bg-graphite border-2 border-neon-pink/30 rounded-2xl p-6">
            <h3 className="text-neon-pink font-black text-xl mb-4 font-urbanist">ITEM QUEUE</h3>
            <div className="space-y-3">
              {upcomingItems.map((item) => (
                <div key={item.id} className="bg-neon-black/50 p-4 rounded-lg border border-electric-mint/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold font-urbanist">{item.name}</span>
                    <span className="text-neon-cyan font-black">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink font-bold rounded-lg">
              + ADD ITEM
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-graphite border-2 border-electric-mint/30 rounded-2xl p-6">
          <h3 className="text-electric-mint font-black text-xl mb-4 font-urbanist">ITEM NOTES</h3>
          <textarea 
            placeholder="Add measurements, defects, sizing details..."
            className="w-full h-32 bg-neon-black/50 border border-neon-cyan/30 rounded-lg p-4 text-white placeholder-soft-silver focus:outline-none focus:border-neon-cyan"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCREEN 4: LANDING PAGE
// ============================================

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="w-full h-screen bg-neon-black flex items-center justify-center overflow-hidden relative">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-neon-cyan rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-pink rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-mint rounded-full blur-3xl"
        />
        
        {/* Animated grid */}
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'linear-gradient(#00F0FF 0.5px, transparent 0.5px), linear-gradient(90deg, #00F0FF 0.5px, transparent 0.5px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Premium Logo with 3D effect */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="mb-8"
        >
          <h1 
            className="text-9xl md:text-[12rem] font-black font-urbanist relative"
            style={{
              background: 'linear-gradient(135deg, #00F0FF 0%, #FF007A 50%, #00FF85 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 40px rgba(0,240,255,0.8)) drop-shadow(0 0 80px rgba(255,0,122,0.6))',
              letterSpacing: '-0.05em'
            }}
          >
            DIBS
          </h1>
          <motion.div
            animate={{ 
              width: ['0%', '100%', '100%'],
              opacity: [0, 1, 1]
            }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-neon-cyan via-neon-pink to-electric-mint mx-auto mt-4"
            style={{ maxWidth: '400px' }}
          />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-4xl md:text-5xl text-white font-black font-urbanist mb-3 tracking-tight">
            LIVE THRIFT DROPS
          </p>
          <p className="text-soft-silver/80 text-lg md:text-xl font-inter mb-16 tracking-wide">
            Neon Cyber-Streetwear • Real-Time Auctions • Exclusive Vintage
          </p>
        </motion.div>

        {/* Premium Stats Grid */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {[
            { icon: '🔥', label: 'Live Now', value: '1.2K' },
            { icon: '⚡', label: 'Drops Today', value: '47' },
            { icon: '💎', label: 'Items Won', value: '892' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-neon-cyan/50 transition-all"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-white font-urbanist">{stat.value}</div>
              <div className="text-xs text-soft-silver font-inter">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Teaser Image Grid */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-neon-cyan shadow-neon-cyan">
              <img 
                src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&seed=${i}`}
                alt={`Thrift ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Premium CTA Button */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('mobile')}
          className="relative group px-16 py-7 rounded-3xl font-black text-3xl uppercase tracking-wider font-urbanist overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-electric-mint to-neon-cyan"
            style={{ backgroundSize: '200% 200%' }}
          />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-neon-cyan blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
          
          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
          
          {/* Button text */}
          <span className="relative text-neon-black flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ⚡
            </motion.span>
            ENTER LIVE DROP
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {/* Secondary Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <button 
            onClick={() => onNavigate('desktop')}
            className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-neon-cyan/30 text-neon-cyan text-sm font-bold rounded-xl hover:border-neon-cyan transition-all"
          >
            🖥️ Desktop View
          </button>
          <button 
            onClick={() => onNavigate('admin')}
            className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-neon-pink/30 text-neon-pink text-sm font-bold rounded-xl hover:border-neon-pink transition-all"
          >
            ⚙️ Admin Panel
          </button>
          <button 
            onClick={() => onNavigate('winner')}
            className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-electric-mint/30 text-electric-mint text-sm font-bold rounded-xl hover:border-electric-mint transition-all"
          >
            🏆 Winner Popup
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCREEN 5: WINNER POPUP
// ============================================

const WinnerPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-neon-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-graphite border-4 border-neon-pink rounded-3xl p-8 max-w-md w-full relative"
        style={{ boxShadow: '0 0 60px rgba(255,0,122,0.6), inset 0 0 60px rgba(255,0,122,0.1)' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-soft-silver hover:text-white text-2xl"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>

          <h2 
            className="text-neon-pink text-5xl font-black font-urbanist mb-4"
            style={{ textShadow: '0 0 30px #FF007A' }}
          >
            YOU WON!
          </h2>

          <p className="text-white text-2xl font-bold mb-2 font-urbanist">Vintage Nike Tee</p>
          <p className="text-soft-silver mb-6 font-inter">Size L • Excellent Condition</p>

          <div className="bg-neon-black/50 border-2 border-neon-cyan rounded-xl p-6 mb-6">
            <p className="text-soft-silver text-sm mb-2 font-inter">Winning Bid</p>
            <p 
              className="text-neon-cyan text-6xl font-black font-urbanist"
              style={{ textShadow: '0 0 30px #00F0FF' }}
            >
              ₹900
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-4 bg-neon-cyan text-neon-black font-black text-lg rounded-xl shadow-neon-cyan uppercase tracking-wider font-urbanist">
              GET PAYMENT LINK
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-graphite border-2 border-soft-silver text-soft-silver font-bold text-lg rounded-xl"
            >
              LATER
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// MAIN APP NAVIGATION
// ============================================

// Main App Component with Auth Check
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [showWinner, setShowWinner] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  // Detect if running as installed PWA
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || window.navigator.standalone 
                      || document.referrer.includes('android-app://');
    setIsPWA(isStandalone);
    
    if (isStandalone) {
      console.log('🚀 Running as Progressive Web App');
    }
  }, []);

  const handleNavigate = (screen) => {
    if (screen === 'winner') {
      setShowWinner(true);
    } else {
      setCurrentScreen(screen);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('landing');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {/* PWA-specific features */}
      <OfflineIndicator />
      <InstallPrompt />

      {/* Main App Screens */}
      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentScreen === 'mobile' && <LiveAuctionMobile onNavigate={handleNavigate} user={user} />}
        {currentScreen === 'desktop' && <DesktopView onNavigate={handleNavigate} user={user} />}
        {currentScreen === 'admin' && <AdminPanel onNavigate={handleNavigate} />}
      </AnimatePresence>

      {showWinner && <WinnerPopup onClose={() => setShowWinner(false)} />}

      {/* User Profile Badge */}
      <div className="fixed top-2 right-2 z-40 flex items-center gap-2">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-xl">{user?.avatar || '👤'}</span>
          <span className="text-white text-sm font-bold font-urbanist">{user?.name}</span>
          <button 
            onClick={logout}
            className="ml-2 text-neon-pink hover:text-neon-cyan transition-colors text-xs"
            title="Logout"
          >
            🚪
          </button>
        </div>
        {isPWA && (
          <div className="bg-electric-mint text-neon-black px-3 py-2 rounded-full text-xs font-bold">
            📱 APP
          </div>
        )}
      </div>
    </>
  );
}

// App wrapper with Auth Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
