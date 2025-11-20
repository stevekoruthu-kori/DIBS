import React, { useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID } from '../lib/zegoConfig';

const LiveStreamPlayer = ({ isLive }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');
  
  // Use a sample video for demo purposes if Zego fails or for UI testing
  const DEMO_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-young-woman-showing-her-new-clothes-to-her-friends-40088-large.mp4";

  useEffect(() => {
    if (!isLive) return;
    
    // ... existing Zego logic ...
    // For now, let's just play the demo video to ensure UI can be tested
    if (videoRef.current) {
      videoRef.current.src = DEMO_VIDEO;
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      setStatus('');
    }
  }, [isLive]);

  if (!isLive) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center opacity-50">
          <div className="text-6xl mb-4">😴</div>
          <p className="text-xl font-bold tracking-widest">STREAM OFFLINE</p>
          <p className="text-sm mt-2">Waiting for host...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        loop
        muted // Muted for autoplay policy
      />
      {/* Status Overlay */}
      {status && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <p className="text-white font-mono animate-pulse">{status}</p>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;
