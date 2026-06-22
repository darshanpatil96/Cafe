import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from './ImageWithFallback';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${
            i < full
              ? 'text-yellow-400'
              : i === full && half
              ? 'text-yellow-400/60'
              : 'text-stone-700'
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-stone-500 text-[10px] ml-1 font-mono">{rating.toFixed(1)}</span>
    </span>
  );
};

const MenuCard = ({ item, onOpenModal }) => {
  const { addItem, openDrawer } = useCart();
  const [qty, setQty] = useState(1);
  const [addedPulse, setAddedPulse] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    for (let i = 0; i < qty; i++) {
      addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
      });
    }
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 800);
    setQty(1);
  };

  const handleOrderNow = (e) => {
    e.stopPropagation();
    for (let i = 0; i < qty; i++) {
      addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
      });
    }
    setQty(1);
    openDrawer();
  };

  return (
    <motion.div
      layout
      onClick={() => onOpenModal(item)}
      className="relative flex flex-col bg-stone-900/60 backdrop-blur-md border border-stone-800/60 rounded-2xl overflow-hidden cursor-pointer group hover:border-orange-200/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(254,212,136,0.06)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Badge */}
      {item.badge && (
        <div className="absolute top-3 left-3 z-10 bg-orange-200 text-stone-950 text-[9px] font-extrabold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
          {item.badge}
        </div>
      )}

      {/* Unavailable overlay */}
      {!item.isAvailable && (
        <div className="absolute inset-0 z-20 bg-stone-950/70 flex items-center justify-center backdrop-blur-sm rounded-2xl">
          <span className="bg-stone-900 border border-stone-700 text-stone-400 text-xs tracking-widest uppercase px-4 py-2 rounded-full">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          wrapperClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent pointer-events-none" />

        {/* Veg / Non-Veg indicator */}
        <div className="absolute top-3 right-3">
          <div
            className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
              item.isVeg ? 'border-green-400' : 'border-red-500'
            } bg-stone-950/80`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? 'bg-green-400' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline text-lg text-stone-100 leading-tight group-hover:text-orange-100 transition-colors">
            {item.title}
          </h3>
          <span className="font-bold text-orange-200 text-base whitespace-nowrap shrink-0">
            ₹{item.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 font-light">
          {item.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap">
          <StarRating rating={item.rating} />
          <span className="flex items-center gap-1 text-stone-500 text-xs">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {item.prepTime}
          </span>
        </div>

        {/* Qty + Buttons */}
        <div
          className="flex flex-col gap-2 mt-auto pt-3 border-t border-stone-800/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-stone-500 text-xs tracking-widest uppercase">Quantity</span>
            <div className="flex items-center gap-0">
              <button
                onClick={(e) => { e.stopPropagation(); setQty(Math.max(1, qty - 1)); }}
                className="w-7 h-7 flex items-center justify-center rounded-l-full border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-orange-200 transition-all text-base font-bold"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 h-7 flex items-center justify-center border-t border-b border-stone-700 text-stone-200 text-sm font-mono">
                {qty}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setQty(qty + 1); }}
                className="w-7 h-7 flex items-center justify-center rounded-r-full border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-orange-200 transition-all text-base font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleAdd}
              animate={addedPulse ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="flex-1 py-2.5 rounded-xl border border-orange-200/40 text-orange-200 text-xs font-bold tracking-widest uppercase hover:bg-orange-200/10 transition-all duration-300"
              aria-label="Add to cart"
            >
              {addedPulse ? '✓ Added' : 'Add to Cart'}
            </motion.button>
            <button
              onClick={handleOrderNow}
              className="flex-1 py-2.5 rounded-xl bg-orange-200 text-stone-950 text-xs font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all duration-300"
              aria-label="Order now"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
