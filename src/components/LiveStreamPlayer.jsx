import React, { useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID } from '../lib/zegoConfig';

let viewerSessionLock = false;

const LiveStreamPlayer = ({ streamId = HOST_STREAM_ID, roomId = ROOM_ID }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [showPlayButton, setShowPlayButton] = useState(false);
  const retryTimerRef = useRef(null);

  // Helper to clear timers safely
  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const detachHandlers = () => {
      zg.off('roomStreamUpdate', handleStreamUpdate);
      zg.off('playerStateUpdate', handlePlayerUpdate);
    };

    const playHostStream = async () => {
      try {
        // CHECK: If video is already playing, DO NOT restart or change status
        if (videoRef.current && !videoRef.current.paused && videoRef.current.srcObject) {
            setStatus('');
            return;
        }

        const stream = await zg.startPlayingStream(streamId);
        
        if (!isMounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // FIX 1: Clear text immediately when stream attaches (don't wait for play)
          setStatus(''); 
          
          try {
            await videoRef.current.play();
            setShowPlayButton(false);
          } catch (autoplayError) {
            console.log("Autoplay blocked - showing manual play button");
            setShowPlayButton(true);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        
        const errorCode = err?.code || 0;
        
        // FIX 2: SILENT HANDLING (No Alerts)
        // 1004/1004020 = Host offline
        // 1100002 = Network Timeout (flaky connection)
        if (errorCode === 1004 || errorCode === 1004020 || errorCode === 1100002) {
            setStatus('Waiting for host to go live...');
        } else {
            console.warn('Stream Error:', err);
            setStatus('Connecting...');
        }
      }
    };

    const handleStreamUpdate = async (_roomID, updateType, streamList) => {
      if (!isMounted) return;
      
      if (updateType === 'ADD') {
        const hasHostStream = streamList.some(stream => stream.streamID === streamId);
        if (hasHostStream) {
          // RACE CONDITION FIX: Don't show "Loading" if we are already watching!
          if (videoRef.current && !videoRef.current.paused) {
              setStatus('');
              return;
          }
          setStatus('Host detected. Loading...');
          await playHostStream();
        }
      }
      
      if (updateType === 'DELETE') {
        const removedHost = streamList.some(stream => stream.streamID === streamId);
        if (removedHost) {
          setStatus('Host ended the stream');
          if (videoRef.current) videoRef.current.srcObject = null;
        }
      }
    };

    const handlePlayerUpdate = (_streamId, state, error) => {
        // Log internal state only, no UI updates to prevent flickering
        console.log(`Player State: ${state}`);
    };

    const initViewer = async () => {
      try {
        if (viewerSessionLock) return;
        viewerSessionLock = true;

        setStatus('Joining room...');
        detachHandlers();

        try { await zg.logoutRoom(roomId); } catch (e) {}

        await zg.loginRoom(roomId, VIEWER_TOKEN, { userID: VIEWER_USER_ID, userName: 'Viewer' });

        if (!isMounted) {
          viewerSessionLock = false;
          return;
        }

        zg.on('roomStreamUpdate', handleStreamUpdate);
        zg.on('playerStateUpdate', handlePlayerUpdate);

        await playHostStream();

      } catch (error) {
        console.error('Viewer init error:', error);
        setStatus('Waiting for connection...');
        
        // Silent Retry Logic
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => { 
            if(isMounted) initViewer(); 
        }, 3000);
      } finally {
        viewerSessionLock = false;
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      clearRetryTimer();
      detachHandlers();
      try {
        zg.stopPlayingStream(streamId);
        zg.logoutRoom(roomId);
      } catch (e) {}
      viewerSessionLock = false;
    };
  }, [streamId, roomId]);

  // --- UI EVENTS TO FORCE TEXT REMOVAL ---
  const handleVideoEvent = () => {
      // FIX 3: Force clear status whenever video shows life
      setStatus('');
      setShowPlayButton(false);
  };

  const handleManualPlay = () => {
      if (videoRef.current) {
          videoRef.current.play();
          videoRef.current.muted = false; // Unmute when user clicks
      }
  };

  return (
    <div className="w-full h-full bg-black relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={true} // Start muted for autoplay success
        // Multiple triggers to ensure "Waiting" text disappears
        onPlaying={handleVideoEvent}
        onLoadedData={handleVideoEvent} 
        onProgress={handleVideoEvent}
        onCanPlay={handleVideoEvent}
      />
      
      {/* Status Overlay */}
      {status && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
          <p className="text-white/90 font-mono text-sm font-bold bg-black/60 px-4 py-2 rounded-full animate-pulse">
            {status}
          </p>
        </div>
      )}

      {/* Play Button (Only appears if autoplay fails) */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40">
            <button 
                onClick={handleManualPlay}
                className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg"
            >
                Tap to Watch Live
            </button>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;