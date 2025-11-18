import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * BidControls - The main interaction component
 * ENGINEER 1'S FOCUS: TikTok-style UI with dopamine animations
 */

export const BidControls = ({ 
  currentBid, 
  currentItem, 
  onBid, 
  isUserHighestBidder,
  bidIncrement = 50 
}) => {
  const [previousBid, setPreviousBid] = useState(currentBid);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animation when bid changes
  useEffect(() => {
    if (currentBid !== previousBid && currentBid > 0) {
      setShouldAnimate(true);
      setPreviousBid(currentBid);
      
      // Reset animation after it completes
      setTimeout(() => setShouldAnimate(false), 300);
    }
  }, [currentBid, previousBid]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
      {/* Bottom gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent -z-10" />
      
      {/* Bid Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Item Thumbnail */}
          {currentItem?.image && (
            <img 
              src={currentItem.image} 
              alt={currentItem.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          
          {/* Item Info */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">
              {currentItem?.name || 'Current Item'}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-gray-400 text-sm">Current Bid</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentBid}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: shouldAnimate ? [1, 1.2, 1] : 1,
                    color: shouldAnimate ? ['#fff', '#ffd700', '#fff'] : '#fff'
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold text-white"
                >
                  ₹{currentBid}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* The Big Button */}
      <motion.button
        onClick={onBid}
        disabled={isUserHighestBidder}
        whileTap={{ scale: 0.95 }}
        className={`
          w-full py-6 rounded-2xl font-bold text-xl
          transition-all duration-200
          ${isUserHighestBidder 
            ? 'bg-green-500 text-white cursor-not-allowed' 
            : 'bg-dibs-accent text-white hover:bg-dibs-accent/90 active:scale-95'
          }
        `}
        style={{
          boxShadow: isUserHighestBidder 
            ? '0 0 30px rgba(34, 197, 94, 0.5)' 
            : '0 0 30px rgba(255, 51, 102, 0.6)'
        }}
      >
        {isUserHighestBidder ? (
          <span>✓ You're Winning!</span>
        ) : (
          <span>BID ₹{currentBid + bidIncrement}</span>
        )}
      </motion.button>

      {/* Tap hint (shows only on first render) */}
      <motion.p
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="text-center text-white/60 text-sm mt-3"
      >
        Tap to place your bid
      </motion.p>
    </div>
  );
};