import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';
import storyInterior from '../assets/images/story-interior.webp';
import storyPour from '../assets/images/story-pour.webp';

const Serenity = () => {
  return (
    <section className="py-32 bg-stone-900/30 relative">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Image Grid */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="rounded-3xl overflow-hidden w-full h-64 mt-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ImageWithFallback 
                  src={storyInterior}
                  alt="minimalist cafe interior with soft morning light hitting clean wooden tables and stone walls"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </motion.div>
              <motion.div
                className="rounded-3xl overflow-hidden w-full h-80"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ImageWithFallback 
                  src={storyPour}
                  alt="close up of hand pouring steamed milk into coffee, captured in a moment of stillness"
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="font-label text-xs tracking-[0.3em] uppercase text-orange-200 mb-6 block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              The Treaty of Calm
            </motion.span>
            
            <motion.h2 
              className="font-headline text-5xl md:text-6xl text-stone-100 mb-8 leading-tight italic font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Designed for the <br/>pause in your day.
            </motion.h2>
            
            <motion.p 
              className="text-stone-400 text-lg font-light leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Aura isn't just a cafe; it's a sanctuary. We believe in high craftsmanship—from the tactile weight of our ceramics to the acoustic dampening of our stone walls. Every detail is a promise of serenity.
            </motion.p>
            
            <motion.ul 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {[
                'Ethically Sourced Heirloom Beans',
                'Acoustically Curated Atmosphere',
                'Artisanal Ceramic Houseware'
              ].map((feature, index) => (
                <motion.li 
                  key={feature}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-orange-200 viscous-hover group-hover:scale-[2]"
                    whileHover={{ scale: 2 }}
                    transition={{ duration: 0.3 }}
                  ></motion.span>
                  <span className="font-label text-sm tracking-widest text-stone-300 uppercase">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Serenity;