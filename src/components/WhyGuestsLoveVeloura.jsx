import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'No waiting in line',
    desc: 'Bypass the cash counter. Order immediately when you sit down without queueing up.',
    icon: 'hourglass_empty'
  },
  {
    title: 'Order from your seat',
    desc: 'Browse items at your leisure, add customize instructions, and reorder drinks on demand.',
    icon: 'chair'
  },
  {
    title: 'Real-time kitchen updates',
    desc: 'Track the status of your order from Pending to Preparing and Ready to Serve live on screen.',
    icon: 'update'
  },
  {
    title: 'Secure digital checkout',
    desc: 'Pay safely and instantly from your phone. Zero terminal delays or card swipe issues.',
    icon: 'security'
  },
  {
    title: 'Faster service',
    desc: 'Direct order routing to baristas means preparations start faster, cutting down table wait times.',
    icon: 'speed'
  }
];

const WhyGuestsLoveVeloura = () => {
  return (
    <section className="py-24 bg-stone-950">
      <div className="container mx-auto px-8 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start">
          {/* Header area */}
          <div className="space-y-6 text-left sticky top-24">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-orange-200 block">
              Exceptional Dining
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-stone-100 italic leading-tight font-light">
              Why Guests <br/>Love Veloura.
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              We design spaces for pause and presence. Our smart ordering platform eliminates friction, leaving you more time to savor crafted flavors and quiet conversations.
            </p>
            <div className="w-16 h-0.5 bg-orange-200/30 rounded" />
          </div>

          {/* Grid items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f, index) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-stone-900/10 border border-stone-850 hover:border-orange-200/20 p-8 rounded-[2rem] space-y-4 hover:bg-stone-900/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-200/5 border border-orange-200/10 flex items-center justify-center text-orange-200 group-hover:bg-orange-200/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">{f.icon}</span>
                </div>
                <h3 className="font-headline text-xl text-stone-100 group-hover:text-orange-100 transition-colors">
                  {f.title}
                </h3>
                <p className="text-stone-400 text-xs font-light leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGuestsLoveVeloura;
