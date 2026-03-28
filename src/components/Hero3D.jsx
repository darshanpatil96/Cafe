import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMagnet } from '../hooks/useMagnet';

// Replace FRAME_COUNT with actual number of frames
const FRAME_COUNT = 136; // We have frame_000.webp to frame_135.webp
const FRAME_DURATION = 50; // ~50ms per frame for a slow, premium feel

export default function Hero3D() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const magnetOrder = useMagnet();
  const magnetMenu = useMagnet();
  
  // Animation state for canvas
  const stateRef = useRef({
    frameIndex: 0,
    direction: 1 // 1 for forward, -1 for backward (ping-pong)
  });

  // Preload all frames on mount
  useEffect(() => {
    let isMounted = true;
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        // Keep order
        loadedImages[i] = img;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
           setImages(loadedImages);
           setIsLoaded(true);
        }
      };
    }
    
    return () => { isMounted = false; };
  }, []);

  // Canvas drawing helper (cover behavior)
  const drawImageScaled = useCallback((img, ctx, canvas) => {
    if (!img || img.naturalWidth === 0) return;
    
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && isLoaded && images.length > 0) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        
        // Initial draw
        const img = images[stateRef.current.frameIndex] || images[0];
        if (img) {
             const ctx = canvasRef.current.getContext('2d', { alpha: true });
             drawImageScaled(img, ctx, canvasRef.current);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Draw initial if loaded
    if (isLoaded) handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images, drawImageScaled]);

  // Main animation loop using requestAnimationFrame
  const animate = useCallback((time) => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;
    
    if (lastTimeRef.current !== undefined) {
      const elapsed = time - lastTimeRef.current;
      
      // Update frame index based on target duration
      if (elapsed > FRAME_DURATION) {
        let nextIndex = stateRef.current.frameIndex + 1;
        
        if (nextIndex >= FRAME_COUNT) {
          nextIndex = 0;
        }
        
        stateRef.current.frameIndex = nextIndex;
        lastTimeRef.current = time - (elapsed % FRAME_DURATION); // carry over remainder
        
        // Draw frame
        const img = images[nextIndex];
        if (img && img.complete) {
            const ctx = canvasRef.current.getContext('2d', { alpha: true });
            drawImageScaled(img, ctx, canvasRef.current);
        }
      }
    } else {
        lastTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isLoaded, images, drawImageScaled]);

  // Start/stop animation loop
  useEffect(() => {
    if (isLoaded) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded, animate]);


  return (
    <section className="relative w-full h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden px-6 md:px-20 lg:px-32" style={{ backgroundColor: '#0a0a06' }}>
      
      {/* Background Subtle Noise/Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at left, #0a0a06 0%, #0a0a06 80%)' }} />

      {/* Huge Background Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <span className="font-sans font-black text-[25rem] md:text-[35rem] leading-none text-white/[0.03] tracking-tighter select-none">
          01
        </span>
      </motion.div>

      {/* Left Content */}
      <div className="relative z-30 flex flex-col items-start w-full max-w-xl md:max-w-2xl mt-32 md:mt-0">
        
        {/* Title Group - Slide from left */}
        <motion.div
           initial={{ x: -60, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
        >
          <h1 className="font-sans font-black text-6xl sm:text-8xl md:text-[9rem] leading-[0.85] tracking-tighter text-white uppercase drop-shadow-2xl">
            AURA
          </h1>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-yellow-500 mt-4 mb-4 md:mb-8 font-medium italic tracking-wide drop-shadow-lg">
            Signature Blend
          </h2>
        </motion.div>

        {/* Text and Buttons Group - Staggered fade in */}
        <div className="flex flex-col items-start">
          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/60 text-base md:text-xl max-w-sm md:max-w-md leading-relaxed font-light mb-10 md:mb-14"
          >
            A modern functional coffee brand inspired by classic roasting techniques, but made with ethically sourced, single-origin beans.
          </motion.p>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            <motion.button 
              ref={magnetOrder.ref}
              style={magnetOrder.style}
              onMouseLeave={magnetOrder.onMouseLeave}
              data-cursor="magnetic"
              className="px-6 py-3 md:px-10 md:py-4 rounded-full bg-white text-black hover:bg-yellow-500 transition-colors uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Order Now
            </motion.button>
            <motion.a 
              ref={magnetMenu.ref}
              style={magnetMenu.style}
              onMouseLeave={magnetMenu.onMouseLeave}
              href="#menu" 
              data-cursor="magnetic"
              className="px-6 py-3 md:px-10 md:py-4 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold backdrop-blur-md"
            >
              Explore Menu
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Right Content: 3D Object / Canvas wrapper */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, x: 50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] flex items-center justify-center z-20 pointer-events-none md:pointer-events-auto"
      >
        <div className="relative w-[150%] md:w-[120%] xl:w-[140%] h-full origin-center drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] -translate-y-[15%] md:-translate-y-[10%] mix-blend-screen isolate flex items-center justify-center">
            
            {/* Loading Indicator */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-12 h-12 rounded-full border-t-2 border-yellow-500 animate-spin"></div>
              </div>
            )}

            {/* Render Canvas */}
            <canvas
              ref={canvasRef}
              className="block w-full h-full object-contain mix-blend-screen pointer-events-none"
              style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
            />
        </div>
      </motion.div>

      {/* Olipop-style Right Side Pagination */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-12"
      >
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-white text-white/40 transition-colors">
          <span className="text-[10px] tracking-[0.3em] font-semibold uppercase">Prev</span>
          <span className="text-lg">↑</span>
        </div>
        <div className="w-[1px] h-32 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-white text-white/40 transition-colors">
          <span className="text-lg">↓</span>
          <span className="text-[10px] tracking-[0.3em] font-semibold uppercase">Next</span>
        </div>
      </motion.div>

    </section>
  );
}
