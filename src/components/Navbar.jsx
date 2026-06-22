import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useMagnet } from '../hooks/useMagnet';
import { useOrders } from '../contexts/OrderContext';
import OrderingModeSelectorModal from './OrderingModeSelectorModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Menu', href: '/#menu' },
    { name: 'Reserve', href: '/#reserve' },
    { name: 'Our Story', href: '/#story' },
    { name: 'Locations', href: '/#locations' },
    { name: 'Contact', href: '/#contact' }
  ];

  const { startTransition } = useTransition();
  const { itemCount, openDrawer } = useCart();
  const { user, signOut, isLoggedIn } = useAuth();
  const { orderType, tableNumber, setModeSelectorOpen } = useOrders();

  const magnetOrder = useMagnet();
  const magnetAudio = useMagnet();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      setIsMenuOpen(false);
      startTransition(() => {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 800);
      });
    }
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

  const ambientTrack = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/40 shadow-xl shadow-black/30' : 'bg-stone-950/70 backdrop-blur-xl border-b border-stone-800/30'}`}>
      <audio ref={audioRef} src={ambientTrack} loop preload="auto" />
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
        <motion.div
          className="text-2xl font-serif italic tracking-tighter text-orange-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="hover:text-orange-100 transition-colors">Veloura Café</Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
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
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              {item.name}
            </motion.a>
          ))}

          {/* Audio Toggle */}
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
              <div className="flex items-end justify-center gap-[2px] h-4 w-4">
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["100%", "30%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                <motion.div className="w-[2px] bg-orange-200 rounded-full" animate={{ height: ["30%", "80%", "30%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
              </div>
            ) : (
              <span className="material-symbols-outlined text-[18px]">volume_off</span>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 border border-stone-800 text-stone-400 text-[10px] uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? 'Pause Ambient' : 'Play Ambient'}
            </span>
          </motion.button>
        </div>

        {/* Right side: Cart + Order */}
        <div className="flex items-center gap-3">
          {/* Order Mode Indicator */}
          <motion.button
            onClick={() => setModeSelectorOpen(true)}
            data-cursor="magnetic"
            className="flex items-center gap-2 border border-stone-850 hover:border-orange-200/30 text-[10px] text-orange-200/90 bg-stone-900/30 px-3.5 py-2.5 rounded-full transition-all duration-300 font-extrabold uppercase tracking-widest shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {orderType === 'Dine In' ? (
              <>
                <span className="material-symbols-outlined text-sm font-bold" style={{fontVariationSettings:"'FILL' 1"}}>restaurant</span>
                <span>T-{tableNumber} Active</span>
              </>
            ) : orderType === 'Takeaway' ? (
              <>
                <span className="material-symbols-outlined text-sm font-bold" style={{fontVariationSettings:"'FILL' 1"}}>shopping_bag</span>
                <span>Takeaway</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm font-bold" style={{fontVariationSettings:"'FILL' 1"}}>local_shipping</span>
                <span>Delivery</span>
              </>
            )}
          </motion.button>

          {/* Cart button */}
          <motion.button
            onClick={openDrawer}
            data-cursor="magnetic"
            className="relative flex items-center justify-center w-10 h-10 rounded-full border border-stone-800 text-stone-400 hover:text-orange-200 hover:border-orange-200/40 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            aria-label={`Cart (${itemCount} items)`}
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-orange-200 text-stone-950 text-[9px] font-extrabold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-0.5"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Desktop Order Button */}
          <motion.button
            ref={magnetOrder.ref}
            style={magnetOrder.style}
            onMouseLeave={magnetOrder.onMouseLeave}
            data-cursor="magnetic"
            onClick={openDrawer}
            className="hidden md:block bg-stone-100 text-stone-950 px-8 py-2.5 rounded-full font-label text-xs tracking-widest uppercase font-bold viscous-hover hover:bg-orange-200 hover:scale-105 active:scale-95"
          >
            Order Now
          </motion.button>

          {/* Mobile: audio + order + menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              onClick={toggleAudio}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-800 text-stone-400 hover:text-orange-200 transition-colors"
            >
              {isPlaying ? (
                <span className="material-symbols-outlined text-[16px] text-orange-200">volume_up</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">volume_off</span>
              )}
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-100 p-2"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
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
              <motion.button
                onClick={() => { openDrawer(); setIsMenuOpen(false); }}
                className="bg-stone-100 text-stone-950 px-6 py-2 rounded-full font-label text-xs tracking-widest uppercase font-bold hover:bg-orange-200 transition-all self-start mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                View Cart {itemCount > 0 ? `(${itemCount})` : ''}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <OrderingModeSelectorModal />
    </nav>
  );
};

export default Navbar;