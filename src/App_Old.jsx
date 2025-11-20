import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DIBS - TikTok-Style Thrift Auction UI
 * Mobile-first, fullscreen, streetwear aesthetic
 */

// ========== VIDEO PLACEHOLDER ==========
const VideoPlaceholder = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Video placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white/30">
          <div className="text-6xl mb-4">📹</div>
          <p className="text-sm font-medium">Live Stream Goes Here</p>
        </div>
      </div>
    </div>
  );
};

// ========== LIVE BADGE ==========
const LiveBadge = ({ viewerCount }) => {
  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
      {/* LIVE Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full shadow-lg"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white font-bold text-xs uppercase tracking-wide">Live</span>
      </motion.div>
      
      {/* Viewer Count */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <span className="text-lg">👥</span>
        <span className="text-white font-semibold text-xs">{viewerCount} watching</span>
      </motion.div>
    </div>
  );
};

// ========== ITEM CARD ==========
const ItemCard = ({ item, currentPrice }) => {
  const [displayPrice, setDisplayPrice] = useState(currentPrice);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (currentPrice !== displayPrice) {
      setShouldAnimate(true);
      setDisplayPrice(currentPrice);
      setTimeout(() => setShouldAnimate(false), 400);
    }
  }, [currentPrice, displayPrice]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10"
    >
      <div className="flex gap-4">
        {/* Item Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-24 h-24 object-cover rounded-xl shadow-lg"
          />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
            🔥 HOT
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight mb-1">
              {item.title}
            </h3>
            <p className="text-gray-300 text-xs mb-2">
              {item.condition} • {item.size}
            </p>
          </div>

          {/* Price with Animation */}
          <div className="flex items-baseline gap-2">
            <span className="text-gray-400 text-xs">Current Bid</span>
            <motion.div
              animate={{
                scale: shouldAnimate ? [1, 1.3, 1] : 1,
                color: shouldAnimate ? ['#ffffff', '#ffd700', '#ffffff'] : '#ffffff',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-3xl font-black text-white"
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
const RecentBidsList = ({ bids }) => {
  return (
    <div className="space-y-2 max-h-32 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {bids.slice(0, 3).map((bid, index) => (
          <motion.div
            key={bid.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg"
          >
            <span className="text-lg">🔥</span>
            <span className="text-white text-sm font-medium">
              {bid.userName}
            </span>
            <span className="text-gray-400 text-sm">bid</span>
            <span className="text-yellow-400 font-bold text-sm">₹{bid.amount}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ========== BIG BID BUTTON ==========
const BidButton = ({ nextBidAmount, onBid, isWinning }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onBid}
      className={`
        w-full py-5 rounded-2xl font-black text-xl uppercase tracking-wide
        shadow-2xl transition-all duration-200
        ${isWinning 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
          : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black'
        }
      `}
      style={{
        boxShadow: isWinning 
          ? '0 0 40px rgba(34, 197, 94, 0.6)' 
          : '0 0 40px rgba(251, 191, 36, 0.8)',
      }}
    >
      {isWinning ? (
        <span className="flex items-center justify-center gap-2">
          <span>✓</span>
          <span>You're Winning!</span>
        </span>
      ) : (
        <span>BID ₹{nextBidAmount}</span>
      )}
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
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
          }}
          animate={{ 
            y: window.innerHeight + 20,
            rotate: 360,
            x: Math.random() * window.innerWidth,
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
  
  const { auction, currentBid, viewerCount, loading } = useAuction(auctionId);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Handle bid submission
  const handleBid = async () => {
    if (!user) {
      const result = await signInWithGoogle();
      if (!result.success) {
        alert('Please sign in to bid');
        return;
      }
      setUser(result.user);
      return;
    }

    const result = await submitBid(auctionId, user.uid);
    
    if (result.success) {
      // Check if user won (you can add more sophisticated win detection)
      if (auction?.status === 'ended' && auction?.currentBidder === user.uid) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      alert(result.message);
    }
  };

  const isUserHighestBidder = user && auction?.currentBidder === user.uid;

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-dibs-dark">
        <div className="text-white text-xl">Loading auction...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-dibs-dark">
      {/* Z-INDEX 0: Video Background */}
      <VideoPlayer streamConfig={auction?.streamConfig} />

      {/* Z-INDEX 10: Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Left: LIVE Badge + Viewer Count */}
        <div className="absolute top-6 left-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* LIVE Badge */}
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-bold text-sm">LIVE</span>
            </div>
            
            {/* Viewer Count */}
            <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-white text-sm">
                👁️ {viewerCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Bid Controls */}
        <div className="pointer-events-auto">
          {auction?.status === 'active' ? (
            <BidControls
              currentBid={currentBid || auction?.startingPrice || 0}
              currentItem={auction?.currentItem}
              onBid={handleBid}
              isUserHighestBidder={isUserHighestBidder}
              bidIncrement={auction?.bidIncrement || 50}
            />
          ) : (
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <div className="text-white text-xl font-semibold">
                {auction?.status === 'ended' ? '🎉 Auction Ended' : '⏳ Waiting for auction to start...'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confetti overlay */}
      <Confetti show={showConfetti} />

      {/* Admin Panel (hidden, tap top-right to reveal) */}
      <AdminPanel />
    </div>
  );
}

export default App;
