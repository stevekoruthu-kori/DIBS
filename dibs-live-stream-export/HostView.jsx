import React, { useEffect, useRef, useState } from 'react';
import zg from './zegoEngine'; 
import { ROOM_ID, HOST_USER_ID, HOST_STREAM_ID, HOST_TOKEN, STATIC_TOKEN_MODE } from './zegoConfig';
import { db } from '../src/lib/firebase';
import { ref, set, remove } from 'firebase/database';

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
  const [status, setStatus] = useState("Ready to Stream");
  const [isLive, setIsLive] = useState(false);
ds
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
      
      // 5. Update Firebase
      await set(ref(db, 'current_stream'), {
        roomId: roomId,
        streamId: hostStreamId,
        hostId: hostUserId,
        status: 'live',
        startedAt: Date.now()
      });

      setStatus("🔴 LIVE - Broadcasting");
      hasPublishedRef.current = true;
      setIsLive(true);

    } catch (err) {
      console.error("🔴 Host Error");
      console.error("Error code:", err?.code);
      console.error("Error message:", err?.message || "Unknown error");
      
      const errorMsg = err?.code 
        ? `Error ${err.code}: ${err.message || 'Failed to start'}` 
        : "Failed to start stream";
      setStatus(errorMsg);
      setIsLive(false);
    } finally {
      initInProgressRef.current = false;
    }
  };

  const stopStream = async () => {
    try {
      if (hasPublishedRef.current) {
        zg.stopPublishingStream(hostStreamId);
        hasPublishedRef.current = false;
      }
      
      if (localStream.current) {
        zg.destroyStream(localStream.current);
        localStream.current = null;
      }

      if (hostVideoRef.current) {
        hostVideoRef.current.srcObject = null;
      }

      await zg.logoutRoom(roomId);
      
      // Remove from Firebase
      await remove(ref(db, 'current_stream'));
      
      setStatus("Stream Ended");
      setIsLive(false);
    } catch (err) {
      console.error("Error stopping stream:", err);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <video
        ref={hostVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Host Controls Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-50">
        {!isLive ? (
          <button
            onClick={startStream}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
          >
            Start Stream
          </button>
        ) : (
          <button
            onClick={stopStream}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
          >
            End Stream
          </button>
        )}
      </div>

      <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-lg text-white font-mono text-sm z-50">
        Status: {status}
      </div>
    </div>
  );
}

export default HostView;

