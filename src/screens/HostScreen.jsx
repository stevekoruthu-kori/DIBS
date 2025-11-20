import React, { useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, HOST_TOKEN, HOST_USER_ID } from '../lib/zegoConfig';
import { db } from '../lib/firebase';
import { ref, set, remove } from 'firebase/database';

const HostScreen = () => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState('Initializing...');
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initPreview = async () => {
      try {
        setStatus('Requesting Camera...');
        try { await zg.logoutRoom(ROOM_ID); } catch (e) {}

        await zg.loginRoom(ROOM_ID, HOST_TOKEN, { 
            userID: HOST_USER_ID, 
            userName: 'Host' 
        });

        const localStream = await zg.createStream({
          camera: { video: true, audio: true },
        });

        localStreamRef.current = localStream;

        if (isMounted && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.muted = true; 
        }

        setStatus('Ready');
      } catch (err) {
        console.error('Preview Error:', err);
        setError('Camera access denied. Check permissions.');
        setStatus('Error');
      }
    };

    initPreview();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        zg.destroyStream(localStreamRef.current);
        localStreamRef.current = null;
      }
      zg.logoutRoom(ROOM_ID);
    };
  }, []);

  const startHosting = async () => {
    if (isLive || isStarting || !localStreamRef.current) return;

    try {
      setIsStarting(true);
      setError(null);
      setStatus('Starting...');

      await zg.startPublishingStream(HOST_STREAM_ID, localStreamRef.current);

      await set(ref(db, 'current_stream'), {
        roomId: ROOM_ID,
        streamId: HOST_STREAM_ID,
        hostId: HOST_USER_ID,
        status: 'live',
        startedAt: Date.now()
      });

      setIsLive(true);
      setStatus('Live');
    } catch (err) {
      console.error('Hosting Error:', err);
      setError('Connection Failed');
    } finally {
      setIsStarting(false);
    }
  };

  const stopHosting = async () => {
    if (isStopping) return;
    try {
      setIsStopping(true);
      setStatus('Stopping...');
      await zg.stopPublishingStream(HOST_STREAM_ID);
      await remove(ref(db, 'current_stream'));
      setIsLive(false);
      setStatus('Ready');
    } catch (err) {
      console.error('Stop Error:', err);
    } finally {
      setIsStopping(false);
    }
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      const nextMuted = !isMuted;
      audioTracks.forEach(track => track.enabled = !nextMuted);
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050A1A] text-white font-urbanist flex flex-col overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="border-b border-white/10 bg-[#050A1A]/50 backdrop-blur-md sticky top-0 z-30 h-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black tracking-tight text-white">HOST STUDIO</h1>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="flex-1 w-full p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start h-full">
            
            {/* LEFT COLUMN: PHONE PREVIEW (Centered & Fixed Ratio) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
                {/* Phone Frame */}
                <div className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-[2.5rem] border-[6px] border-[#1A2647] shadow-2xl overflow-hidden ring-1 ring-white/20">
                    
                    {/* VIDEO ELEMENT WITH AUTOPLAY FIX */}
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      // This event guarantees the video plays when data arrives
                      onLoadedMetadata={() => {
                        if (localVideoRef.current) localVideoRef.current.play();
                      }}
                      className="w-full h-full object-cover bg-[#1a1a1a] transform scale-x-[-1]" 
                    />

                    {/* Status Badge */}
                    <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
                         <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-500' : 'bg-white/50'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                                {isLive ? 'LIVE' : 'PREVIEW'}
                            </span>
                         </div>
                    </div>

                    {/* Loading Overlay */}
                    {(!localStreamRef.current) && (
                      <div className="absolute inset-0 bg-[#0B1326] flex flex-col items-center justify-center z-10">
                         <div className="animate-bounce text-3xl mb-3">📷</div>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Connecting Camera...</p>
                      </div>
                    )}

                    {/* Error Overlay */}
                    {error && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-20 text-center">
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                                <p className="text-red-400 font-bold text-sm mb-1">⚠️ Unable to Access Camera</p>
                                <p className="text-slate-400 text-xs">Check browser permissions</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS */}
            <div className="lg:col-span-7 flex flex-col justify-center w-full max-w-lg mx-auto lg:mx-0 pt-4 lg:pt-10">
                
                <h2 className="text-2xl font-bold text-white mb-6">Stream Controls</h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {!isLive ? (
                        <button
                            onClick={startHosting}
                            disabled={isStarting || !localStreamRef.current}
                            className="col-span-2 py-5 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isStarting ? 'STARTING...' : 'GO LIVE 🚀'}
                        </button>
                    ) : (
                        <button
                            onClick={stopHosting}
                            disabled={isStopping}
                            className="col-span-2 py-5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-red-600 to-pink-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 animate-pulse"
                        >
                            {isStopping ? 'ENDING...' : 'END STREAM ⏹'}
                        </button>
                    )}

                    <button
                        onClick={toggleMute}
                        className={`col-span-2 py-4 rounded-xl font-bold border transition-all ${isMuted ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                    >
                        {isMuted ? '🔇 UNMUTE MIC' : '🎙️ MUTE MIC'}
                    </button>
                </div>

                {/* System Check */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">System Check</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm bg-black/20 p-3 rounded-lg">
                            <span className="text-slate-400">Camera</span>
                            <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-black/20 p-3 rounded-lg">
                            <span className="text-slate-400">Microphone</span>
                            <span className={isMuted ? "text-red-400 font-mono font-bold" : "text-emerald-400 font-mono font-bold"}>
                                {isMuted ? 'MUTED' : 'ACTIVE'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-black/20 p-3 rounded-lg">
                             <span className="text-slate-400">Viewer Link</span>
                             <code className="text-xs font-mono text-cyan-400">http://localhost:3000</code>
                        </div>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default HostScreen;