import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LIST } from '../data/menuData';

const CategoryIcons = ({ activeCategory, onSelect }) => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    if (onSelect) onSelect(category.name);
    navigate(`/menu/${category.slug}`);
  };

  return (
    <div className="w-full py-12">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 px-4">
        {CATEGORY_LIST.map((category, index) => {
          const isActive = activeCategory === category.name;

          return (
            <motion.button
              key={category.name}
              onClick={() => handleClick(category)}
              data-cursor="magnetic"
              className="flex flex-col items-center gap-4 group outline-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Browse ${category.name}`}
            >
              {/* Large Circular Image Container */}
              <div
                className={`
                  relative w-32 h-32 md:w-44 md:h-44 rounded-full p-2 transition-all duration-500
                  ${isActive
                    ? 'bg-gradient-to-tr from-orange-400 to-orange-200 shadow-[0_0_40px_rgba(251,191,36,0.2)]'
                    : 'bg-stone-800/30 group-hover:bg-stone-700/40 border border-stone-800/50'}
                `}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-950 bg-stone-900 shadow-inner">
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`
                      w-full h-full object-cover transition-transform duration-700 ease-out
                      ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110'}
                    `}
                  />
                </div>

                {/* Active Indicator Pulse */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-border"
                    className="absolute -inset-1 rounded-full border border-orange-200/40"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Category Label */}
              <div className="flex flex-col items-center">
                <span
                  className={`
                    font-label text-xs md:text-sm tracking-[0.3em] uppercase font-bold transition-all duration-300
                    ${isActive ? 'text-orange-200' : 'text-stone-500 group-hover:text-stone-300'}
                  `}
                >
                  {category.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="h-0.5 w-8 bg-orange-200 mt-1 rounded-full"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryIcons;
