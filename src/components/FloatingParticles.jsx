import React, { useMemo, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Particle = ({ delay, size, x, y, duration, blur, color, parallaxFactor }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax offset based on depth (parallaxFactor)
  const translateX = useTransform(springX, (v) => v * parallaxFactor);
  const translateY = useTransform(springY, (v) => v * parallaxFactor);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position to range [-1, 1]
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      initial={{ 
        x: `${x}%`, 
        y: `${y}%`, 
        opacity: 0,
        scale: 0,
        rotate: 0 
      }}
      animate={{ 
        opacity: [0, 0.6, 0.4],
        scale: 1,
        y: [`${y}%`, `${y - 10}%`, `${y}%`],
        rotate: [0, 180, 360],
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: `blur(${blur}px)`,
        translateX,
        translateY,
      }}
      transition={{
        opacity: { duration: 2, delay },
        scale: { duration: 2, delay },
        rotate: { duration: 30 + Math.random() * 20, repeat: Infinity, ease: "linear" },
        y: { duration: 10 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
};

// SVG Coffee Bean component for variety
const CoffeeBean = ({ delay, size, x, y, duration, blur, parallaxFactor }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 15 });

  const translateX = useTransform(springX, (v) => v * parallaxFactor);
  const translateY = useTransform(springY, (v) => v * parallaxFactor);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        opacity: 0,
        scale: 0.5,
        rotate: Math.random() * 360
      }}
      animate={{ 
        opacity: [0, 0.4, 0.3],
        scale: [0.5, 0.6, 0.5],
        y: [0, -40, 0],
        rotate: [0, 360],
      }}
      style={{
        width: size,
        height: size * 1.4,
        translateX,
        translateY,
        filter: `blur(${blur}px)`,
      }}
      transition={{
        opacity: { duration: 3, delay },
        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 40 + Math.random() * 20, repeat: Infinity, ease: "linear" },
        y: { duration: 15 + Math.random() * 10, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M20 5C10 5 5 15 5 30C5 45 10 55 20 55C30 55 35 45 35 30C35 15 30 5 20 5Z" fill="#3E2723" />
        <path d="M18 5C18 5 22 15 22 30C22 45 18 55 18 55" stroke="#1B1210" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

const FloatingParticles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate random particles once
  const particles = useMemo(() => {
    const items = [];
    
    // Gold dust (30 particles)
    for (let i = 0; i < 30; i++) {
       items.push({
         type: 'dust',
         id: `dust-${i}`,
         size: Math.random() * 4 + 2,
         x: Math.random() * 100,
         y: Math.random() * 100,
         delay: Math.random() * 5,
         blur: Math.random() * 2 + 1,
         color: Math.random() > 0.5 ? '#C9A84C' : '#E6BE8A',
         parallaxFactor: (Math.random() - 0.5) * 50, // Moderate parallax
       });
    }

    // Coffee beans (12 particles)
    for (let i = 0; i < 12; i++) {
      items.push({
        type: 'bean',
        id: `bean-${i}`,
        size: Math.random() * 40 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        blur: Math.random() * 6 + 2, // More blur for depth
        parallaxFactor: (Math.random() - 0.5) * 120, // High parallax for foreground/background feel
      });
    }

    return items;
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 opacity-40">
        {particles.map((p) => (
          p.type === 'dust' ? (
            <Particle key={p.id} {...p} />
          ) : (
            <CoffeeBean key={p.id} {...p} />
          )
        ))}
      </div>
    </div>
  );
};

export default FloatingParticles;
