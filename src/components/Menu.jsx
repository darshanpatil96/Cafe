import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import CategoryIcons from './CategoryIcons';
import { CATEGORY_LIST } from '../data/menuData';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('Starters');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, rotateX: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-32 bg-stone-950">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-xl mb-16">
            <motion.h2 
              className="font-headline text-6xl text-stone-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Curation
            </motion.h2>
            <motion.p 
              className="text-stone-400 font-light text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Every pour is a precision-engineered moment of serenity. Explore our seasonal artisanal selections.
            </motion.p>
          </div>
          
          {/* Swiggy-Style Category Icons (Enlarged and Centered) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full"
          >
            <CategoryIcons activeCategory={activeCategory} onSelect={setActiveCategory} />
          </motion.div>
        </div>
    </section>
  );
};

export default Menu;