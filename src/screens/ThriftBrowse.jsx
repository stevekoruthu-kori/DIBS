import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ThriftBrowse = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('For You');

  const categories = ['For You', 'Vintage', 'Streetwear', 'Designer', 'Y2K', 'Denim'];

  const handleLiveClick = () => {
    if (onNavigate) {
      onNavigate('live');
    }
  };

  const liveShows = [
    {
      id: 1,
      seller: 'vintagevibes',
      title: 'Rare 90s Designer Drop',
      viewers: 234,
      thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5ea8?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Designer'
    },
    {
      id: 2,
      seller: 'streetwear_gems',
      title: 'Supreme & Bape Collection',
      viewers: 189,
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Streetwear'
    },
    {
      id: 3,
      seller: 'thrift_queen',
      title: 'Vintage Denim & Jackets',
      viewers: 456,
      thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Denim'
    },
    {
      id: 4,
      seller: 'y2k_fashion',
      title: 'Y2K Aesthetic Clothing',
      viewers: 312,
      thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Y2K'
    },
    {
      id: 5,
      seller: 'luxury_thrift',
      title: 'Designer Bags & Accessories',
      viewers: 567,
      thumbnail: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Designer'
    },
    {
      id: 6,
      seller: 'vintage_finds',
      title: 'Retro Band Tees',
      viewers: 198,
      thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop',
      isLive: true,
      category: 'Vintage'
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-urbanist pb-20 relative overflow-hidden">
      {/* Background Gradients - Removed for Black/Off-White Theme */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-white/5 blur-3xl" />
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-2xl font-black text-white tracking-tighter">
            DIBS
          </div>
          
          <div className="flex items-center gap-3">
            {/* Messages */}
            <button className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            
            {/* Notifications */}
            <button className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              D
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vintage, streetwear..."
              className="w-full bg-white/10 rounded-full px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-44 px-4 pb-24 space-y-6">
        
        {/* Stories Rail - LIVE SELLERS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Live Sellers</h2>
            <span className="text-xs text-gray-400 font-semibold">View All</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {liveShows.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer" onClick={handleLiveClick}>
                <div className="relative w-[70px] h-[70px] rounded-full p-[2px] bg-white">
                  <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                    <img src={story.thumbnail} alt={story.seller} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-black">
                    LIVE
                  </div>
                </div>
                <span className="text-xs text-gray-300 truncate w-full text-center">{story.seller}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full h-48 rounded-2xl overflow-hidden cursor-pointer"
          onClick={handleLiveClick}
        >
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=400&fit=crop" 
            alt="Featured Drop" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-6">
            <span className="bg-white text-black text-xs font-black px-2 py-1 rounded w-fit mb-2">DROPPING NOW</span>
            <h2 className="text-3xl font-black text-white font-urbanist leading-none mb-1">STREETWEAR</h2>
            <h2 className="text-3xl font-black text-gray-400 font-urbanist leading-none mb-4">GRAILS</h2>
            <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full w-fit">
              Join Drop →
            </button>
          </div>
        </motion.div>

        {/* Trending Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Trending Now</h2>
          <div className="grid grid-cols-2 gap-3">
            {liveShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={handleLiveClick}
                className="relative rounded-2xl overflow-hidden bg-gray-900 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={show.thumbnail}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* LIVE Badge */}
                  {show.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}

                  {/* Viewers Count */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    {show.viewers}
                  </div>

                  {/* Show Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Seller */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-bold border border-white/20">
                        {show.seller[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-200 font-medium truncate">{show.seller}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                      {show.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Home */}
          <button className="flex flex-col items-center gap-1 text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>

          {/* Browse */}
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs font-semibold">Browse</span>
          </button>

          {/* Sell (Center with gradient) */}
          <button className="flex flex-col items-center -mt-6">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-black">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-1">Sell</span>
          </button>

          {/* Favorites */}
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-semibold">Favorites</span>
          </button>

          {/* Account */}
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-semibold">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ThriftBrowse;
