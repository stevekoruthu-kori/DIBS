import { useAuction } from "../hooks/useAuction";
import { placeBid } from "../services/auctionService";
import { auth } from "../lib/firebase"; // Assuming auth is handled

export default function BidControls() {
  const { auctionState, loading } = useAuction();

  if (loading) return <div>Loading...</div>;
  if (!auctionState || auctionState.status !== "LIVE") return <div className="text-white">Waiting for Host...</div>;

  const currentPrice = auctionState.current_bid;
  const nextBid = currentPrice + 50;

  const handleBid = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please Login!");
    
    // Optimistic UI update could happen here, but for safety we wait for DB
    const result = await placeBid(nextBid, user);
    if (!result.success) {
        // Add a "Shake" animation or Toast here
        console.log("Bid Failed:", result.reason);
    }
  };

  return (
    <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent z-50">
      
      {/* Price Display */}
      <div className="text-center mb-4">
        <p className="text-gray-300 text-sm">Current Bid</p>
        <h1 className="text-4xl font-bold text-yellow-400 transition-all duration-100">
            ₹{currentPrice}
        </h1>
        <p className="text-xs text-gray-400">
            Highest: {auctionState.highest_bidder?.name || "No Bids"}
        </p>
      </div>

      {/* The Big Button */}
      <button 
        onClick={handleBid}
        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-full text-xl active:scale-95 transition-transform shadow-lg shadow-indigo-500/50"
      >
        BID ₹{nextBid}
      </button>
    </div>
  );
}