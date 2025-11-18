import { ref, runTransaction, set, update } from "firebase/database";
import { db } from "../lib/firebase"; // Import from your lib

// 1. The Atomic Bid Function (From previous step)
export const placeBid = async (bidAmount, user) => {
  const liveAuctionRef = ref(db, 'live_auction');

  try {
    const result = await runTransaction(liveAuctionRef, (currentData) => {
      if (!currentData) return currentData;
      if (currentData.status !== "LIVE") throw new Error("Auction Closed");
      if (bidAmount <= currentData.current_bid) return; // Abort if too low

      // OPTIONAL: Anti-Sniping (Extend timer if <10s left)
      let newEndTime = currentData.timer_end_at;
      const timeLeft = currentData.timer_end_at - Date.now();
      if (timeLeft < 10000) { 
          newEndTime = Date.now() + 15000; 
      }

      return {
        ...currentData,
        current_bid: bidAmount,
        timer_end_at: newEndTime,
        highest_bidder: {
          uid: user.uid,
          name: user.displayName || "Anonymous"
        }
      };
    });

    return result.committed ? { success: true } : { success: false, reason: "OUTBID" };
  } catch (e) {
    console.error(e);
    return { success: false, reason: e.message };
  }
};

// 2. Admin Functions
export const startAuction = async (itemData) => {
  const liveRef = ref(db, 'live_auction');
  await set(liveRef, {
    status: "LIVE",
    current_item: itemData,
    current_bid: itemData.start_price,
    timer_end_at: Date.now() + 60000, // 60 Seconds
    highest_bidder: null
  });
};

export const stopAuction = async () => {
   const liveRef = ref(db, 'live_auction');
   await update(liveRef, { status: "SOLD" });
};