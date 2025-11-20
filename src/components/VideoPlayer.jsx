import ViewerView from '../../dibs-live-stream-export/ViewerView.jsx';
import { fetchZegoToken, shouldUseDynamicTokens } from '../services/streamTokenService';

/**
 * VideoPlayer Component
 * Renders the viewer experience using the extracted Zego implementation.
 * Falls back to a gradient placeholder if no stream metadata is available yet.
 */

export const VideoPlayer = ({ streamConfig, fetchToken }) => {
  const hasStreamConfig = Boolean(streamConfig?.roomId && streamConfig?.hostStreamId);
  const tokenFetcher = fetchToken || (shouldUseDynamicTokens ? fetchZegoToken : undefined);

  if (!hasStreamConfig) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📹</div>
            <h2 className="text-2xl font-bold mb-2">Live Stream Offline</h2>
            <p className="text-gray-400">Waiting for the host to start broadcasting…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ViewerView
      roomId={streamConfig.roomId}
      hostStreamId={streamConfig.hostStreamId}
      viewerUserId={streamConfig.viewerUserId}
      fetchToken={tokenFetcher}
    />
  );
};
