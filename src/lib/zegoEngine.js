import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { APP_ID } from './zegoConfig';

console.log("🔌 Initializing Zego Engine with APP_ID:", APP_ID);

// Initialize ZEGO with proper server configuration
// Using the standard production server endpoint
// Note: For some AppIDs, the server URL might need to be specific.
// The user provided screenshot shows "wss://webliveroom" + appID + "-api.zego.im/ws" in my thought process, 
// but the screenshot just shows AppID. 
// Standard is usually wss://webliveroom-api.zego.im/ws or specific to appid.
// Let's use the one from the previous ViewerView code which was 'wss://webliveroom-api.zego.im/ws'
// But wait, the user's previous prompt had a code snippet with: const server = "wss://webliveroom" + appID + "-api.zego.im/ws";
// I should probably use that if the generic one fails, but let's stick to the one that was in the repo first.
// Actually, let's use the one that is most likely to work.
// The previous file `dibs-live-stream-export/zegoEngine.js` used `wss://webliveroom-api.zego.im/ws`.
// I will stick with that for now.

const zg = new ZegoExpressEngine(APP_ID, 'wss://webliveroom-api.zego.im/ws');

// Set log level for debugging
zg.setDebugVerbose(false);
zg.setLogConfig({ logLevel: 'error' });

console.log("✅ Zego Engine initialized");

export default zg;
