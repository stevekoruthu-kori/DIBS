import { useState } from 'react';
import { startAuction, stopAuction } from '../services/auctionService';

/**
 * Admin hook for controlling auctions
 * @returns {Object} Admin control functions and state
 */
export const useAdmin = () => {
  const [currentAuctionId, setCurrentAuctionId] = useState(null);
  const [streamConfig, setStreamConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Start a new auction
   * @param {Object} itemData - Item to auction
   */
  const handleStartAuction = async (itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { auctionId, streamConfig: createdStreamConfig } = await startAuction(itemData);
      setCurrentAuctionId(auctionId);
      setStreamConfig(createdStreamConfig);
      return { success: true, auctionId, streamConfig: createdStreamConfig };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Stop the current auction
   */
  const handleStopAuction = async () => {
    if (!currentAuctionId) {
      setError("No active auction to stop");
      return { success: false };
    }

    setLoading(true);
    setError(null);
    
    try {
      await stopAuction(currentAuctionId);
      setCurrentAuctionId(null);
      setStreamConfig(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    currentAuctionId,
    streamConfig,
    loading,
    error,
    startAuction: handleStartAuction,
    stopAuction: handleStopAuction
  };
};
