import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import AutoSequence from './AutoSequence';
import { useMagnet } from '../hooks/useMagnet';
import { useTransition } from '../contexts/TransitionContext';


const Hero = () => {
  const heroRef = useRef(null);
  const cupRef = useRef(null);
  const steamRef = useRef(null);
  const backgroundRef = useRef(null);
  
  const magnet1 = useMagnet();
  const magnet2 = useMagnet();
  const { startTransition } = useTransition();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (window.location.hash === href) return;
    startTransition(() => {
      window.location.hash = href;
    });
  };

  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  
  // Animation controls for different layers
  const cupControls = useAnimation();
  const steamControls = useAnimation();
  const backgroundControls = useAnimation();

  // Mouse movement handler
  const handleMouseMove = (e) => {
    if (!heroRef.current || (!isLoaded && !isBgLoaded)) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Normalize to -1 to 1
    const normalizedX = (x - 0.5) * 2;
    const normalizedY = (y - 0.5) * 2;
    
    setMousePosition({ x: normalizedX, y: normalizedY });
  };

  // Mouse parallax animation
  useEffect(() => {
    if (!isLoaded && !isBgLoaded) return;
    
    const animateLayers = async () => {
      // Background moves opposite to mouse (slow)
      await backgroundControls.start({
        x: -mousePosition.x * 5,
        y: -mousePosition.y * 5,
        transition: { type: 'spring', stiffness: 100, damping: 20, duration: 0.4 }
      });
      
      // Cup moves with mouse (medium)
      await cupControls.start({
        x: mousePosition.x * 10,
        y: mousePosition.y * 10,
        transition: { type: 'spring', stiffness: 150, damping: 25, duration: 0.4 }
      });
      
      // Steam moves with mouse (fast)
      await steamControls.start({
        x: mousePosition.x * 15,
        y: mousePosition.y * 15,
        transition: { type: 'spring', stiffness: 200, damping: 30, duration: 0.4 }
      });
    };
    
    animateLayers();
  }, [mousePosition, isLoaded, isBgLoaded, backgroundControls, cupControls, steamControls]);

  // Steam floating animation
  useEffect(() => {
    if (!isLoaded) return;
    
    const animateSteam = async () => {
      await steamControls.start({
        y: [-10, 10, -10],
        opacity: [0.8, 1, 0.8],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      });
    };
    
    animateSteam();
  }, [isLoaded, steamControls]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950 z-10 pointer-events-none"></div>
      
      {/* Background Image with Parallax & Animated Canvas */}
      <motion.div 
        ref={backgroundRef}
        className="absolute inset-0 z-0 hero-background-layer hero-animated-element"
        initial={{ opacity: 0 }}
        animate={{ opacity: isBgLoaded ? 0.4 : 0 }}
        transition={{ duration: 1 }}
      >
        <AutoSequence
          folderPath="/bg-frames"
          frameCount={144}
          frameDuration={50}
          className="block w-full h-full object-cover mix-blend-luminosity"
          onLoad={() => setIsBgLoaded(true)}
          loop={false}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-20 container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-7 lg:pr-12">
          <motion.span 
            className="inline-block font-label text-xs tracking-[0.3em] uppercase text-orange-200 mb-6 border-l-2 border-orange-200/40 pl-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Established 2024
          </motion.span>
          
          <motion.h1 
            className="font-headline text-6xl md:text-8xl leading-tight text-stone-100 mb-8 -ml-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Aura: <span className="italic font-light">Signature</span> <br/>Blend
          </motion.h1>
          
          <motion.p 
            className="font-body text-lg text-stone-400 max-w-lg mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            A sensory journey through the highlands. Our signature dark roast features notes of charred oak, Madagascar vanilla, and a silken chocolate finish.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button 
              ref={magnet1.ref}
              style={magnet1.style}
              onMouseLeave={magnet1.onMouseLeave}
              data-cursor="magnetic"
              className="bg-orange-200 text-stone-950 px-10 py-4 rounded-full font-label text-sm font-extrabold tracking-widest uppercase viscous-hover hover:bg-white hover:shadow-[0_0_30px_rgba(254,212,136,0.3)]"
            >
              Explore the Roast
            </motion.button>
            <motion.button 
              ref={magnet2.ref}
              style={magnet2.style}
              onMouseLeave={magnet2.onMouseLeave}
              onClick={(e) => handleNavClick(e, '#story')}
              data-cursor="magnetic"
              className="border border-stone-700 text-stone-100 px-10 py-4 rounded-full font-label text-sm font-bold tracking-widest uppercase viscous-hover hover:bg-stone-800"
            >
              Our Story
            </motion.button>
          </motion.div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl group-hover:opacity-75 transition duration-1000"></div>
            
            {/* 3D Coffee Cup with Frame Animation */}
            <motion.div 
              ref={cupRef}
              className="relative rounded-[2rem] w-full aspect-[4/5] overflow-hidden shadow-2xl shadow-black/50 viscous-hover group-hover:scale-[1.02] hero-cup-layer hero-animated-element"
              animate={cupControls}
              style={{ willChange: 'transform', opacity: isLoaded ? 1 : 0 }}
            >
              <AutoSequence onLoad={() => setIsLoaded(true)} />
              
              {/* Steam overlay with floating animation */}
              <motion.div
                ref={steamRef}
                className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
                animate={steamControls}
                style={{ willChange: 'transform, opacity', opacity: isLoaded ? 1 : 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-xl"></div>
                <div className="absolute top-4 left-1/4 w-1/2 h-12 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-2xl"></div>
              </motion.div>
            </motion.div>
            
            {/* Floating Accent */}
            <div className="absolute -bottom-10 -left-10 bg-stone-900/80 backdrop-blur-xl border border-stone-800 p-8 rounded-2xl shadow-2xl hidden md:block">
              <span className="block font-headline italic text-2xl text-orange-100 mb-1">94 Points</span>
              <span className="block font-label text-[10px] tracking-widest text-stone-500 uppercase">Specialty Coffee Rating</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;