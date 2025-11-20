import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useNavigate } from 'react-router-dom'; // Use router to go to host screen

export const AdminPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [itemData, setItemData] = useState({
    name: '',
    startPrice: 100,
    bidIncrement: 50
  });

  const { startAuction, stopAuction, currentAuctionId, loading } = useAdmin();
  
  // Note: We use window.location to force a clean reload when going to host
  const goToHostConsole = () => {
      window.location.href = '/host';
  };

  const handleStart = async () => {
    await startAuction(itemData);
    // No alert needed, UI updates via hooks
  };

  const handleStop = async () => {
    await stopAuction();
  };

  return (
    <>
      {/* Hidden Activation Zone (Top Right) */}
      <div
        className="absolute top-0 right-0 w-20 h-20 z-50"
        onDoubleClick={() => setIsVisible(true)} 
        // Changed to double click to prevent accidental taps
      />

      {isVisible && (
        <div className="absolute top-0 right-0 bg-black/95 text-white p-6 rounded-bl-2xl z-50 max-w-sm border-l border-b border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-cyan-400">🔐 Admin Panel</h3>
            <button onClick={() => setIsVisible(false)} className="text-2xl text-gray-500">×</button>
          </div>

          {currentAuctionId ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg">
                <p className="text-green-400 text-sm font-bold">✓ Auction Active</p>
                <p className="text-xs text-gray-400 font-mono mt-1">{currentAuctionId}</p>
              </div>
              
              <button
                onClick={handleStop}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition"
              >
                {loading ? 'Stopping...' : 'Stop Auction'}
              </button>

              <div className="h-px bg-gray-800 my-4" />

              <button
                onClick={goToHostConsole}
                className="w-full bg-gray-800 border border-gray-700 text-white py-3 rounded-lg font-bold hover:border-cyan-400 transition"
              >
                Launch Video Studio ↗
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                value={itemData.name}
                onChange={(e) => setItemData({...itemData, name: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-sm focus:border-cyan-400 outline-none"
              />
              <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="Price"
                    value={itemData.startPrice}
                    onChange={(e) => setItemData({...itemData, startPrice: Number(e.target.value)})}
                    className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-sm"
                />
                <input
                    type="number"
                    placeholder="Inc."
                    value={itemData.bidIncrement}
                    onChange={(e) => setItemData({...itemData, bidIncrement: Number(e.target.value)})}
                    className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-sm"
                />
              </div>
              
              <button
                onClick={handleStart}
                disabled={loading || !itemData.name}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-lg font-bold mt-2 disabled:opacity-50 transition"
              >
                {loading ? 'Starting...' : 'Start Auction'}
              </button>

              <button
                onClick={goToHostConsole}
                className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300 underline"
              >
                Go to Host Studio without starting
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};