import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const MagneticCursor = () => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Magnet target state (from useMagnet hook)
  const magnetTarget = useRef(null);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Position derived from mouse and magnet lerp
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth springs for the main ring
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });

  // Faster springs for the inner dot (always follows raw mouse position, no lag)
  const dotSpringX = useSpring(mouseX, { stiffness: 500, damping: 35 });
  const dotSpringY = useSpring(mouseY, { stiffness: 500, damping: 35 });

  const variants = {
    default: { 
      width: 20, height: 20, 
      backgroundColor: "transparent", 
      border: "1.5px solid #C9A84C",
      x: "-50%", y: "-50%"
    },
    button: { 
      width: 50, height: 50, 
      backgroundColor: "#C9A84C", 
      border: "none",
      x: "-50%", y: "-50%"
    },
    card: { 
      width: 40, height: 40, 
      backgroundColor: "rgba(201,168,76,0.15)", 
      border: "1px solid #C9A84C",
      x: "-50%", y: "-50%"
    },
    link: { 
      width: 10, height: 10, 
      backgroundColor: "#C9A84C", 
      border: "none",
      x: "-50%", y: "-50%"
    }
  };

  useEffect(() => {
    // Check for touch device - invisible on touch
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const updateCursorPosition = () => {
      const mx = mouseX.get();
      const my = mouseY.get();

      if (magnetTarget.current) {
        const { centerX, centerY, strength } = magnetTarget.current;
        // Lerp toward button center
        const lerpFactor = strength * 0.7; // Max 70% toward center
        cursorX.set(mx + (centerX - mx) * lerpFactor);
        cursorY.set(my + (centerY - my) * lerpFactor);
      } else {
        cursorX.set(mx);
        cursorY.set(my);
      }
    };

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      updateCursorPosition();
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMagnetActive = (e) => {
      magnetTarget.current = e.detail;
      updateCursorPosition();
    };

    const handleMagnetInactive = () => {
      if (magnetTarget.current) {
        magnetTarget.current = null;
        updateCursorPosition();
      }
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      if (target.closest('button') || target.closest('[data-cursor="magnetic"]')) {
        setCursorVariant('button');
      } else if (target.closest('a')) {
        setCursorVariant('link');
      } else if (target.closest('.cursor-card')) {
        setCursorVariant('card');
      } else {
        setCursorVariant('default');
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('magnetic-active', handleMagnetActive);
    window.addEventListener('magnetic-inactive', handleMagnetInactive);

    // Initial attachment for static elements
    const attachListeners = () => {
      const elements = document.querySelectorAll('button, a, [data-cursor="magnetic"], .cursor-card');
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    attachListeners();
    
    // Observer for dynamic elements
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('magnetic-active', handleMagnetActive);
      window.removeEventListener('magnetic-inactive', handleMagnetInactive);
      observer.disconnect();
    };
  }, [mouseX, mouseY, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center rounded-full"
        initial="default"
        animate={cursorVariant}
        variants={variants}
        style={{
          x: springX,
          y: springY,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 28,
          mass: 0.5,
        }}
      >
        <AnimatePresence>
          {cursorVariant === 'button' && (
            <motion.span
              key="click-label"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[#1a1a1a] font-serif italic text-[10px] tracking-[0.05em] pointer-events-none select-none"
            >
              Click
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner Dot (2px filled gold dot at exact cursor position) */}
      <motion.div
        className="fixed top-0 left-0 bg-[#C9A84C] rounded-full z-[10000] pointer-events-none"
        style={{
          width: 2,
          height: 2,
          x: dotSpringX,
          y: dotSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default MagneticCursor;
