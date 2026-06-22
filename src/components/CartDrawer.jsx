import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartDrawer = () => {
  const { items, isOpen, closeDrawer, removeItem, updateQty, subtotal, gst, grandTotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9970] bg-stone-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[9975] bg-stone-900 border-l border-stone-800/60 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800/60">
              <div className="flex items-center gap-3">
                <h2 className="font-headline text-lg text-stone-100">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-orange-200 text-stone-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
                aria-label="Close cart"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
                  <span className="material-symbols-outlined text-5xl text-stone-700">shopping_bag</span>
                  <p className="text-stone-500 font-light text-sm">Your cart is empty.</p>
                  <button
                    onClick={closeDrawer}
                    className="text-orange-200 text-xs tracking-widest uppercase font-bold underline underline-offset-4"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 bg-stone-800/40 border border-stone-700/40 rounded-xl p-3"
                  >
                    {/* Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-stone-200 text-sm font-medium leading-tight truncate">{item.title}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-600 hover:text-red-400 transition-colors shrink-0"
                          aria-label={`Remove ${item.title}`}
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty */}
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-l border border-stone-600 text-stone-400 hover:text-orange-200 hover:bg-stone-700 transition-all text-sm font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-7 h-6 flex items-center justify-center border-t border-b border-stone-600 text-stone-200 text-xs font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-r border border-stone-600 text-stone-400 hover:text-orange-200 hover:bg-stone-700 transition-all text-sm font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-orange-200 font-bold text-sm">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="border-t border-stone-800/60 px-6 py-5 space-y-4 bg-stone-900">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span className="text-stone-200">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>GST (5%)</span>
                    <span className="text-stone-200">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-stone-100 font-bold text-base pt-2 border-t border-stone-800">
                    <span>Total</span>
                    <span className="text-orange-200">₹{grandTotal}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="block w-full text-center py-3.5 rounded-xl bg-orange-200 text-stone-950 font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
