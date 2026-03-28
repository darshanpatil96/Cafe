import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Box } from 'lucide-react';

export default function FoodCard({ title, description, price, modelKey, onSelect, active }) {
  return (
    <Tilt
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#ca8a04"
      scale={1.03}
      transitionSpeed={600}
      className="h-full"
    >
      <motion.div
        layout
        onClick={() => onSelect(modelKey)}
        className={`
          relative h-full flex flex-col justify-between cursor-pointer rounded-2xl p-6
          bg-white/5 backdrop-blur-lg cursor-card
          border transition-all duration-300 group overflow-hidden
          ${active
            ? 'border-yellow-500/60 shadow-[0_0_35px_rgba(202,138,4,0.2)]'
            : 'border-yellow-600/20 hover:border-yellow-500/40'}
        `}
      >
        {/* Glow blob on active */}
        {active && (
          <motion.div
            layoutId="active-glow"
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-yellow-500/10 blur-2xl pointer-events-none"
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-serif text-xl text-yellow-100 leading-snug">{title}</h3>
          <motion.span
            whileHover={{ scale: 1.15, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="font-semibold text-yellow-400 text-lg whitespace-nowrap ml-3"
          >
            ₹{price}
          </motion.span>
        </div>

        {/* Description */}
        <p className="text-cafe-light/50 text-sm leading-relaxed flex-1 mb-6">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-yellow-600/15">
          <span className={`text-xs tracking-widest uppercase font-semibold transition-colors ${
            active
              ? 'text-yellow-400 animate-pulse'
              : 'text-cafe-light/30 group-hover:text-cafe-light/60'
          }`}>
            {active ? '✦ Viewing 3D' : 'Click to View'}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
            active ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-cafe-700 text-cafe-light/40'
          }`}>
            <Box className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}
