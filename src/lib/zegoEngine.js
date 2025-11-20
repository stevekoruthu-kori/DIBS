import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { APP_ID } from './zegoConfig';

console.log("🔌 Initializing Zego Engine with APP_ID:", APP_ID);

const server = `wss://webliveroom${APP_ID}-api.zego.im/ws`;

console.log('🌐 Using ZEGO signaling server:', server);

const zg = new ZegoExpressEngine(APP_ID, server);

// Set log level for debugging
zg.setDebugVerbose(true);
zg.setLogConfig({ logLevel: 'warn' });

console.log("✅ Zego Engine initialized");

export default zg;
