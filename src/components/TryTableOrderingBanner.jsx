import React from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../contexts/OrderContext';

const TryTableOrderingBanner = () => {
  const { setModeSelectorOpen } = useOrders();

  return (
    <section className="py-12 bg-stone-950 px-8">
      <div className="container mx-auto max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-200/10 via-amber-400/5 to-transparent border border-orange-200/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          {/* Glass background overlay */}
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-xl -z-10" />

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-orange-200/10 blur-3xl" />

          {/* Content */}
          <div className="text-left space-y-3 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-200/10 border border-orange-200/20 text-orange-200 text-[10px] tracking-widest uppercase font-bold">
              🍽️ Dine-In Smart Ordering
            </div>
            <h2 className="font-headline text-3xl md:text-4xl text-stone-100 italic font-light">
              Skip the queue.
            </h2>
            <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
              Scan your table QR code and place orders instantly from your phone. Our staff will bring your selections straight to your seat.
            </p>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModeSelectorOpen(true)}
            className="shrink-0 bg-orange-200 text-stone-950 px-8 py-4 rounded-full font-label text-xs font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all shadow-[0_0_30px_rgba(254,212,136,0.15)] z-10"
          >
            Try Table Ordering
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TryTableOrderingBanner;
