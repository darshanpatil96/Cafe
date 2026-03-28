import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Exactly 192 webp frames from the ezgif split
const FRAME_COUNT = 192;
const FPS = 24;

export default function GifPlayer({ className = '' }) {
  const containerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  // 1. SCROLL EFFECT: Parallax Float
  // Track scroll position to float the GIF naturally up by 120px
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Preload frames in the browser background cache to stop "flickering"
  useEffect(() => {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(3, '0')}.webp`;
    }
  }, []);

  // 2. GIF EFFECT: Auto-playing 3D rotation
  useEffect(() => {
    const intervalMap = setInterval(() => {
      // Loop sequence infinitely
      setCurrentFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, 1000 / FPS);

    return () => clearInterval(intervalMap);
  }, []);

  // Current calculated image source path
  const currentSrc = `/frames/frame_${String(currentFrame).padStart(3, '0')}.webp`;

  return (
    <motion.div
      ref={containerRef}
      style={{ y: parallaxY }} // Parallax Scroll attached
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Fallback image tag, universally supported, immediately renders frame 0 */}
      <img
        src={currentSrc}
        alt="3D Animated Component"
        className="w-full h-auto object-contain pointer-events-none rounded-3xl "
        style={{ mixBlendMode: 'screen' }}
      />
    </motion.div>
  );
}
