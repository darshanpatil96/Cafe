import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const favoritesData = [
  {
    id: 'signature-cappuccino',
    title: 'Signature Cappuccino',
    price: 260,
    description: 'Double ristretto pulled from single-origin organic beans, combined with silk microfoam and a dusting of cocoa.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
    prepTime: '5 mins',
    rating: 4.9,
    isVeg: true,
  },
  {
    id: 'truffle-pasta',
    title: 'Truffle Pasta',
    price: 680,
    description: 'Handmade fresh tagliatelle tossed in dry white wine reduction, wild porcini cream, and freshly shaved summer black truffle.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80',
    prepTime: '15 mins',
    rating: 5.0,
    isVeg: true,
  },
  {
    id: 'veloura-cheesecake',
    title: 'Veloura Cheesecake',
    price: 420,
    description: 'Decadent Basque-baked cheesecake with a deeply caramelized dark exterior and a rich, melt-in-your-mouth custard core.',
    image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600&auto=format&fit=crop&q=80',
    prepTime: '6 mins',
    rating: 4.9,
    isVeg: true,
  },
  {
    id: 'cold-brew-reserve',
    title: 'Cold Brew Reserve',
    price: 290,
    description: 'Single-origin Geisha beans slow-steeped over alkaline ice water for 18 hours, offering notes of jasmine and sweet orange.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
    prepTime: '3 mins',
    rating: 4.8,
    isVeg: true,
  },
];

const GuestFavorites = () => {
  const { addItem, openDrawer } = useCart();
  const [pulseItemId, setPulseItemId] = useState(null);

  const handleAdd = (item) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
    });
    setPulseItemId(item.id);
    setTimeout(() => setPulseItemId(null), 800);
  };

  const handleOrder = (item) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
    });
    openDrawer();
  };

  return (
    <section className="py-32 bg-stone-950/60 border-t border-stone-900/30 relative">
      <div className="container mx-auto px-8 max-w-screen-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="font-label text-xs tracking-[0.3em] uppercase text-orange-200 mb-4 block">
            Most Ordered
          </span>
          <h2 className="font-headline text-5xl md:text-6xl text-stone-100 italic font-light">
            Guest Favorites
          </h2>
          <p className="text-stone-500 font-light text-base max-w-lg mt-4">
            A curated signature selection representing the pinnacle of Veloura craftsmanship.
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {favoritesData.map((item, index) => (
            <motion.div
              key={item.id}
              className="group flex flex-col bg-stone-900/40 border border-stone-900 rounded-3xl overflow-hidden hover:border-orange-200/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 bg-orange-200/90 backdrop-blur text-stone-950 text-[9px] font-extrabold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                Favorite
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-headline text-xl text-stone-100 group-hover:text-orange-100 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-orange-200 font-bold text-base whitespace-nowrap shrink-0 pt-0.5">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-stone-400 text-xs font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Rating / Meta */}
                <div className="flex items-center gap-4 text-[10px] text-stone-500 font-mono mt-auto pt-2">
                  <span className="flex items-center gap-0.5 text-yellow-500">
                    ★ <span className="text-stone-400 font-sans ml-0.5">{item.rating.toFixed(1)}</span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] pt-0.5">schedule</span>
                    {item.prepTime}
                  </span>
                </div>

                {/* Add to Cart Actions */}
                <div className="flex gap-2 pt-2 border-t border-stone-900/60" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    onClick={() => handleAdd(item)}
                    animate={pulseItemId === item.id ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="flex-1 py-2 rounded-xl border border-orange-200/40 text-orange-200 text-[10px] font-bold tracking-widest uppercase hover:bg-orange-200/10 transition-all"
                  >
                    {pulseItemId === item.id ? '✓ Added' : 'Add to Cart'}
                  </motion.button>
                  <button
                    onClick={() => handleOrder(item)}
                    className="flex-1 py-2 rounded-xl bg-orange-200 text-stone-950 text-[10px] font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GuestFavorites;
