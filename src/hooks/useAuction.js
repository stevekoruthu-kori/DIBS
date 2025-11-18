import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";

export const useAuction = () => {
  const [auctionState, setAuctionState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const liveRef = ref(db, 'live_auction');
    
    // The Listener: Fires every time the DB changes
    const unsubscribe = onValue(liveRef, (snapshot) => {
      const data = snapshot.val();
      setAuctionState(data);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { auctionState, loading };
};