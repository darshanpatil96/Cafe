import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useScroll, useSpring, useMotionValueEvent, useTransform } from 'framer-motion';

const ScrollSequence = ({ frameCount = 136, scrollTarget, onLoad }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);

  const frameUrls = useMemo(
    () => Array.from({ length: frameCount }, (_, i) => `/frames/frame_${String(i).padStart(3, '0')}.webp`),
    [frameCount]
  );

  // High-performance image preloading
  useEffect(() => {
    let isMounted = true;
    
    const loadImages = async () => {
      const promises = [];
      for (let i = 0; i < frameCount; i++) {
        promises.push(new Promise((resolve) => {
          const img = new Image();
          img.src = frameUrls[i];
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img); // Graceful fallback
        }));
      }
      
      const loadedImages = await Promise.all(promises);
      if (isMounted) {
        setImages(loadedImages);
        setIsLoaded(true);
        if (onLoad) onLoad();
      }
    };
    
    loadImages();
    return () => { isMounted = false; };
  }, [frameCount, frameUrls, onLoad]);

  // Framer Motion scroll and spring physics for the "anti-gravity" lag
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  // Helper to draw image using 'cover' scaling via Canvas API
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

  // Handle canvas sizing
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        
        // Redraw current frame
        if (isLoaded && images.length > 0) {
          const index = Math.min(Math.max(Math.round(frameIndex.get()), 0), frameCount - 1);
          const img = images[index] || images[0];
          const ctx = canvasRef.current.getContext('2d');
          drawImageScaled(img, ctx, canvasRef.current);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing update
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images, frameIndex, frameCount, drawImageScaled]);

  // Use requestAnimationFrame for blazing fast 60FPS updates instead of state React renders
  const renderCanvas = useCallback((latestIndex) => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;
    
    const index = Math.min(Math.max(Math.round(latestIndex), 0), frameCount - 1);
    const img = images[index];
    
    if (img && img.complete && img.naturalHeight !== 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false }); // Optimize if opaque, or use true if transparent
      drawImageScaled(img, ctx, canvas);
    }
  }, [isLoaded, images, frameCount, drawImageScaled]);

  // Bind the motion path string to our canvas render loops
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.min(Math.max(Math.round(latest), 0), frameCount - 1);
    setActiveFrame(index);
    // We defer rendering to rAF to guarantee it syncs with the monitor's refresh rate and doesn't block the main thread
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => renderCanvas(latest));
  });

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}
      />
      
      {/* Fast preview / blank spot fill while image sequence initializes */}
      {!isLoaded && (
        <img
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out"
          src={frameUrls[activeFrame]}
          alt="3D animated coffee cup placeholder"
          style={{ willChange: 'opacity', opacity: 1 }}
        />
      )}

      {/* Preload all sequence frames in DOM (explicit “all images from this file”) */}
      <div className="hidden" aria-hidden="true">
        {frameUrls.map((src, frame) => (
          <img key={frame} src={src} alt={`frame ${frame}`} />
        ))}
      </div>

      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-orange-200 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ScrollSequence;
