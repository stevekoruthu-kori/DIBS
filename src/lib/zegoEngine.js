import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { APP_ID } from './zegoConfig';

console.log("🔌 Initializing Zego Engine with APP_ID:", APP_ID);

// ⚠️ IMPORTANT: Check your Zego Console for the correct "Web Server URL".
// It usually looks like: wss://webliveroom{APP_ID}-api.zego.im/ws
// If you are using a different region or cluster, update this URL!
const server = "wss://webliveroom1427457804-api.zego.im/ws";

console.log('🌐 Using ZEGO signaling server:', server);

const zg = new ZegoExpressEngine(APP_ID, server);

// Set log level for debugging
zg.setDebugVerbose(true);
zg.setLogConfig({ logLevel: 'warn' });

// Prevent the SDK from surfacing blocking alert dialogs on errors.
zg.on('error', (error) => {
	console.error('ZEGO engine error:', error);
});

console.log("✅ Zego Engine initialized");

export default zg;
