import { useRef, useCallback, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * useMagnet Hook
 * 
 * Applies a magnetic attraction effect to an element and notifies the custom cursor.
 * Returns { ref, style, onMouseLeave } to be applied to a motion element.
 */
export const useMagnet = (range = 60, strength = 8) => {
  const ref = useRef(null);
  
  // Motion values for the element's own translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the element's movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const rect = ref.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < range) {
        // Element shift toward cursor (max ±8px by default)
        const moveX = (distanceX / range) * strength;
        const moveY = (distanceY / range) * strength;
        x.set(moveX);
        y.set(moveY);

        // Notify global cursor to magnet to this element's center
        window.dispatchEvent(new CustomEvent('magnetic-active', {
          detail: { 
            centerX, 
            centerY, 
            strength: 1 - (distance / range), // 1 at center, 0 at edge
            rect 
          }
        }));
      } else {
        // Smoothly return to center
        x.set(0);
        y.set(0);
        window.dispatchEvent(new CustomEvent('magnetic-inactive'));
      }
    },
    [range, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    window.dispatchEvent(new CustomEvent('magnetic-inactive'));
  }, [x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return {
    ref,
    style: {
      x: springX,
      y: springY,
    },
    onMouseLeave: handleMouseLeave
  };
};
