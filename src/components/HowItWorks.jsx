import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Scan Your Table QR Code',
    desc: 'Locate the unique QR code on your table and scan it using your smartphone camera to link your session.',
    icon: 'qr_code_scanner'
  },
  {
    number: '02',
    title: 'Browse & Customize',
    desc: 'Explore our interactive 3D menu curation, adjust quantities, add notes, and place your order instantly.',
    icon: 'restaurant_menu'
  },
  {
    number: '03',
    title: 'Relax & Enjoy',
    desc: 'Our barista and kitchen teams prepare your items and serve them directly to your table. Zero waiting.',
    icon: 'local_cafe'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 15 }
  }
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-stone-950 border-t border-stone-900/30">
      <div className="container mx-auto px-8 max-w-screen-xl">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <motion.span 
            className="font-label text-xs tracking-[0.3em] uppercase text-orange-200 mb-3 block"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Seamless Dining
          </motion.span>
          <motion.h2 
            className="font-headline text-4xl md:text-5xl text-stone-100 italic mb-4 font-light"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Order In 3 Simple Steps
          </motion.h2>
          <motion.p 
            className="text-stone-500 text-sm font-light leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Skip the line and order directly from your seat. No app install required.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((s, idx) => (
            <motion.div
              key={s.number}
              variants={cardVariants}
              whileHover={{ y: -6, borderColor: 'rgba(254, 212, 136, 0.25)' }}
              className="group bg-stone-900/30 backdrop-blur-md border border-stone-850 rounded-[2rem] p-8 flex flex-col items-start text-left transition-all duration-300"
            >
              {/* Top row */}
              <div className="flex items-center justify-between w-full mb-8">
                <span className="font-mono text-stone-700 text-3xl font-extrabold group-hover:text-orange-200/50 transition-colors duration-300">
                  {s.number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-400 group-hover:text-orange-200 group-hover:border-orange-200/30 transition-all duration-300">
                  <span className="material-symbols-outlined text-xl">{s.icon}</span>
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-headline text-2xl text-stone-100 mb-3 group-hover:text-orange-100 transition-colors">
                {s.title}
              </h3>
              <p className="text-stone-400 text-xs font-light leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
