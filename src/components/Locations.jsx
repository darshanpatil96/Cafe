import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';
import locationDowntown from '../assets/images/location-downtown.webp';
import locationGarden from '../assets/images/location-garden.webp';
import locationArtisan from '../assets/images/location-artisan.webp';

const Locations = () => {
  const locations = [
    {
      id: 1,
      name: 'Downtown Haven',
      address: '124 Serenity Lane, Central District',
      image: locationDowntown,
      description: 'Our flagship location in the heart of the city'
    },
    {
      id: 2,
      name: 'The Garden Loft',
      address: '88 Botanist Way, North Hills',
      image: locationGarden,
      description: 'A peaceful retreat surrounded by nature'
    },
    {
      id: 3,
      name: 'Artisan Row',
      address: '42 Craft St, Creative Quarter',
      image: locationArtisan,
      description: 'Where art and coffee culture collide'
    }
  ];

  return (
    <section id="locations" className="py-32 bg-stone-950">
      <div className="container mx-auto px-8">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="font-headline text-5xl text-stone-100 mb-4 italic"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Visit a Veloura Gallery
          </motion.h2>
          <motion.p 
            className="text-stone-500 font-light tracking-widest uppercase text-xs"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A presence in the most serene corners
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="overflow-hidden rounded-[2rem] mb-8"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback 
                  className="w-full aspect-square object-cover viscous-hover group-hover:scale-110 group-hover:rotate-1" 
                  src={location.image} 
                  alt={`Exterior of ${location.name}`}
                  wrapperClassName="w-full aspect-square"
                  loading="lazy"
                />
              </motion.div>
              
              <motion.h3 
                className="font-headline text-2xl text-stone-100 mb-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
              >
                {location.name}
              </motion.h3>
              
              <motion.p 
                className="text-stone-500 font-light text-sm tracking-wide mb-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.0 + index * 0.2 }}
              >
                {location.address}
              </motion.p>
              
              <motion.p 
                className="text-stone-400 font-light text-sm mb-6"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.2 }}
              >
                {location.description}
              </motion.p>
              
              <motion.a 
                href="#"
                className="inline-flex items-center gap-2 text-orange-200 font-label text-[10px] tracking-[0.2em] uppercase font-bold group-hover:translate-x-2 transition-transform"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.4 + index * 0.2 }}
              >
                View Directions <span className="material-symbols-outlined text-sm">north_east</span>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;