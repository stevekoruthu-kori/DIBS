import React, { useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID } from '../lib/zegoConfig';

let viewerSessionLock = false;

const LiveStreamPlayer = ({ streamId = HOST_STREAM_ID, roomId = ROOM_ID }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');
  
  // Use a sample video for demo purposes if Zego fails or for UI testing
  const DEMO_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-young-woman-showing-her-new-clothes-to-her-friends-40088-large.mp4";

  useEffect(() => {
    let isMounted = true;

    const detachHandlers = () => {
      zg.off('roomStreamUpdate', handleStreamUpdate);
      zg.off('playerStateUpdate', handlePlayerUpdate);
    };

    const playHostStream = async () => {
      try {
        const stream = await zg.startPlayingStream(streamId);
        if (!isMounted) {
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus('');
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        console.warn('startPlayingStream failed; waiting for host stream', err);
        setStatus('Waiting for host to go live...');
      }
    };

    const handleStreamUpdate = async (_roomID, updateType, streamList, _extra) => {
      if (!isMounted) {
        return;
      }
      if (updateType === 'ADD') {
        const hasHostStream = streamList.some(stream => stream.streamID === streamId);
        if (hasHostStream) {
          await playHostStream();
        }
      }
      if (updateType === 'DELETE') {
        const removedHost = streamList.some(stream => stream.streamID === streamId);
        if (removedHost) {
          setStatus('Host ended the stream');
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      }
    };

    const handlePlayerUpdate = (_streamId, state, error) => {
      if (!isMounted) {
        return;
      }
      if (state === 'PLAY_REQUESTING') {
        setStatus('Starting stream...');
      } else if (state === 'PLAYING') {
        setStatus('');
        setErrorDetails('');
      } else if (state === 'NO_PLAY') {
        setStatus('Unable to play stream');
        if (error) {
          setErrorDetails(`${error?.code ?? ''} ${error?.message ?? ''}`.trim());
        }
      }
    };

    const MAX_RETRIES = 3;

    const initViewer = async (attempt = 0) => {
      try {
        if (viewerSessionLock) {
          setStatus('Viewer already connected');
          return;
        }

        viewerSessionLock = true;
        setStatus('Joining room...');
        clearRetryTimer();
        detachHandlers();

        // Clean up previous session if any
        try {
          await zg.logoutRoom(roomId);
        } catch (e) {
          // ignore
        }

        await zg.loginRoom(roomId, VIEWER_TOKEN, { userID: VIEWER_USER_ID, userName: 'Viewer' });

        if (!isMounted) {
          viewerSessionLock = false;
          return;
        }

        retryCountRef.current = 0;
        setStatus('Waiting for host...');

        zg.on('roomStreamUpdate', handleStreamUpdate);
        zg.on('playerStateUpdate', handlePlayerUpdate);

        await playHostStream();
      } catch (error) {
        if (!isMounted) {
          viewerSessionLock = false;
          return;
        }
        console.error('Viewer init error:', error);
        viewerSessionLock = false;

        // Upper limit happens if the previous connection has not fully released yet.
        if (error?.code === 1002001 && attempt < MAX_RETRIES) {
          const nextAttempt = attempt + 1;
          setStatus(`Reconnecting... (attempt ${nextAttempt})`);
          setErrorDetails('Previous viewer session still closing. Retrying shortly.');
          clearRetryTimer();
          retryTimerRef.current = setTimeout(() => {
            if (isMounted) {
              initViewer(nextAttempt);
            }
          }, 1500);
          return;
        }

        setStatus('Connection failed');
        setErrorDetails(error?.message ?? '');
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
      } catch (e) {
        console.warn("Cleanup error", e);
      }
      viewerSessionLock = false;
    };
  }, [streamId, roomId]);
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

