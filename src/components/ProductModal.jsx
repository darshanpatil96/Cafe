import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from './ImageWithFallback';

const StarRating = ({ rating }) => (
  <span className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.round(rating) ? 'text-yellow-400' : 'text-stone-700'}`}
      >
        ★
      </span>
    ))}
    <span className="text-stone-400 text-sm ml-1">{rating.toFixed(1)}</span>
  </span>
);

const ProductModal = ({ item, onClose }) => {
  const { addItem, openDrawer } = useCart();
  const [qty, setQty] = useState(1);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!item) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, title: item.title, price: item.price, image: item.image, isVeg: item.isVeg });
    }
    onClose();
  };

  const handleOrderNow = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, title: item.title, price: item.price, image: item.image, isVeg: item.isVeg });
    }
    onClose();
    openDrawer();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9980] flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full sm:max-w-2xl bg-stone-900 border border-stone-800/60 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-800/80 backdrop-blur flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-all"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 no-scrollbar">
            {/* Hero Image */}
            <div className="relative w-full aspect-video overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent pointer-events-none" />

              {/* Veg indicator */}
              <div className="absolute top-4 left-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    item.isVeg
                      ? 'border-green-400 text-green-400 bg-stone-950/80'
                      : 'border-red-400 text-red-400 bg-stone-950/80'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-400' : 'bg-red-400'}`} />
                  {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </div>
              </div>

              {/* Badge */}
              {item.badge && (
                <div className="absolute top-4 right-14 bg-orange-200 text-stone-950 text-[9px] font-extrabold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                  {item.badge}
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* Title + Price */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-headline text-2xl text-stone-100 leading-tight">{item.title}</h2>
                <span className="text-2xl font-bold text-orange-200 shrink-0">₹{item.price}</span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 items-center">
                <StarRating rating={item.rating} />
                <span className="flex items-center gap-1 text-stone-400 text-sm">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {item.prepTime}
                </span>
                {!item.isAvailable && (
                  <span className="text-xs text-red-400 border border-red-400/30 px-2 py-0.5 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-stone-400 text-xs tracking-widest uppercase mb-2 font-bold">About this dish</h4>
                <p className="text-stone-300 text-sm leading-relaxed font-light">{item.fullDescription}</p>
              </div>

              {/* Ingredients */}
              {item.ingredients && (
                <div>
                  <h4 className="text-stone-400 text-xs tracking-widest uppercase mb-3 font-bold">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="bg-stone-800/60 border border-stone-700/50 text-stone-300 text-xs px-3 py-1 rounded-full"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition */}
              {item.nutrition && (
                <div>
                  <h4 className="text-stone-400 text-xs tracking-widest uppercase mb-3 font-bold">Nutrition per serving</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(item.nutrition).map(([key, val]) => (
                      <div key={key} className="bg-stone-800/40 border border-stone-700/30 rounded-xl p-3 text-center">
                        <p className="text-orange-200 font-bold text-base">{val}</p>
                        <p className="text-stone-500 text-[10px] uppercase tracking-wider mt-0.5 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="border-t border-stone-800/60 p-5 bg-stone-900">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-0 shrink-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-l-full border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-orange-200 transition-all font-bold"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-9 h-8 flex items-center justify-center border-t border-b border-stone-700 text-stone-200 text-sm font-mono">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-r-full border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-orange-200 transition-all font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!item.isAvailable}
                className="flex-1 py-3 rounded-xl border border-orange-200/40 text-orange-200 text-xs font-bold tracking-widest uppercase hover:bg-orange-200/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleOrderNow}
                disabled={!item.isAvailable}
                className="flex-1 py-3 rounded-xl bg-orange-200 text-stone-950 text-xs font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Order Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
