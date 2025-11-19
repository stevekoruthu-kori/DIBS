import React, { useEffect, useRef, useState } from 'react';
import zg from '../lib/zegoEngine';
import { ROOM_ID, HOST_STREAM_ID, VIEWER_TOKEN, VIEWER_USER_ID } from '../lib/zegoConfig';

const LiveStreamPlayer = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    let isMounted = true;

    const detachHandlers = () => {
      zg.off('roomStreamUpdate');
      zg.off('playerStateUpdate');
    };

    const playHostStream = async () => {
      try {
        const stream = await zg.startPlayingStream(HOST_STREAM_ID);
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

    const initViewer = async () => {
      try {
        setStatus('Joining room...');
        await zg.loginRoom(ROOM_ID, VIEWER_TOKEN, { userID: VIEWER_USER_ID, userName: 'Viewer' });

        if (!isMounted) {
          return;
        }

        setStatus('Waiting for host...');

        const handleStreamUpdate = async (_roomID, updateType, streamList, _extra) => {
          if (!isMounted) {
            return;
          }
          if (updateType === 'ADD') {
            const hasHostStream = streamList.some(stream => stream.streamID === HOST_STREAM_ID);
            if (hasHostStream) {
              await playHostStream();
            }
          }
          if (updateType === 'DELETE') {
            const removedHost = streamList.some(stream => stream.streamID === HOST_STREAM_ID);
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
          } else if (state === 'NO_PLAY') {
            setStatus('Unable to play stream');
            if (error) {
              setErrorDetails(`${error?.code ?? ''} ${error?.message ?? ''}`.trim());
            }
          }
        };

        zg.on('roomStreamUpdate', handleStreamUpdate);
        zg.on('playerStateUpdate', handlePlayerUpdate);

        await playHostStream();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Viewer error:', error);
        let message = 'Connection error';
        let detail = '';

        const errCode = error?.code ?? error?.errorCode;
        if (errCode === 50122) {
          message = 'Viewer token userId mismatch';
          detail = 'Generate a token for user "dibs-viewer" in the ZEGO console.';
        } else if (errCode === 20014) {
          message = 'Viewer login failed';
        } else if (errCode === 1100002) {
          message = 'Network timeout while joining room';
        }

        setStatus(message);
        setErrorDetails(detail || (error?.message ?? JSON.stringify(error)));
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      detachHandlers();
      try {
        zg.logoutRoom(ROOM_ID);
      } catch (err) {
        console.warn('Viewer cleanup logout warning:', err);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
      {status && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none px-4 text-center">
          <div className="bg-black/60 px-4 py-2 rounded text-white text-sm font-bold">
            {status}
          </div>
          {errorDetails && (
            <div className="bg-black/50 px-3 py-2 rounded text-[11px] text-amber-200 font-mono">
              {errorDetails}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;
