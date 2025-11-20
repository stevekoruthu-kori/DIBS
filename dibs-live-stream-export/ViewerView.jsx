import React, { useCallback, useEffect, useRef, useState } from 'react';
import zg from './zegoEngine'; 
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID, STATIC_TOKEN_MODE } from './zegoConfig';

function ViewerView({
  roomId = ROOM_ID,
  hostStreamId = HOST_STREAM_ID,
  viewerUserId = VIEWER_USER_ID,
  fetchToken,
  displayName = 'Viewer'
}) {
  const remoteVideoRef = useRef(null);
  const streamIDRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const initInProgressRef = useRef(false);
  const retryTimerRef = useRef(null);
  const pointerUnlockHandlerRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [isMuted, setIsMuted] = useState(false);
  const [isStreamVisible, setIsStreamVisible] = useState(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);

  const resolveToken = useCallback(async () => {
    if (typeof fetchToken === 'function') {
      const tokenResult = await fetchToken({
        role: 'viewer',
        userId: viewerUserId,
        roomId
      });
      if (typeof tokenResult === 'string') {
        return tokenResult;
      }
      if (tokenResult?.token) {
        return tokenResult.token;
      }
      throw new Error('Token fetcher did not return a token string');
    }

    if (STATIC_TOKEN_MODE && VIEWER_TOKEN) {
      return VIEWER_TOKEN;
    }

    throw new Error('Missing viewer token. Provide fetchToken prop or VITE_ZEGO_VIEWER_TOKEN.');
  }, [fetchToken, viewerUserId, roomId]);

  // Debugging check to ensure new code is loaded
  useEffect(() => {
    console.log("✅ VERSION 5 LOADED - If you see this, the code updated!");
  }, []);

  const handleStreamUpdate = useCallback(async (roomID, updateType, streamList) => {
    console.log(`📡 Stream update - Type: ${updateType}`);

    if (updateType === 'ADD') {
      const hostStream = streamList.find((s) => s.streamID === hostStreamId);

      if (!hostStream) {
        console.warn("⚠️ Host stream not found in stream list");
        return;
      }

      const videoElement = remoteVideoRef.current;
      if (!videoElement) {
        console.error("❌ Remote video element missing");
        return;
      }

      try {
        // Stop any existing stream before starting a new one to keep things tidy
        if (streamIDRef.current && streamIDRef.current !== hostStream.streamID) {
          try {
            zg.stopPlayingStream(streamIDRef.current);
          } catch (stopErr) {
            console.warn("Could not stop previous stream: " + (stopErr?.message || stopErr));
          }
        }

        streamIDRef.current = hostStream.streamID;
        console.log("🎬 Starting to play remote stream...");

        const remoteStream = await zg.startPlayingStream(hostStream.streamID);
        remoteStreamRef.current = remoteStream;

        videoElement.srcObject = remoteStream;
        videoElement.playsInline = true;
        videoElement.muted = false;

        try {
          await videoElement.play();
          setIsStreamVisible(true);
          setStatus("Playing Stream (audio on)");
          console.log("✅ Remote stream is playing with audio");
          delete videoElement.dataset.audioBlocked;
          setIsAudioBlocked(false);
          window.dispatchEvent(new CustomEvent('viewer-audio-enabled'));
          setIsMuted(false);
        } catch (playErr) {
          console.warn("Autoplay with sound was blocked: " + (playErr?.message || playErr));
          setIsStreamVisible(true);
          setStatus("Awaiting user interaction to enable audio.");

          try {
            videoElement.muted = true;
            setIsMuted(true);
            await videoElement.play();
            console.log("▶️ Video playing silently while awaiting user action");
          } catch (mutedErr) {
            console.warn("Silent autoplay also failed: " + (mutedErr?.message || mutedErr));
          }

          videoElement.dataset.audioBlocked = 'true';
          setIsAudioBlocked(true);
          window.dispatchEvent(new CustomEvent('viewer-audio-blocked'));
          return;
        }
      } catch (err) {
        const errCode = err?.code || 'undefined';
        const errMsg = err?.msg || err?.message || 'unknown';
        console.error("🔴 Play Error (code " + errCode + "): " + errMsg);
        setStatus("Play failed (" + errCode + ")");
      }
    } else if (updateType === 'DELETE') {
      const deletedHostStream = streamList.find((s) => s.streamID === hostStreamId);
      if (!deletedHostStream) {
        return;
      }

      console.log("🔴 Host stopped streaming");

      if (streamIDRef.current) {
        try {
          zg.stopPlayingStream(streamIDRef.current);
        } catch (stopErr) {
          console.warn("Failed to stop stream cleanly: " + (stopErr?.message || stopErr));
        }
        streamIDRef.current = null;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
        remoteVideoRef.current.muted = false;
        delete remoteVideoRef.current.dataset.audioBlocked;
      }

      setIsStreamVisible(false);
      setIsMuted(false);
      setStatus("Host stopped streaming");
      setIsAudioBlocked(false);
    }
  }, [hostStreamId]);

  const handleEnableAudio = useCallback(async () => {
    const videoElement = remoteVideoRef.current;
    if (!videoElement) {
      return false;
    }

    try {
      videoElement.muted = false;
      const playResult = videoElement.play();

      if (playResult instanceof Promise) {
        await playResult;
      }

      setStatus("Playing Stream (audio on)");
      setIsMuted(false);
      delete videoElement.dataset.audioBlocked;
      window.dispatchEvent(new CustomEvent('viewer-audio-enabled'));
      setIsAudioBlocked(false);
      return true;
    } catch (err) {
      console.error("Failed to enable audio: " + (err?.message || err));
      setStatus("Audio blocked. Please allow sound in your browser.");
      setIsAudioBlocked(true);
      return false;
    }
  }, [setStatus]);

  useEffect(() => {
    if (!isAudioBlocked) {
      if (pointerUnlockHandlerRef.current) {
        window.removeEventListener('pointerdown', pointerUnlockHandlerRef.current);
        pointerUnlockHandlerRef.current = null;
      }
      return;
    }

    const handler = async () => {
      pointerUnlockHandlerRef.current = null;
      const enabled = await handleEnableAudio();
      if (!enabled) {
        setIsAudioBlocked(true);
      }
    };

    pointerUnlockHandlerRef.current = handler;
    window.addEventListener('pointerdown', handler, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handler);
      if (pointerUnlockHandlerRef.current === handler) {
        pointerUnlockHandlerRef.current = null;
      }
    };
  }, [isAudioBlocked, handleEnableAudio]);

  useEffect(() => {
    window.__dibsEnableViewerAudio = handleEnableAudio;
    return () => {
      delete window.__dibsEnableViewerAudio;
    };
  }, [handleEnableAudio]);

  useEffect(() => {
    let isMounted = true;
    const startViewer = async () => {
      if (initInProgressRef.current) {
        console.log("Viewer initialization already in progress. Skipping duplicate call.");
        return;
      }

      initInProgressRef.current = true;

      try {
        // Clean logout first
        try {
          await zg.logoutRoom(roomId);
        } catch {
          console.log("No previous session to logout");
        }

        // Setup Listener
        zg.off('roomStreamUpdate', handleStreamUpdate);
        zg.on('roomStreamUpdate', handleStreamUpdate);

        // Login with retry logic
        console.log(`🔐 Logging in as ${viewerUserId}...`);
        setStatus("Connecting to server...");
        
        try {
            const authToken = await resolveToken();
            await zg.loginRoom(
              roomId, 
              authToken, 
              { userID: viewerUserId, userName: displayName },
              { userUpdate: true }
            );
            
            console.log("✅ Login successful");
            if (isMounted) setStatus("Logged in. Waiting for Host...");
            
        } catch (loginErr) {
            const errCode = loginErr?.code || 'undefined';
            console.error("Login error code: " + errCode);
            
            if (loginErr.code === 1002001) {
                console.warn("⚠️ Already logged in");
                if (isMounted) setStatus("Logged in (Resumed).");
            } else if (loginErr.code === 1100002) {
                // Network timeout - retry
                console.error("🔴 Network timeout. Retrying in 3 seconds...");
                if (isMounted) setStatus("Connection timeout. Retrying...");
                
                if (retryTimerRef.current) {
                  clearTimeout(retryTimerRef.current);
                }

                retryTimerRef.current = setTimeout(() => {
                  if (isMounted) startViewer();
                }, 3000);
                return;
            } else {
                throw loginErr; 
            }
        }

      } catch (err) {
        console.error("🔴 Viewer Init Error");
        const errCode = err?.code || 'undefined';
        const errMsg = err?.message || 'unknown';
        console.error("Error code: " + errCode);
        console.error("Error message: " + errMsg);
        
        if (isMounted) {
          const errorMsg = err?.code ? `Connection Failed (Error ${err.code})` : "Connection Failed";
          setStatus(errorMsg + " - Check your network or tokens");
        }
      } finally {
        initInProgressRef.current = false;
      }
    };

    startViewer();

    return () => {
      isMounted = false;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      zg.off('roomStreamUpdate', handleStreamUpdate);
      if (streamIDRef.current) {
        try {
          zg.stopPlayingStream(streamIDRef.current);
        } catch (stopErr) {
          console.warn("Stop stream on cleanup failed: " + (stopErr?.message || stopErr));
        }
        streamIDRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
        remoteVideoRef.current.muted = false;
        delete remoteVideoRef.current.dataset.audioBlocked;
      }
      setIsAudioBlocked(false);
      setIsMuted(false);
      setIsStreamVisible(false);
      try {
          zg.logoutRoom(roomId);
      } catch {
        /* ignore */
      }
    };
  }, [roomId, viewerUserId, displayName, handleStreamUpdate, resolveToken]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000'
    }}>
      <video
        id="viewer-video"
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted={isMuted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      ></video>

      <div className="viewer-overlay">
        <div className="viewer-top">
          <span className="status-chip">{status}</span>
        </div>

        <div className="viewer-bottom">
          <div>
            <h1 className="viewer-title">Live Auction</h1>
            {!isStreamVisible && <p className="viewer-message">Waiting for host to go live…</p>}
            {isStreamVisible && isAudioBlocked && (
              <p className="viewer-message">Tap unmute or interact with the screen to hear audio.</p>
            )}
          </div>

          <button
            type="button"
            className="mute-button"
            onClick={async () => {
              const videoElement = remoteVideoRef.current;
              if (!videoElement) {
                return;
              }

              if (isMuted) {
                const enabled = await handleEnableAudio();
                if (!enabled) {
                  return;
                }
              } else {
                videoElement.muted = true;
                setIsMuted(true);
                setIsAudioBlocked(false);
                delete videoElement.dataset.audioBlocked;
                window.dispatchEvent(new CustomEvent('viewer-audio-muted'));
                setStatus("Audio muted");
                return;
              }

              setStatus("Playing Stream (audio on)");
            }}
          >
            {isMuted ? 'Unmute 🔊' : 'Mute 🔇'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewerView;
