import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { APP_ID } from './zegoConfig';

console.log("🔌 Initializing Zego Engine with APP_ID:", APP_ID);

// Initialize ZEGO with proper server configuration
// Using the standard production server endpoint
const zg = new ZegoExpressEngine(APP_ID, 'wss://webliveroom-api.zego.im/ws');

// Set log level for debugging
zg.setDebugVerbose(false);
zg.setLogConfig({ logLevel: 'error' });

console.log("✅ Zego Engine initialized");

export default zg;
