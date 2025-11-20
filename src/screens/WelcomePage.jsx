import React, { useState } from 'react';
import { Home, Search, ShoppingBag, User, ArrowRight } from 'lucide-react';

const WelcomePage = ({ onNavigate }) => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative font-urbanist">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-20">
            <h1 className="text-8xl font-black text-white tracking-tighter scale-y-75">DIBS</h1>
            <p className="text-gray-400 text-xs tracking-[0.5em] mt-2">THRIFT DIFFERENT</p>
        </div>

        {/* Button Section */}
        <div className="absolute bottom-20 flex flex-col items-center gap-4">
            <button 
                onClick={() => setShowSplash(false)}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            >
                <ArrowRight className="text-black w-8 h-8" strokeWidth={3} />
            </button>
            <p className="text-gray-600 text-[10px] tracking-widest font-bold">PRESS START</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col relative overflow-hidden font-urbanist">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black tracking-tighter italic">DIBS</h1>
          <div className="flex gap-4">
             {/* Placeholder for header icons */}
          </div>
        </div>

        {/* Hero / Featured Section */}
        <div className="w-full aspect-[4/5] bg-gray-900 rounded-2xl mb-6 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('mobile')}>
            <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop" 
                alt="Featured Drop" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2 animate-pulse">LIVE NOW</div>
                <h2 className="text-3xl font-black italic mb-1">VINTAGE VAULT</h2>
                <p className="text-gray-300 text-sm">Rare 90s Streetwear Drop</p>
            </div>
        </div>

        {/* Categories / Feed */}
        <h3 className="font-bold text-lg mb-4">Trending Now</h3>
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden relative">
                     <img 
                        src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&seed=${i}`} 
                        alt="Item" 
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute bottom-2 left-2">
                        <p className="font-bold text-sm">Nike Tee</p>
                        <p className="text-xs text-gray-400">₹900</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Navigation Bar */}
      <Navigation />
    </div>
  );
};

export const Navigation = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/95 to-transparent flex justify-around items-end z-20 pb-6 px-2 pointer-events-none">
      <div className="flex justify-around items-center w-full pointer-events-auto">
        <NavItem icon={<Home size={24} />} active />
        <NavItem icon={<Search size={24} />} />
        <div className="relative -top-4">
            <button className="bg-white text-black rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group">
                <span className="font-display font-black text-xl group-hover:rotate-12 transition-transform">D</span>
            </button>
        </div>
        <NavItem icon={<ShoppingBag size={24} />} />
        <NavItem icon={<User size={24} />} />
      </div>
    </div>
  );
};

const NavItem = ({ icon, active }) => (
  <button className={`flex flex-col items-center justify-center w-12 h-12 ${active ? 'text-white' : 'text-neutral-600 hover:text-white transition-colors'}`}>
    {icon}
    {active && <span className="w-1 h-1 bg-white rounded-full mt-1" />}
  </button>
);

export default WelcomePage;
