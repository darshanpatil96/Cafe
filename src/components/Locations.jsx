import React from 'react';
import { motion } from 'framer-motion';

const Locations = () => {
  const locations = [
    {
      id: 1,
      name: 'Downtown Haven',
      address: '124 Serenity Lane, Central District',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChxO9Mo6x7RpepXHVkYqxw4_tctqV158FSKu3tEy3AsXQQNkzpy_zrwdV_otE-8tb41yrgUSd2FhQtw8AkqVlKmN3NDu0kHyl9cDhXtdNnUD7BbcPhy3NdpsJVdEVw62vDY8AifxGlCuVjHsyUH3cwec5Y589fh2scIfwvAMi7t5HYZPgFxm27kHje2p6YQwU2Uu-yNKFECq4VAh1YDNYqXttpYJWOJM5zvzYoA61ylR3tm0F0PLqSshSypUOcOMR8PoDur9bvCw',
      description: 'Our flagship location in the heart of the city'
    },
    {
      id: 2,
      name: 'The Garden Loft',
      address: '88 Botanist Way, North Hills',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkNU98aAWA2Iwx-jZH725rbsLLF6vttUtAfidcrZXId0N7mKBJTLUjYjjPGiPDqylVgl1oTvyTycypCyqvPhl-FK_SEQ2aem5Urj_E9ri6G4GSV4JYibR_sSEkxtoB-TnD5CLOC_p1zDL8VE1NaS7dkBFBEMv4kFVLhYUJR3ApouZeXQpaTGslE_rk3UmxbRhjQbu53DKphmIUb-8PU4m9fGRyY2MpjSvCIi0ry3PsSaXO33y89lry7cpsR7vBxL0mEGrVRuoMWA',
      description: 'A peaceful retreat surrounded by nature'
    },
    {
      id: 3,
      name: 'Artisan Row',
      address: '42 Craft St, Creative Quarter',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu5PdrP83M1Km1grJF37Zi11AFQZ81c8HgmVooTWSKFk_uLG427813iqNZ0as1DAd5SxGrIqnlvHI1guuSxZY4YBQZJ5dgWNLqJJGmWf9XYXFV0u0yOHcNE2xkojw9OQDs4-DMT_Ew7tFWDe09RfzLVWUVVH1iXs5hiqnFjlOKjgqS5zW0UauI02y_AuPM6L3T62txy4WO6Hedz9bGju09gSO8vMdn0dNXlmn_TrLycLhGPM3Gcbb97njxL8hCVRzgMXL4ZZb-Nw',
      description: 'Where art and coffee culture collide'
    }
  ];

  return (
    <section className="py-32 bg-stone-950">
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
            Visit an Aura
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
                <img 
                  className="w-full aspect-square object-cover viscous-hover group-hover:scale-110 group-hover:rotate-1" 
                  src={location.image} 
                  alt={`Exterior of ${location.name}`}
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