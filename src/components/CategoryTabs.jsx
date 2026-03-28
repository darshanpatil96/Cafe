import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Starters', 'Main Course', 'Drinks', 'Desserts'];

export default function CategoryTabs({ active, onSelect }) {
  const tabRefs = useRef({});

  return (
    <div className="flex justify-center mb-12">
      <div className="relative flex gap-1 bg-white/5 backdrop-blur-md border border-yellow-600/20 rounded-full p-1.5 shadow-xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            ref={(el) => (tabRefs.current[cat] = el)}
            onClick={() => onSelect(cat)}
            data-cursor="magnetic"
            className="relative z-10 px-5 py-2 text-sm font-semibold tracking-widest uppercase rounded-full transition-colors duration-200 focus:outline-none"
            style={{ color: active === cat ? '#1a1208' : 'rgba(253,251,247,0.6)' }}
          >
            {active === cat && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_20px_rgba(202,138,4,0.4)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
