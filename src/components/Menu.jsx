import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import CategoryIcons from './CategoryIcons';
import { CATEGORY_LIST } from '../data/menuData';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('Starters');


  const menuItems = {
    Starters: [
      {
        id: 1,
        name: 'Signature Gold Latte',
        description: 'Double shot espresso infused with organic honey and 24k edible gold dust.',
        price: 285,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhz5LZdplHVvtq2PHXghSC29UueUinHIkU-iQ2DZUrLAqX9kua7dY5qyHTXP0uC2Ef4Lbjy-RjlAfL8qo5VEQq05ctz5WOGcMdFVPFm9yFpc6RncP_GxDBpx9ORlHUZzyeU54IkI8nmB9xa-Rx8pXZpOP6VgEFsnypBIRaYIO-y0enHRZW5cGEGSbSjwuJE0gOPsUfsLtGz4lO6_sQriUQ6qTqO65bnGvj0U-u98gN6uYHbo4P3ojH6C6mB_o4kuPRVunE6IUQog',
        isNew: true,
        isHouseSpecialty: true
      },
      {
        id: 2,
        name: 'Hibiscus Cold Brew',
        description: '12-hour steep with floral botanicals.',
        price: 250,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA6uLqHaqv4GfVkK0sKno2OQ0JZ9Fr8P3JgfgKjX8aRdGQlytbEPZLQGLEq3bZBoGPuj81Z-_J-jgcrkPw_qTDy3zzcXUFZtMQvw-16jzx274YBZJbMfmY973KkNBcIVn_cKTxG9ArwfxvQkgwJdfxm01tCguivuLksDhb_otzQwZZnFzWf51ixbwwhki_01PjADn4B6IeWapd2DhHZ4bY-6-LE1BSaYQ9MDpVeHwvvWE1vQTF7rOXK-iKgvqKlG9ZyAkQZa5bKg',
        isNew: false
      }
    ],
    'Main Course': [
      {
        id: 3,
        name: 'Truffle Avocadotier',
        description: 'Charred sourdough, black truffle oil, and locally sourced micro-greens.',
        price: 850,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjU9BYyl2G-X-S4qOkgBAfxZRgAh9Gl-3Yr16d3ka3fCFzW3m18hbZXodHaoUFJM69Gj2AsNZ2JTMQHAGFLW7dNqVCH3NjufrSOOMnON1YhfkSpR3Bu6p-s5yR4gWyRzjBmtw_wEdwZYQrAs8sh3nK-HkIpe4IAlqRvcowCxz8lLjXVZqZLUsE3YVgcxc2LMtLTwNat43XHDKH4WfTefsAhK9WAGfS3-FduBdwb2XREe2XjS29BY0us1SPIDVFkC43nZXK8bVBkg',
        isNew: false,
        isLunch: true
      }
    ],
    Drinks: [
      {
        id: 4,
        name: 'Matcha Fusion',
        description: 'Ceremonial grade whisked to perfection.',
        price: 260,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiHNo5DgiYYdT5dBVYorukdS99FWF-0pnDOFmYB9em5AYKWrIaBQxTQucBw_ZSJFYj-ptL1AKIocbCK-E4BHysCAbDjCfre1SHCAq9mTPFWFG7IzBb6q4SrpObqmhj7RVwNhS8UUK76oOJaB09bblRAf8DzOzMo4jfXpIZT_eqnXVxJ-dZx4kJjIUApA09RzETvfMDbIB8R7lLWLztKbyj6f13XJOlHcMdVtSMHE0AL3c7t3XYhiKicdwU13nXlse_syR0vvVpZA',
        isNew: false
      }
    ],
    Desserts: [
      {
        id: 5,
        name: 'Chocolate Soufflé',
        description: 'Light and airy with a molten center.',
        price: 305,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=60',
        isNew: true
      }
    ],
    Coffee: [],
    Pastries: [],
    Brunch: [],
    Specials: []
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

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