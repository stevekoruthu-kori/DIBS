import React, { useEffect, useRef, useState } from 'react';
import zg from './zegoEngine'; 
import { ROOM_ID, HOST_USER_ID, HOST_STREAM_ID, HOST_TOKEN, STATIC_TOKEN_MODE } from './zegoConfig';

function HostView({
  roomId = ROOM_ID,
  hostUserId = HOST_USER_ID,
  hostStreamId = HOST_STREAM_ID,
  fetchToken,
  displayName = 'Host'
}) {
  const localStream = useRef(null);
  const hostVideoRef = useRef(null);
  const initInProgressRef = useRef(false);
  const hasPublishedRef = useRef(false);
  const [status, setStatus] = useState("Initializing...");

  const resolveToken = async () => {
    if (typeof fetchToken === 'function') {
      const tokenResult = await fetchToken({
        role: 'host',
        userId: hostUserId,
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

    if (STATIC_TOKEN_MODE && HOST_TOKEN) {
      return HOST_TOKEN;
    }

    throw new Error('Missing host token. Provide fetchToken prop or VITE_ZEGO_HOST_TOKEN.');
  };

  const startStream = async () => {
    if (initInProgressRef.current) {
      console.log("Host initialization already running. Skipping duplicate call.");
      return;
    }

    initInProgressRef.current = true;

    try {
      if (localStream.current) {
        console.log("Local stream already exists. Reusing current stream.");
        setStatus("🔴 LIVE - Broadcasting");
        return;
      }

      // Clean logout first
      try {
        await zg.logoutRoom(roomId);
      } catch (e) {
        console.log("No previous session to logout");
      }

      // 1. Log in
      console.log(`🔐 Host logging in: ${hostUserId}`);
      setStatus("Logging in...");

      const authToken = await resolveToken();
      
      try {
        await zg.loginRoom(
          roomId, 
          authToken, 
          { userID: hostUserId, userName: displayName },
          { userUpdate: true }
        );
        console.log("✅ Login successful");
        setStatus("Logged in. Starting camera...");
      } catch (loginErr) {
        if (loginErr.code === 1002001) {
          console.warn("⚠️ Already logged in");
        } else if (loginErr.code === 1100002) {
          console.error("🔴 Network timeout - Check your connection");
          setStatus("Connection timeout. Check network/tokens.");
          return;
        } else {
          throw loginErr;
        }
      }

      // 2. Create stream
      console.log("📹 Creating stream...");
      setStatus("Accessing camera...");
      localStream.current = await zg.createStream({ 
        camera: { 
          audio: true, 
          video: true 
        } 
      });

      // 3. Play Local
      const localVideo = hostVideoRef.current;
      if (localVideo) {
        localVideo.srcObject = localStream.current;
        localVideo.muted = true; // host never hears their own stream
        localVideo.volume = 0;
        try {
          await localVideo.play();
        } catch (playErr) {
          console.warn("Unable to autoplay local preview: " + (playErr?.message || playErr));
        }
        setStatus("Camera ready. Publishing...");
      }

      // 4. Publish
      console.log(`📤 Publishing: ${hostStreamId}`);
      await zg.startPublishingStream(hostStreamId, localStream.current);
      console.log("✅ Host is live!");
      setStatus("🔴 LIVE - Broadcasting");
      hasPublishedRef.current = true;

    } catch (err) {
      console.error("🔴 Host Error");
      console.error("Error code:", err?.code);
      console.error("Error message:", err?.message || "Unknown error");
      
      const errorMsg = err?.code 
        ? `Error ${err.code}: ${err.message || 'Failed to start'}` 
        : "Failed to start stream";
      setStatus(errorMsg);
    } finally {
      initInProgressRef.current = false;
    }
  };

  useEffect(() => {
    startStream();

    return () => {
      if (hasPublishedRef.current) {
        try {
          zg.stopPublishingStream(hostStreamId);
        } catch (e) {
          console.warn("Failed to stop publishing cleanly: " + (e?.message || e));
        }
        hasPublishedRef.current = false;
      }

      if (hostVideoRef.current) {
        hostVideoRef.current.srcObject = null;
      }

      if (localStream.current) {
        try {
          localStream.current.getTracks().forEach((track) => track.stop());
        } catch (streamErr) {
          console.warn("Failed to stop local tracks: " + (streamErr?.message || streamErr));
        }
        try {
          zg.destroyStream(localStream.current);
        } catch (destroyErr) {
          console.warn("Failed to destroy local stream: " + (destroyErr?.message || destroyErr));
        }
        localStream.current = null;
      }

      try {
        zg.logoutRoom(roomId);
      } catch (logoutErr) {
        console.warn("Logout error: " + (logoutErr?.message || logoutErr));
      }
      console.log("🏃 Host logged out");
    };
  }, []);

  return (
    <div>
      <video
        ref={hostVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          backgroundColor: '#000'
        }}
      ></video>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '24px',
          color: '#fff',
          maxWidth: '480px'
        }}
      >
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '8px 14px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '999px',
            fontSize: '0.9rem',
            display: 'inline-block',
            marginBottom: '16px'
          }}
        >
          Host Status: {status}
        </div>
        <h1>Host View</h1>
        <p>Camera preview is muted locally to prevent echo.</p>
      </div>
    </div>
  );
}

export default HostView;
