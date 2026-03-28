import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodCard from './FoodCard';
import { MENU_DATA } from '../data/menuData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function FoodGrid({ activeCategory, activeModelKey, onSelectFood }) {
  const items = MENU_DATA[activeCategory] || [];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item) => (
          <motion.div variants={itemVariants} key={item.id} className="h-full">
            <FoodCard
              title={item.title}
              description={item.description}
              price={item.price}
              modelKey={item.modelKey}
              onSelect={onSelectFood}
              active={activeModelKey === item.modelKey}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
