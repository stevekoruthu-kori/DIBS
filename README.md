# DIBS - Live Auction Web App

A TikTok-style, mobile-first live auction platform built with React, Firebase, and Vite.

## 🏗️ Project Structure

```
dibs-web/
├── .env.local              # Firebase API Keys (DO NOT COMMIT)
├── database.rules.json     # Firebase Security Rules
├── firebase.json           # Firebase Hosting Config
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS Config
├── index.html              # Entry HTML
└── src/
    ├── main.jsx            # React Entry Point
    ├── App.jsx             # Main Layout
    ├── lib/
    │   └── firebase.js     # Firebase Initialization & Helpers
    ├── services/
    │   ├── auctionService.js   # Bid Logic & Validation
    │   └── authService.js      # Google Sign-in
    ├── hooks/
    │   ├── useAuction.js       # Live Auction State Hook
    │   ├── useAdmin.js         # Admin Controls Hook
    │   └── useWindowSize.js    # Window Dimensions Hook
    └── components/
        ├── VideoPlayer.jsx     # Video Stream Container
        ├── BidControls.jsx     # Main Bid UI with Animations
        ├── Confetti.jsx        # Win Animation
        └── AdminPanel.jsx      # Hidden Host Controls
```

## 🚀 Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Firebase

Update `.env.local` with your Firebase credentials:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DB_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### 3. Deploy Firebase Rules

\`\`\`bash
firebase deploy --only database
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

## 🎨 Features

### Engineer 1: Frontend (Viewer Experience)
- ✅ Mobile-first, TikTok-style full-screen UI
- ✅ Dark mode with gradient overlays
- ✅ LIVE badge + real-time viewer count
- ✅ Framer Motion "dopamine" animations on bid changes
- ✅ Confetti explosion on win
- ✅ Massive, thumb-friendly bid button

### Engineer 2: Backend Logic (Transaction Layer)
- ✅ Real-time Firebase subscriptions
- ✅ Atomic bid validation & placement
- ✅ Auction state management
- ✅ Admin controls (start/stop auctions)

### Engineer 3: Video Streaming (TODO)
- 🔲 Integrate Agora/Daily.co SDK
- 🔲 Replace VideoPlayer placeholder with live stream

## 🎮 Usage

### For Viewers
1. Open the app on mobile
2. Watch the live stream
3. Tap the BID button to place bids
4. Sign in with Google when prompted
5. Watch for confetti if you win! 🎉

### For Admins
1. **Tap and hold the top-right corner** to reveal admin panel
2. Enter item details
3. Click "Start Auction"
4. Auction goes live for all viewers
5. Click "Stop Auction" to end

## 📦 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Auth (Google Sign-in)
- **Hosting**: Vercel / Firebase Hosting

## 🔒 Security

Firebase security rules in `database.rules.json`:
- Viewers can read auction data
- Only authenticated users can place bids
- Bids must be higher than current bid
- Admin controls require special privileges

## 📱 Responsive Design

Built mobile-first with:
- 100vh full viewport height
- Touch-optimized controls
- Smooth animations (60fps)
- Dark mode for battery efficiency

## 🤝 Contributing

This is a multi-engineer project:
- **Engineer 1**: Focus on UI/UX and animations
- **Engineer 2**: Handle backend logic and Firebase
- **Engineer 3**: Integrate video streaming

## 📄 License

MIT License - Feel free to use for your own auction projects!
