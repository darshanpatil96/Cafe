import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '../contexts/TransitionContext';
import { useMagnet } from '../hooks/useMagnet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Menu', href: '#menu' },
    { name: 'Reservation', href: '#reservation' },
    { name: 'Story', href: '#story' },
    { name: 'Location', href: '#location' }
  ];

  const { startTransition } = useTransition();

  const magnetOrder = useMagnet();
  const magnetOrderMobile = useMagnet();
  const magnetAudio = useMagnet();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (window.location.hash === href) return; // Ignore if already there
    
    startTransition(() => {
      window.location.hash = href;
      setIsMenuOpen(false); // also close mobile menu if it was open
    });
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // High-quality ambient cafe sound (direct MP3 link)
  const ambientTrack = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-950/70 backdrop-blur-xl border-b border-stone-800/30">
      <audio ref={audioRef} src={ambientTrack} loop preload="auto" />
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        <motion.div 
          className="text-2xl font-serif italic tracking-tighter text-orange-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Aura Cafe
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-stone-400 hover:text-stone-100 transition-colors duration-500 font-serif font-light tracking-tight ${
                item.name === 'Menu' ? 'text-orange-200 border-b border-orange-200/30 pb-1' : ''
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.name}
            </motion.a>
          ))}
          
          {/* Audio Toggle (Desktop) */}
          <motion.button
            ref={magnetAudio.ref}
            style={magnetAudio.style}
            onMouseLeave={magnetAudio.onMouseLeave}
            data-cursor="magnetic"
            onClick={toggleAudio}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-800 text-stone-400 hover:text-orange-200 hover:border-orange-200/50 transition-all duration-300 ml-4 group relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            aria-label="Toggle ambient audio"
          >
            {isPlaying ? (
              // Audio playing animation bars
              <div className="flex items-end justify-center gap-[2px] h-4 w-4">
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["100%", "30%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["30%", "80%", "30%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
              </div>
            ) : (
              // Muted icon
              <span className="material-symbols-outlined text-[18px]">volume_off</span>
            )}
            
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 border border-stone-800 text-stone-400 text-[10px] uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? 'Pause Ambient' : 'Play Ambient'}
            </span>
          </motion.button>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-4">
          <motion.button 
            ref={magnetAudio.ref}
            style={magnetAudio.style}
            onMouseLeave={magnetAudio.onMouseLeave}
            data-cursor="magnetic"
            onClick={toggleAudio}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-800 text-stone-400 hover:text-orange-200 transition-colors"
          >
            {isPlaying ? (
              <span className="material-symbols-outlined text-[16px] text-orange-200">volume_up</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">volume_off</span>
            )}
          </motion.button>
          <motion.button 
            ref={magnetOrderMobile.ref}
            style={magnetOrderMobile.style}
            onMouseLeave={magnetOrderMobile.onMouseLeave}
            data-cursor="magnetic"
            className="bg-stone-100 text-stone-950 px-6 py-2 rounded-full font-label text-xs tracking-widest uppercase font-bold viscous-hover hover:bg-orange-200 hover:scale-105 active:scale-95"
          >
            Order Now
          </motion.button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-stone-100 p-2"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/50 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-stone-400 hover:text-stone-100 transition-colors duration-500 font-serif font-light tracking-tight py-2 ${
                    item.name === 'Menu' ? 'text-orange-200 border-b border-orange-200/30 pb-2' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Desktop Order Button */}
        <motion.button 
          ref={magnetOrder.ref}
          style={magnetOrder.style}
          onMouseLeave={magnetOrder.onMouseLeave}
          data-cursor="magnetic"
          className="hidden md:block bg-stone-100 text-stone-950 px-8 py-2.5 rounded-full font-label text-xs tracking-widest uppercase font-bold viscous-hover hover:bg-orange-200 hover:scale-105 active:scale-95"
        >
          Order Now
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;