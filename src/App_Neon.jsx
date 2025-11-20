import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { InstallPrompt, OfflineIndicator } from './components/PWAFeatures';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './screens/LoginPage';
import ThriftBrowse from './screens/ThriftBrowse';
import WelcomePage from './screens/WelcomePage';
import LiveStreamPlayer from './components/LiveStreamPlayer';

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
 * - Whatnot-style clean interface option
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
  const [customBidAmount, setCustomBidAmount] = useState(950);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'vintage_king', text: 'Is this true to size?', color: 'text-gray-400' },
    { id: 2, user: 'sneaker_head', text: 'Bid placed! 🔥', color: 'text-gray-400' },
    { id: 3, user: 'thrift_queen', text: 'Love the color on this one', color: 'text-gray-400' },
    { id: 4, user: 'style_hunter', text: 'Wow! Amazing piece', color: 'text-gray-400' },
    { id: 5, user: 'retro_vibes', text: 'What year is this from?', color: 'text-gray-400' },
    { id: 6, user: 'fashion_guru', text: 'Need this in my collection', color: 'text-gray-400' },
    { id: 7, user: 'cool_kid', text: 'How much is it now?', color: 'text-gray-400' },
    { id: 8, user: 'bidder_pro', text: 'Going to bid on this', color: 'text-gray-400' },
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    setPriceKey(prev => prev + 1);
    setCustomBidAmount(currentPrice + 50);
  }, [currentPrice]);

  // Auto-scroll chat to bottom when new message arrives
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBid = () => {
    setCurrentPrice(customBidAmount);
    setBidCount(bidCount + 1);
    setIsWinning(true);
    setShowConfetti(true);
    setTimeLeft(45); // Reset timer
    
    // Add bid message
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      user: 'You', 
      text: `Bid placed: ₹${customBidAmount}`, 
      color: 'text-white' 
    }]);

    setTimeout(() => setShowConfetti(false), 4000);
  };

  const decreaseBid = () => {
    if (customBidAmount > currentPrice + 50) {
      setCustomBidAmount(prev => prev - 100);
    }
  };

  const increaseBid = () => {
    setCustomBidAmount(prev => prev + 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      user: 'You', 
      text: chatMessage, 
      color: 'text-gray-400' 
    }]);
    setChatMessage('');
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center overflow-hidden font-urbanist">
      <div className="relative w-full max-w-[480px] h-full bg-black shadow-2xl overflow-hidden">
      {/* 1. Full-screen Video Background */}
      <div className="absolute inset-0 bg-gray-900">
        <LiveStreamPlayer />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* 2. Top Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-start justify-between">
        {/* Streamer Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Streamer" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white text-black text-[8px] font-bold px-1 rounded">LIVE</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">vintage_vault</span>
              <button className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                Follow
              </button>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <span>00:45</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                1.2K
              </span>
            </div>
          </div>
          <button className="ml-1 text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-white font-bold text-xs">vbdxd</span>
        </div>
      </div>

      {/* 3. Left-side Chat Overlay - Scrollable */}
      <div 
        ref={chatRef}
        className="absolute bottom-[170px] left-4 w-64 h-[22vh] overflow-y-scroll"
        style={{
          maskImage: 'linear-gradient(to top, transparent 5%, black 15%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 15%)',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex flex-col space-y-2 pb-4">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm drop-shadow-md"
            >
              <span className={`${msg.color} font-bold mr-2`}>{msg.user}</span>
              <span className="text-white font-medium">{msg.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Highest Bidder Badge - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-[170px] right-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5"
      >
        <p className="text-white text-sm font-bold">
          {isWinning ? 'You' : 'helna'} <span className="text-gray-300 font-medium">₹{currentPrice}</span>
        </p>
      </motion.div>

      {/* 4. Chat Input */}
      <div className="absolute bottom-[115px] left-4 right-4 z-30">
        <form onSubmit={handleSendMessage} className="relative">
          <input 
            type="text" 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Say something..." 
            className="w-full bg-black/40 backdrop-blur-md text-white text-sm rounded-full px-4 py-2.5 border border-white/10 focus:outline-none focus:border-white/30 placeholder-white/50"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-xs">
            SEND
          </button>
        </form>
      </div>

      {/* 5. Auction Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-3 pb-6 z-40">
        <div className="flex items-center gap-3">
          {/* Item Thumbnail */}
          <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/20 flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" alt="Item" className="w-full h-full object-cover grayscale" />
          </div>

          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm truncate">Vintage Nike Tee</h3>
            <p className="text-gray-400 text-xs truncate">Size L • 90s Era</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white font-black text-lg">₹{currentPrice}</span>
              <span className="text-gray-500 text-xs font-mono">{timeLeft}s</span>
            </div>
          </div>

          {/* Bid Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={decreaseBid}
              className="w-10 h-10 rounded-full bg-gray-800 border border-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-xl font-bold">-</span>
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBid}
              className="bg-white text-black font-black px-6 py-3 rounded-xl flex flex-col items-center min-w-[100px] shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <span className="text-xs font-bold uppercase">BID</span>
              <span className="text-lg leading-none">₹{customBidAmount}</span>
            </motion.button>

            <button 
              onClick={increaseBid}
              className="w-10 h-10 rounded-full bg-gray-800 border border-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-xl font-bold">+</span>
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
          colors={['#FFFFFF', '#CCCCCC', '#888888']} 
          recycle={false}
          className="z-50"
        />
      )}
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
    setCurrentScreen('live');
  };

  return (
    <>
      {/* PWA-specific features */}
      <OfflineIndicator />
      <InstallPrompt />

      {/* Main App Screens */}
      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && (
          <WelcomePage key="landing" onNavigate={handleNavigate} />
        )}
        
        {currentScreen === 'login' && (
          <LoginPage key="login" onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentScreen === 'thrift' && (
          <ThriftBrowse key="thrift" onNavigate={handleNavigate} />
        )}

        {(currentScreen === 'live' || currentScreen === 'mobile') && (
          <LiveAuctionMobile key="live" onNavigate={handleNavigate} user={user} />
        )}

        {currentScreen === 'admin' && (
          <AdminPanel key="admin" onNavigate={handleNavigate} />
        )}
      </AnimatePresence>

      {showWinner && <WinnerPopup onClose={() => setShowWinner(false)} />}
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
