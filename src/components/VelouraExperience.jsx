import React from 'react';
import { motion } from 'framer-motion';

const experienceCards = [
  {
    id: 'roast',
    title: 'The Roast Room',
    subtitle: 'Small-Batch Roasting',
    description: 'We roast micro-lots weekly to optimize expansion, unlocking crisp floral acidity and deep caramelized finishes.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
  },
  {
    id: 'spaces',
    title: 'Sensory Galleries',
    subtitle: 'Architectural Sanctuary',
    description: 'Designed around acoustics, texture, and silence—featuring brushed brass, plaster, and natural basalt stone.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  },
  {
    id: 'brew',
    title: 'Precision Brewing',
    subtitle: 'Artisanal Science',
    description: 'Baristas calibrating water chemistry, pressure profiles, and extraction yields for a perfectly balanced cup.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  },
];

const VelouraExperience = () => {
  return (
    <section id="story" className="py-32 bg-stone-950 border-t border-stone-900/30 relative overflow-hidden">
      <div className="container mx-auto px-8 max-w-screen-2xl">
        
        {/* Title and Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-label text-xs tracking-[0.3em] uppercase text-orange-200 mb-4 block">
              The Brand Philosophy
            </span>
            <h2 className="font-headline text-5xl md:text-6xl text-stone-100 leading-tight italic font-light">
              Designed for the <br/>stillness in your day.
            </h2>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-7 text-stone-400 text-base md:text-lg font-light leading-relaxed space-y-6 pt-4"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <p>
              Veloura Café is not merely a destination; it is a sanctuary crafted around the slow-living philosophy. 
              We operate at the intersection of high culinary craftsmanship and architectural minimalism—where 
              the tactile feedback of our custom hand-thrown ceramics, the acoustic dampening of plaster walls, and the 
              golden ratio layouts serve a singular purpose: absolute presence.
            </p>
            <p>
              Our beans are ethically sourced from private estates across Ethiopia, Colombia, and Yemen, 
              preserving microclimate characteristics that tell the story of their soil. Every cup is brewed with 
              uncompromising intention, promising a moment of clarity in a fast-moving world.
            </p>
          </motion.div>
        </div>

        {/* Three Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experienceCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="group bg-stone-900/40 border border-stone-900 rounded-3xl overflow-hidden hover:border-orange-200/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Image Container with hover zoom */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent opacity-80" />
              </div>
              
              {/* Details */}
              <div className="p-8 space-y-3">
                <span className="font-label text-[10px] tracking-[0.25em] uppercase text-orange-200/80 font-bold block">
                  {card.subtitle}
                </span>
                <h3 className="font-headline text-2xl text-stone-100 group-hover:text-orange-100 transition-colors">
                  {card.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed font-light">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VelouraExperience;
