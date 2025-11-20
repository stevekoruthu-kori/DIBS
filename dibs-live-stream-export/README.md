# DIBS Live Stream Component Export

This folder contains the core React components and logic for the DIBS Live Stream feature, using ZegoCloud WebRTC.

## 📂 Folder Structure

- `zegoEngine.js`: Singleton instance of the ZegoExpressEngine.
- `HostView.jsx`: The broadcaster component (camera preview + publishing).
- `ViewerView.jsx`: The audience component (playback + audio handling).
- `zegoConfig.js`: **TEMPLATE ONLY**. Configuration file for keys and tokens.

## 🚀 Integration Guide

### 1. Install Dependencies

In your target project (React + Vite/Next.js/etc.), install the ZegoCloud SDK:

```bash
npm install zego-express-engine-webrtc
```

### 2. Backend Integration (CRITICAL)

**Do not rely on static tokens beyond local testing.**

- `zegoConfig.js` now reads from Vite env vars (e.g. `VITE_ZEGO_APP_ID`, `VITE_ZEGO_HOST_TOKEN`, etc.).
- Set `VITE_ZEGO_STATIC_TOKEN_MODE=true` while you are manually pasting temporary tokens.
- When your backend token endpoint is live, set `VITE_ZEGO_STATIC_TOKEN_MODE=false` and pass a `fetchToken` prop to `HostView`/`ViewerView` that calls it.

#### Required Environment Variables (local testing)

```env
VITE_ZEGO_APP_ID=1427457804
VITE_ZEGO_SERVER_SECRET=your_server_secret
VITE_ZEGO_HOST_USER_ID=dibs-host
VITE_ZEGO_VIEWER_USER_ID=dibs-viewer
VITE_ZEGO_HOST_STREAM_ID=dibs-room-<auction>-host
VITE_ZEGO_HOST_TOKEN=temporary_host_token
VITE_ZEGO_VIEWER_TOKEN=temporary_viewer_token
VITE_ZEGO_STATIC_TOKEN_MODE=true
```

#### Step A: Backend Token Generation
Implement an API endpoint (e.g., `/api/stream-token`) that uses the Zego Server SDK to generate role-based tokens (`host`, `viewer`).

#### Step B: Update Components
Pass a token fetcher into the components:

```javascript
import { fetchZegoToken } from '../services/streamTokenService';

<ViewerView
  roomId={roomId}
  hostStreamId={hostStreamId}
  fetchToken={fetchZegoToken}
/>;
```

### 3. Audio Autoplay Handling

`ViewerView.jsx` includes special logic to handle browser Autoplay Policies:
- It attempts to play video with audio.
- If blocked, it plays muted and shows a "Tap to unmute" UI.
- It listens for user interaction (`pointerdown`) to unlock audio.

### 4. Styling

The components use inline styles for the video elements (`position: fixed`, `z-index: 0`) to create a full-screen background effect. The UI overlays use CSS classes like `.viewer-overlay` and `.mute-button`. You will need to copy the relevant CSS from your project's global CSS file or convert them to Tailwind/Styled Components.

## ⚠️ Troubleshooting

- **"Room not found"**: Ensure the Host has successfully published before the Viewer tries to play.
- **"Token Invalid"**: Tokens expire. Ensure your backend generates fresh tokens.
- **"Audio Blocked"**: This is normal browser behavior. The `ViewerView` component handles this by muting initially if needed.
