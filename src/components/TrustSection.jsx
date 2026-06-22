import React from 'react';
import { motion } from 'framer-motion';

const trustItems = [
  {
    id: 1,
    title: '4.9 Star Rating',
    description: 'Over 10,000+ guest reviews',
    icon: 'star',
  },
  {
    id: 2,
    title: 'Freshly Roasted Beans',
    description: '100% single-origin Geisha & Arabica',
    icon: 'coffee',
  },
  {
    id: 3,
    title: 'Locally Sourced Ingredients',
    description: 'Ethically grown organic produce',
    icon: 'eco',
  },
  {
    id: 4,
    title: 'Artisan Crafted Coffee',
    description: 'Certified master baristas',
    icon: 'local_cafe',
  },
  {
    id: 5,
    title: 'Premium Dining',
    description: 'Award-winning luxury experience',
    icon: 'restaurant',
  },
];

const TrustSection = () => {
  return (
    <section className="bg-stone-950 border-y border-stone-900/60 py-10 w-full relative z-20">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`flex flex-col items-center text-center p-3 group ${
                index !== trustItems.length - 1 ? 'md:border-r border-stone-900/40' : ''
              }`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              {/* Gold Icon */}
              <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center text-orange-200/80 mb-3 group-hover:text-orange-200 group-hover:border-orange-200/30 group-hover:scale-110 transition-all duration-300">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-stone-200 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-orange-100 transition-colors">
                {item.title}
              </h3>
              <p className="text-stone-500 text-[10px] tracking-wide leading-relaxed max-w-[150px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
