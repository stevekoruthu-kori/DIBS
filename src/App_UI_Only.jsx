import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DIBS - Professional Live Thrift Auction Web App
 * Premium streetwear aesthetic • Mobile-first • TikTok/Whatnot style
 */

// ========== VIDEO BACKGROUND ==========
const VideoBackground = () => {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Video Stream Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/20 text-7xl mb-4">📹</div>
          <p className="text-white/40 text-lg font-medium tracking-wide">Video Stream</p>
          <p className="text-white/20 text-sm mt-2">Host livestream area</p>
        </div>
      </div>
      
      {/* Subtle animated grain overlay for texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
};

// ========== TOP LEFT: LIVE BADGE & VIEWER COUNT ==========
const TopLeftCluster = ({ viewerCount }) => {
  return (
    <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5">
      {/* LIVE Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full shadow-xl"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white font-bold text-sm uppercase tracking-wider">Live</span>
      </motion.div>
      
      {/* Viewer Count Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/10"
      >
        <span className="text-white text-sm font-semibold">{viewerCount} watching</span>
      </motion.div>
    </div>
  );
};

// ========== FLOATING ITEM CARD ==========
const FloatingItemCard = ({ item, currentPrice }) => {
  const [displayPrice, setDisplayPrice] = useState(currentPrice);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (currentPrice !== displayPrice) {
      setShouldAnimate(true);
      setDisplayPrice(currentPrice);
      setTimeout(() => setShouldAnimate(false), 500);
    }
  }, [currentPrice, displayPrice]);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-white/10"
    >
      <div className="flex gap-4 items-center">
        {/* Item Thumbnail */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div>
            <h3 className="text-white font-bold text-xl leading-tight mb-1.5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              {item.condition} • {item.size}
            </p>
          </div>

          {/* Price Display with Pop Animation */}
          <div className="flex items-center gap-2 mt-1">
            <motion.div
              animate={{
                scale: shouldAnimate ? [1, 1.25, 1] : 1,
              }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-4xl font-black tracking-tight"
              style={{ 
                color: shouldAnimate ? '#FFCC00' : '#ffffff',
                transition: 'color 0.3s ease',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              ₹{displayPrice}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========== RECENT BIDS FEED ==========
const RecentBidsFeed = ({ bids }) => {
  return (
    <div className="space-y-2.5 mb-4">
      <AnimatePresence mode="popLayout">
        {bids.slice(0, 3).map((bid, index) => (
          <motion.div
            key={bid.id}
            initial={{ x: -60, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 60, opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: index * 0.05 
            }}
            className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5"
          >
            <span className="text-xl">🔥</span>
            <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {bid.userName}
            </span>
            <span className="text-gray-400 text-sm font-medium">bid</span>
            <span className="text-amber-400 font-bold text-sm ml-auto">₹{bid.amount}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ========== MAIN CTA: BIG BID BUTTON ==========
const BigBidButton = ({ nextBidAmount, onBid, isWinning }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      onClick={onBid}
      className={`
        w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-wide
        shadow-2xl transition-all duration-300 relative overflow-hidden
        ${isWinning 
          ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600' 
          : 'bg-amber-400'
        }
      `}
      style={{
        boxShadow: isWinning 
          ? '0 8px 32px rgba(34, 197, 94, 0.5)' 
          : '0 8px 32px rgba(255, 204, 0, 0.6)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      <span className="relative z-10 flex items-center justify-center gap-3">
        {isWinning ? (
          <>
            <span className="text-3xl">✓</span>
            <span className="text-white">You're Winning!</span>
          </>
        ) : (
          <span className="text-black" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            BID ₹{nextBidAmount}
          </span>
        )}
      </span>
    </motion.button>
  );
};

// ========== CONFETTI MOCK ==========
const ConfettiMock = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            y: -20,
            rotate: 0,
          }}
          animate={{ 
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
            rotate: 360,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            ease: 'linear',
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#ff3366', '#ffd700', '#00ff88', '#00ccff', '#ff66cc'][i % 5],
          }}
        />
      ))}
    </div>
  );
};

// ========== MAIN APP ==========
function App() {
  // Dummy data
  const [currentPrice, setCurrentPrice] = useState(550);
  const [isWinning, setIsWinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentBids, setRecentBids] = useState([
    { id: 1, userName: 'Rohan', amount: 500 },
    { id: 2, userName: 'Meera', amount: 550 },
  ]);

  const item = {
    title: 'Vintage Nike Tee – Size L',
    condition: 'Excellent',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  };

  const viewerCount = '1.2K';
  const bidIncrement = 50;
  const nextBidAmount = currentPrice + bidIncrement;

  // Demo: Simulate price changes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = currentPrice + bidIncrement;
      setCurrentPrice(newPrice);
      
      const newBid = {
        id: Date.now(),
        userName: ['Rohan', 'Meera', 'Arjun', 'Priya', 'Kabir'][Math.floor(Math.random() * 5)],
        amount: newPrice,
      };
      
      setRecentBids(prev => [newBid, ...prev].slice(0, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice, bidIncrement]);

  // Handle bid
  const handleBid = () => {
    const newPrice = currentPrice + bidIncrement;
    setCurrentPrice(newPrice);
    setIsWinning(true);
    
    const newBid = {
      id: Date.now(),
      userName: 'You',
      amount: newPrice,
    };
    
    setRecentBids(prev => [newBid, ...prev].slice(0, 5));

    // Show confetti for 3 seconds
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Reset winning status after 10 seconds
    setTimeout(() => setIsWinning(false), 10000);
  };

  return (
    <div className="relative w-screen h-[100svh] overflow-hidden bg-black">
      {/* ===== Z-INDEX 0: FULLSCREEN VIDEO BACKGROUND ===== */}
      <VideoBackground />

      {/* ===== Z-INDEX 10: OVERLAY UI ===== */}
      <div className="absolute inset-0 z-10">
        
        {/* Top Left Cluster: LIVE + Viewer Count */}
        <TopLeftCluster viewerCount={viewerCount} />

        {/* ===== BOTTOM OVERLAY AREA ===== */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          {/* Black → Transparent Gradient for Readability */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)'
            }}
          />
          
          {/* Main Interactive Zone */}
          <div className="relative pointer-events-auto px-6 pb-8 pt-40 space-y-5 max-w-2xl mx-auto">
            
            {/* Floating Item Card */}
            <FloatingItemCard item={item} currentPrice={currentPrice} />

            {/* Recent Bids Feed (above button) */}
            <RecentBidsFeed bids={recentBids} />

            {/* Main CTA: Big BID Button */}
            <BigBidButton 
              nextBidAmount={nextBidAmount} 
              onBid={handleBid}
              isWinning={isWinning}
            />
          </div>
        </div>
      </div>

      {/* Confetti Celebration */}
      <ConfettiMock show={showConfetti} />
    </div>
  );
}

export default App;
