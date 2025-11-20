import React, { useCallback, useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, HOST_TOKEN, HOST_USER_ID } from '../lib/zegoConfig';

const HostScreen = () => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const [status, setStatus] = useState('Ready to start');
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const roomId = ROOM_ID;
  const hostStreamId = HOST_STREAM_ID;
  const hostUserId = HOST_USER_ID;
  const canStart = !isLive && !isStarting;

  const cleanupLocalStream = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      try {
        zg.destroyStream(stream);
      } catch (destroyError) {
        console.warn('destroyStream warning:', destroyError);
      }
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, []);

  const startHosting = async () => {
    if (!canStart) {
      return;
    }

    try {
      setError(null);
      setIsStarting(true);
      setStatus('Checking requirements...');
      const result = await zg.checkSystemRequirements();
      console.log('System requirements:', result);

      if (!result.webRTC) {
        throw new Error('WebRTC is not supported in this browser.');
      }

      setStatus('Connecting to room...');
      await zg.loginRoom(roomId, HOST_TOKEN, { userID: hostUserId, userName: 'Host' });

      setStatus('Accessing camera & mic...');
      const localStream = await zg.createStream({
        camera: {
          video: true,
          audio: true,
        },
      });

      localStreamRef.current = localStream;
      setIsMuted(false);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      setStatus('Publishing stream...');
      await zg.startPublishingStream(hostStreamId, localStream);

      setIsLive(true);
      setStatus('Live');
    } catch (err) {
      console.error('Error hosting:', err);
      setError(err.message || JSON.stringify(err));
      setStatus(`Error: ${err.message || 'Unknown issue'}`);
      cleanupLocalStream();
      setIsLive(false);
      setIsMuted(false);
    } finally {
      setIsStarting(false);
    }
  };

  const stopHosting = async () => {
    if (isStopping) {
      return;
    }

    if (!isLive && !localStreamRef.current) {
      return;
    }

    try {
      setError(null);
      setIsStopping(true);
      setStatus('Ending stream...');

      try {
        await zg.stopPublishingStream(hostStreamId);
      } catch (publishError) {
        console.warn('stopPublishingStream warning:', publishError);
      }

      try {
        await zg.logoutRoom(roomId);
      } catch (logoutError) {
        console.warn('logoutRoom warning:', logoutError);
      }

      cleanupLocalStream();
      setIsLive(false);
      setIsMuted(false);
      setStatus('Ready to start');
    } catch (err) {
      console.error('Error stopping host stream:', err);
      setError(err.message || JSON.stringify(err));
      setStatus(`Error: ${err.message || 'Unable to end stream'}`);
    } finally {
      setIsStopping(false);
    }
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream || !(stream instanceof MediaStream)) {
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      setStatus('No audio track available');
      return;
    }

    const nextMuted = !isMuted;
    audioTracks.forEach(track => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
    setStatus(nextMuted ? 'Live (muted)' : 'Live');
  };

  useEffect(() => {
    const handleDisconnect = (error) => {
      console.warn('Host room state changed:', error);
      if (error?.errorCode) {
        setStatus(`Disconnected (${error.errorCode})`);
        setError(`Room connection issue: ${error.errorCode} ${error.errorMessage || ''}`.trim());
      }
      setIsLive(false);
      cleanupLocalStream();
    };

    zg.on('roomStateUpdate', (_roomId, state, error) => {
      if (state === 'DISCONNECTED' || state === 'CONNECT_FAILED') {
        handleDisconnect(error);
      }
    });

    return () => {
      zg.off('roomStateUpdate');
      try {
        zg.stopPublishingStream(hostStreamId);
      } catch (publishError) {
        console.warn('Cleanup stopPublishingStream warning:', publishError);
      }

      try {
        zg.logoutRoom(roomId);
      } catch (logoutError) {
        console.warn('Cleanup logoutRoom warning:', logoutError);
      }

      cleanupLocalStream();
    };
  }, [cleanupLocalStream, hostStreamId, roomId]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050A1A] via-[#060F21] to-[#02060F] text-white flex flex-col font-urbanist">
      <header className="px-10 pt-10 pb-6 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">DIBS LIVE STUDIO</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.35)' }}>
              Host Control Center
            </h1>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : status.startsWith('Error') ? 'bg-amber-400' : 'bg-slate-600'}`} />
              <span>{status}</span>
            </div>
            {error && (
              <div className="text-xs text-amber-300 bg-amber-400/10 border border-amber-500/40 rounded-lg px-4 py-2 max-w-xl">
                <span className="font-semibold uppercase tracking-widest mr-2">Error</span>
                {error}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>Room: {roomId}</span>
            <span>Stream: {hostStreamId}</span>
            <span>Host ID: {hostUserId}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={startHosting}
            disabled={!canStart}
            className="px-5 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-[#00F0FF] to-[#00FFA3] shadow-[0_0_25px_rgba(0,240,255,0.45)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isStarting ? 'Starting...' : 'Start Stream'}
          </button>
          <button
            onClick={stopHosting}
            disabled={(!isLive && !localStreamRef.current) || isStopping}
            className="px-5 py-3 rounded-full font-semibold bg-gradient-to-r from-[#FF3860] to-[#FF5D8F] text-white shadow-[0_0_25px_rgba(255,56,96,0.45)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isStopping ? 'Ending...' : 'End Stream'}
          </button>
          <button
            onClick={toggleMute}
            disabled={!isLive}
            className="px-5 py-3 rounded-full font-semibold border border-slate-600 text-slate-200 bg-[#0B162E] hover:border-[#00F0FF] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isMuted ? 'Unmute Mic' : 'Mute Mic'}
          </button>
        </div>
      </header>

      <main className="flex-1 px-10 pb-12 flex flex-col lg:flex-row gap-10">
        <section className="flex-1">
          <div className="relative h-full min-h-[420px] rounded-[32px] border border-[#1A2647] bg-[#0B1326] overflow-hidden shadow-[0_0_45px_rgba(3,10,29,0.6)]">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover bg-black"
            />

            <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 rounded-full bg-[#101B34]/80 border border-[#223153] backdrop-blur">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-xs font-semibold tracking-widest uppercase">{isLive ? 'On Air' : 'Preview'}</span>
            </div>

            {(!localStreamRef.current || isStarting) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#050A1A]/80 text-center px-10">
                <p className="text-base font-semibold text-slate-200">{isStarting ? 'Preparing your stream...' : 'Click "Start Stream" to allow camera & mic access.'}</p>
                <p className="text-sm text-slate-400">Make sure Brave shields or other blockers are disabled for this page.</p>
              </div>
            )}

            {error && (
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-amber-500/40 bg-amber-900/60 text-amber-100 text-sm px-4 py-3 shadow-[0_0_30px_rgba(255,176,0,0.25)]">
                {error}
              </div>
            )}

            <div className="absolute bottom-6 left-6 text-xs text-slate-400 font-mono space-y-1">
              <p>Room: {roomId}</p>
              <p>Stream: {hostStreamId}</p>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[320px] space-y-6">
          <div className="rounded-[28px] bg-[#0B1326] border border-[#1A2647] p-6 shadow-[0_0_35px_rgba(3,10,29,0.45)] space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">Stream Checklist</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                Enable camera & microphone permissions when prompted.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                Share the viewer link: <code className="font-mono text-emerald-300">http://localhost:3000/</code>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                Use End Stream before closing the tab to release the room.
              </li>
            </ul>
          </div>

          <div className="rounded-[28px] bg-[#0B1326] border border-[#1A2647] p-6 shadow-[0_0_35px_rgba(3,10,29,0.45)] space-y-4 text-sm text-slate-400">
            <h3 className="text-base font-semibold text-white">Troubleshooting</h3>
            <p>If the preview stays black, ensure no other app is using your camera. Reload the page after granting permissions.</p>
            <p>Brave users: disable shields for this site, or switch to Chrome for the hosting tab.</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default HostScreen;
