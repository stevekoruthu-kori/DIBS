import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DIBS - PROGRESSIVE WEB APP
 * Installable • Offline-Ready • Native-Like Experience
 */

// Install PWA Prompt Component
const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ App installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 right-6 z-50 bg-gradient-to-r from-neon-cyan to-neon-pink p-1 rounded-2xl shadow-2xl"
    >
      <div className="bg-graphite rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-1">Install DIBS App</p>
            <p className="text-soft-silver text-xs">Get the full web app experience</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 text-soft-silver text-sm font-bold rounded-lg"
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-neon-cyan text-neon-black text-sm font-bold rounded-lg"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Offline Indicator
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-neon-pink py-2 px-4 text-center">
      <p className="text-white text-sm font-bold">📡 Offline Mode - Limited Features</p>
    </div>
  );
};

// Export enhanced app wrapper
export { InstallPrompt, OfflineIndicator };
