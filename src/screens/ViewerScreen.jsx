import React, { useCallback, useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID, STATIC_TOKEN_MODE } from '../lib/zegoConfig';

function ViewerScreen({
  roomId = ROOM_ID,
  hostStreamId = HOST_STREAM_ID,
  viewerUserId = VIEWER_USER_ID,
  fetchToken,
  displayName = 'Viewer'
}) {
  const remoteVideoRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');
  const [details, setDetails] = useState('');
  const [isStreamVisible, setIsStreamVisible] = useState(false);

  const resolveToken = useCallback(async () => {
    if (typeof fetchToken === 'function') {
      const tokenResult = await fetchToken({
        role: 'viewer',
        userId: viewerUserId,
        roomId,
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

  useEffect(() => {
    let mounted = true;

    const clearVideo = () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setIsStreamVisible(false);
    };

    const detachHandlers = () => {
      zg.off('roomStreamUpdate');
      zg.off('playerStateUpdate');
    };

    const playStream = async () => {
      try {
        const mediaStream = await zg.startPlayingStream(hostStreamId);
        if (!mounted) {
          return;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = mediaStream;
          await remoteVideoRef.current.play().catch(() => {});
          setIsStreamVisible(true);
          setStatus('');
          setDetails('');
        }
      } catch (err) {
        if (!mounted) {
          return;
        }
        console.warn('Viewer startPlayingStream failed:', err);
        setStatus('Waiting for host to go live...');
      }
    };

    const init = async () => {
      try {
        setStatus('Resolving viewer token...');
        const token = await resolveToken();

        if (!mounted) {
          return;
        }

        setStatus('Joining room...');
        await zg.loginRoom(roomId, token, { userID: viewerUserId, userName: displayName });

        if (!mounted) {
          return;
        }

        setStatus('Waiting for host...');

        const handleStreamUpdate = async (_roomID, updateType, streamList) => {
          if (!mounted) {
            return;
          }

          if (updateType === 'ADD') {
            const hasHostStream = streamList.some(stream => stream.streamID === hostStreamId);
            if (hasHostStream) {
              await playStream();
            }
          }

          if (updateType === 'DELETE') {
            const hostRemoved = streamList.some(stream => stream.streamID === hostStreamId);
            if (hostRemoved) {
              setStatus('Host ended the stream');
              setDetails('');
              clearVideo();
            }
          }
        };

        const handlePlayerState = (_streamId, state, error) => {
          if (!mounted) {
            return;
          }

          if (state === 'PLAY_REQUESTING') {
            setStatus('Starting stream...');
          } else if (state === 'PLAYING') {
            setStatus('');
            setDetails('');
          } else if (state === 'NO_PLAY') {
            setStatus('Unable to play stream');
            if (error) {
              setDetails(`${error.code ?? ''} ${error.message ?? ''}`.trim());
            }
            clearVideo();
          }
        };

        zg.on('roomStreamUpdate', handleStreamUpdate);
        zg.on('playerStateUpdate', handlePlayerState);

        await playStream();
      } catch (err) {
        if (!mounted) {
          return;
        }
        console.error('Initialization error:', err);

        const errCode = err?.code ?? err?.errorCode;
        let message = 'Viewer connection error';
        let detail = err?.message ?? '';

        if (errCode === 50122) {
          message = 'Viewer token userId mismatch';
          detail = 'Generate a token for user "dibs-viewer" in the ZEGO console.';
        } else if (errCode === 20014) {
          message = 'Viewer login failed';
        } else if (errCode === 1100002) {
          message = 'Network timeout while joining room';
        }

        setStatus(message);
        setDetails(detail || (errCode ? `Error code ${errCode}` : ''));
        clearVideo();
      }
    };

    init();

    return () => {
      mounted = false;
      detachHandlers();
      try {
        zg.logoutRoom(roomId);
      } catch (err) {
        console.warn('Viewer cleanup logout warning:', err);
      }
      clearVideo();
    };
  }, [roomId, hostStreamId, viewerUserId, displayName, resolveToken]);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-10 bg-black/50 px-4 py-2 rounded">
        <p className="text-sm font-mono">{status || 'Live'}</p>
        <p className="text-xs text-gray-400">Room: {roomId}</p>
        {details && <p className="text-[11px] text-amber-300 mt-1 max-w-xs">{details}</p>}
      </div>

      <video
        ref={remoteVideoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        controls={false}
      />

      {!isStreamVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-0">
          <div className="text-center space-y-2">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-sm">{status || 'Waiting for host to start streaming...'}</p>
            {details && <p className="text-xs text-amber-200 font-mono px-4">{details}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewerScreen;
