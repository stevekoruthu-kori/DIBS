/**
 * VideoPlayer Component
 * 
 * Placeholder for video streaming integration (Agora/Daily.co)
 * Engineer 3 will integrate the actual streaming SDK here
 */

export const VideoPlayer = ({ streamUrl }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Placeholder: Replace with Agora/Daily.co video component */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-bold mb-2">Live Stream</h2>
          <p className="text-gray-400">Video streaming will appear here</p>
          {streamUrl && (
            <p className="text-sm text-gray-500 mt-2">Stream: {streamUrl}</p>
          )}
        </div>
      </div>
    </div>
  );
};
