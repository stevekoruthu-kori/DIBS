import React from 'react';
// Import the clean, fixed player we created earlier
import LiveStreamPlayer from '../components/LiveStreamPlayer';
import { ROOM_ID, HOST_STREAM_ID } from '../lib/zegoConfig';

// Import your UI overlays if you have them (BidControls, etc.)
// import BidControls from '../components/BidControls'; 

function ViewerScreen() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 1. Render the Fixed Player (Handles Video + Status Text) */}
      <LiveStreamPlayer streamId={HOST_STREAM_ID} roomId={ROOM_ID} />

      {/* 2. Example: Place your Overlays here (z-index 10) */}
      {/* <div className="absolute bottom-0 w-full z-10">
           <BidControls /> 
         </div> 
      */}
    </div>
  );
}

export default ViewerScreen;