import { useState, useEffect } from 'react';
import { 
  subscribeToAuction, 
  subscribeToCurrentBid, 
  subscribeToViewerCount,
  joinAuction,
  leaveAuction 
} from '../lib/firebase';

/**
 * REACT STATE ADAPTER - Subscribe to live auction data
 * @param {string} auctionId 
 * @returns {Object} Live auction state
 */
export const useAuction = (auctionId) => {
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auctionId) return;

    // Join auction (increment viewer count)
    joinAuction(auctionId);

    // Subscribe to full auction data
    const unsubAuction = subscribeToAuction(auctionId, (data) => {
      setAuction(data);
      setLoading(false);
    });

    // Subscribe to current bid (for dopamine animation)
    const unsubBid = subscribeToCurrentBid(auctionId, (bid) => {
      setCurrentBid(bid);
    });

    // Subscribe to viewer count
    const unsubViewers = subscribeToViewerCount(auctionId, (count) => {
      setViewerCount(count);
    });

    // Cleanup: Leave auction and unsubscribe
    return () => {
      leaveAuction(auctionId);
      unsubAuction();
      unsubBid();
      unsubViewers();
    };
  }, [auctionId]);

  return { 
    auction, 
    currentBid, 
    viewerCount, 
    loading 
  };
};