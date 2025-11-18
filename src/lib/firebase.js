import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// ========== REALTIME SUBSCRIPTIONS ==========

/**
 * Subscribe to entire auction state
 * @param {string} auctionId 
 * @param {function} callback - Called with auction data on every update
 * @returns {function} Unsubscribe function
 */
export const subscribeToAuction = (auctionId, callback) => {
  const auctionRef = ref(db, `auctions/${auctionId}`);
  return onValue(auctionRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Subscribe ONLY to current bid (for dopamine animation)
 * @param {string} auctionId 
 * @param {function} callback - Called with bid amount on change
 * @returns {function} Unsubscribe function
 */
export const subscribeToCurrentBid = (auctionId, callback) => {
  const bidRef = ref(db, `auctions/${auctionId}/currentBid`);
  return onValue(bidRef, (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Subscribe to live viewer count
 * @param {string} auctionId 
 * @param {function} callback - Called with viewer count
 * @returns {function} Unsubscribe function
 */
export const subscribeToViewerCount = (auctionId, callback) => {
  const viewersRef = ref(db, `auctions/${auctionId}/viewers`);
  return onValue(viewersRef, (snapshot) => {
    callback(snapshot.val() || 0);
  });
};

// ========== WRITE OPERATIONS ==========

/**
 * Place a bid (Engineer 2 will call this from auctionService.js)
 * @param {string} auctionId 
 * @param {number} bidAmount 
 * @param {string} userId 
 */
export const placeBid = async (auctionId, bidAmount, userId) => {
  const updates = {};
  updates[`auctions/${auctionId}/currentBid`] = bidAmount;
  updates[`auctions/${auctionId}/currentBidder`] = userId;
  updates[`auctions/${auctionId}/lastBidTime`] = Date.now();
  
  return update(ref(db), updates);
};

/**
 * Increment viewer count when user joins
 * @param {string} auctionId 
 */
export const joinAuction = async (auctionId) => {
  const viewersRef = ref(db, `auctions/${auctionId}/viewers`);
  const snapshot = await get(viewersRef);
  const currentCount = snapshot.val() || 0;
  return set(viewersRef, currentCount + 1);
};

/**
 * Decrement viewer count when user leaves
 * @param {string} auctionId 
 */
export const leaveAuction = async (auctionId) => {
  const viewersRef = ref(db, `auctions/${auctionId}/viewers`);
  const snapshot = await get(viewersRef);
  const currentCount = snapshot.val() || 0;
  return set(viewersRef, Math.max(0, currentCount - 1));
};
