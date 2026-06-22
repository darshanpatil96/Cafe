import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '../contexts/TransitionContext';

const LiquidTransition = () => {
  const { isTransitioning, onTransitionHalfway } = useTransition();

  // Wait until the wipe covers the screen to trigger the callback (e.g., scroll)
  useEffect(() => {
    if (isTransitioning && onTransitionHalfway) {
      const timer = setTimeout(() => {
        onTransitionHalfway();
      }, 700); // 700ms corresponds to roughly when the screen is fully dark
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onTransitionHalfway]);

  if (!isTransitioning) return null; // Complete removal when not transitioning for safety

  // Initial State: flat top, placed above viewport
  const initialPath = `
    M 0 0 
    L 100 0 
    L 100 0 
    Q 50 0 0 0 
    Z
  `;

  // Middle State: flowing downwards, covering the whole screen with a wave at the bottom
  const targetPath = `
    M 0 0 
    L 100 0 
    L 100 100 
    Q 50 120 0 100 
    Z
  `;

  // Final State: flowing downwards off the screen
  const exitPath = `
    M 0 100 
    L 100 100 
    L 100 100 
    Q 50 100 0 100 
    Z
  `;

  const variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    enter: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: exitPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    // z-[9990] keeps it above all UI layers but below the cursor (z: 2147483647)
    // pointer-events-none ensures it never intercepts mouse events
    <div
      className={`fixed inset-0 z-[9990] pointer-events-none transition-opacity duration-300 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
      style={{ isolation: 'auto' }}
    >
      <svg 
        className="w-full h-full preserve-3d" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <motion.path 
          fill="#1c1613" // Deep espresso color
          variants={variants}
          initial="initial"
          animate={isTransitioning ? ["enter", "exit"] : "initial"}
          transition={{
            duration: 1.5,
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
};

export default LiquidTransition;
