import { useEffect, useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { fetchZegoToken, shouldUseDynamicTokens } from '../services/streamTokenService';
import HostView from '../../dibs-live-stream-export/HostView.jsx';

/**
 * AdminPanel - Hidden host controls
 * Press and hold top-right corner to reveal
 */

export const AdminPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [itemData, setItemData] = useState({
    name: '',
    startPrice: 100,
    bidIncrement: 50,
    duration: 60000 // 60 seconds
  });
  const [hostConsoleVisible, setHostConsoleVisible] = useState(false);

  const { startAuction, stopAuction, currentAuctionId, streamConfig, loading } = useAdmin();

  const handleStart = async () => {
    const result = await startAuction(itemData);
    if (result.success) {
      alert(`Auction started!\nID: ${result.auctionId}\nRoom: ${result.streamConfig?.roomId}`);
    }
  };

  const handleStop = async () => {
    const result = await stopAuction();
    if (result.success) {
      alert('Auction stopped!');
    }
  };

  useEffect(() => {
    if (!currentAuctionId) {
      setHostConsoleVisible(false);
    }
  }, [currentAuctionId]);

  return (
    <>
      {/* Secret activation zone */}
      <div
        className="absolute top-0 right-0 w-20 h-20 z-50"
        onTouchStart={() => setIsVisible(true)}
        onClick={() => setIsVisible(!isVisible)}
      />

      {/* Admin Panel */}
      {isVisible && (
        <div className="absolute top-0 right-0 bg-black/95 text-white p-6 rounded-bl-2xl z-50 max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">🔐 Admin Panel</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-2xl"
            >
              ×
            </button>
          </div>

          {currentAuctionId ? (
            <div>
              <p className="text-green-400 mb-2">
                ✓ Auction Active: {currentAuctionId}
              </p>
              {streamConfig?.roomId && (
                <p className="text-sm text-white/70 mb-4">
                  Room ID: <span className="font-mono">{streamConfig.roomId}</span>
                </p>
              )}
              <button
                onClick={handleStop}
                disabled={loading}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? 'Stopping...' : 'Stop Auction'}
              </button>
              <button
                onClick={() => setHostConsoleVisible(true)}
                className="w-full mt-3 bg-dibs-accent text-black py-2 rounded-lg font-semibold"
              >
                Launch Host Console
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                value={itemData.name}
                onChange={(e) => setItemData({...itemData, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Start Price"
                value={itemData.startPrice}
                onChange={(e) => setItemData({...itemData, startPrice: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Bid Increment"
                value={itemData.bidIncrement}
                onChange={(e) => setItemData({...itemData, bidIncrement: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              />
              <button
                onClick={handleStart}
                disabled={loading || !itemData.name}
                className="w-full bg-dibs-accent text-white py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Starting...' : 'Start Auction'}
              </button>
            </div>
          )}
        </div>
      )}

      {hostConsoleVisible && streamConfig?.roomId && (
        <div className="fixed inset-0 z-[60] bg-black">
          <button
            type="button"
            onClick={() => setHostConsoleVisible(false)}
            className="absolute top-4 right-4 z-[70] bg-white/10 text-white px-4 py-2 rounded-full border border-white/20"
          >
            Close Host Console
          </button>
          <HostView
            roomId={streamConfig.roomId}
            hostStreamId={streamConfig.hostStreamId}
            hostUserId={streamConfig.hostUserId}
            fetchToken={shouldUseDynamicTokens ? fetchZegoToken : undefined}
            displayName="Admin Host"
          />
        </div>
      )}
    </>
  );
};
