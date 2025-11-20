import { ref, runTransaction, set, update, get } from "firebase/database";
import { db, placeBid, subscribeToAuction } from "../lib/firebase";

/**
 * ENGINEER 2'S HOME - THE TRANSACTION LOGIC LAYER
 * This file handles all business logic for bidding
 */

/**
 * Validate and submit a bid
 * @param {string} auctionId 
 * @param {string} userId 
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const submitBid = async (auctionId, userId) => {
  try {
    // 1. Get current auction state
    const auctionRef = ref(db, `auctions/${auctionId}`);
    const snapshot = await get(auctionRef);
    const auction = snapshot.val();
    
    if (!auction) {
      return { success: false, message: "Auction not found" };
    }
    
    // 2. Validate auction is active
    if (auction.status !== "active") {
      return { success: false, message: "Auction is not active" };
    }
    
    // 3. Check user isn't already the highest bidder
    if (auction.currentBidder === userId) {
      return { success: false, message: "You're already the highest bidder!" };
    }
    
    // 4. Calculate new bid (current bid + increment)
    const currentBid = auction.currentBid || auction.startingPrice || 0;
    const bidIncrement = auction.bidIncrement || 50;
    const newBid = currentBid + bidIncrement;
    
    // 5. Submit the bid
    await placeBid(auctionId, newBid, userId);
    
    return { 
      success: true, 
      message: "Bid placed successfully!",
      newBid 
    };
    
  } catch (error) {
    console.error("Bid submission error:", error);
    return { 
      success: false, 
      message: "Failed to place bid. Please try again." 
    };
  }
};

/**
 * Get auction details (one-time fetch)
 * @param {string} auctionId 
 */
export const getAuctionDetails = async (auctionId) => {
  const auctionRef = ref(db, `auctions/${auctionId}`);
  const snapshot = await get(auctionRef);
  return snapshot.val();
};

/**
 * Calculate time remaining in auction
 * @param {number} endTime - Unix timestamp
 * @returns {string} Formatted time remaining
 */
export const getTimeRemaining = (endTime) => {
  const now = Date.now();
  const diff = endTime - now;
  
  if (diff <= 0) return "ENDED";
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// ========== ADMIN FUNCTIONS (Engineer 2 territory) ==========

/**
 * Start a new auction
 * @param {Object} itemData - Item details
 */
export const startAuction = async (itemData) => {
  const auctionId = `auction_${Date.now()}`;
  const auctionRef = ref(db, `auctions/${auctionId}`);

  const roomId = itemData?.roomId || `dibs-room-${auctionId}`;
  const hostStreamId = itemData?.hostStreamId || `${roomId}-host`;
  const hostUserId = itemData?.hostUserId || 'dibs-host';
  const viewerUserId = itemData?.viewerUserId || 'dibs-viewer';
  const streamConfig = {
    roomId,
    hostStreamId,
    hostUserId,
    viewerUserId,
    createdAt: Date.now()
  };
  
  await set(auctionRef, {
    status: "active",
    currentItem: itemData,
    currentBid: itemData.startPrice || 0,
    bidIncrement: itemData.bidIncrement || 50,
    startTime: Date.now(),
    endTime: Date.now() + (itemData.duration || 60000), // 60 seconds default
    currentBidder: null,
    viewers: 0,
    streamConfig
  });
  
  return { auctionId, streamConfig };
};

/**
 * Stop the current auction
 * @param {string} auctionId 
 */
export const stopAuction = async (auctionId) => {
  const auctionRef = ref(db, `auctions/${auctionId}`);
  await update(auctionRef, { 
    status: "ended",
    endTime: Date.now(),
    streamConfig: null
  });
};