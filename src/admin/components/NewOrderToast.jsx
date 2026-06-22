import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

/**
 * Global new-order toast — mounts at app root, shows the latest incoming order.
 * Works on both customer site (shows confirmation) and admin (shows order alert).
 */
const NewOrderToast = ({ adminMode = false }) => {
  const { orders } = useOrders();
  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState(null);
  const prevLen = useRef(orders.length);
  const navigate = useNavigate();

  useEffect(() => {
    if (orders.length > prevLen.current) {
      const newest = orders[0];
      prevLen.current = orders.length;
      // Batch updates together using a microtask to avoid cascading renders
      Promise.resolve().then(() => {
        setOrder(newest);
        setVisible(true);
      });
      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    }
    prevLen.current = orders.length;
  }, [orders]);

  return (
    <AnimatePresence>
      {visible && order && (
        <motion.div
          key={order.id}
          className="fixed top-20 right-4 z-[9990] w-80 cursor-pointer"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={() => {
            setVisible(false);
            if (adminMode) navigate(`/admin/order/${order.id}`);
          }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/30 to-orange-400/10 blur-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative bg-stone-950/95 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-4 shadow-2xl shadow-amber-400/10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                <span className="material-symbols-outlined text-amber-400 text-xl" style={{fontVariationSettings:"'FILL' 1"}}>
                  {adminMode ? 'receipt_long' : 'check_circle'}
                </span>
              </motion.div>
              <div>
                <p className="text-amber-300 text-xs font-extrabold tracking-widest uppercase">
                  {adminMode ? '🔔 New Order!' : 'Order Placed!'}
                </p>
                <p className="text-stone-300 text-xs">
                  {adminMode ? `${order.customerName} · ₹${order.total}` : `#${order.orderNumber} confirmed`}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setVisible(false); }}
                className="ml-auto text-stone-600 hover:text-stone-300 transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Items preview */}
            <div className="space-y-1 mb-3">
              {order.items.slice(0, 2).map(i => (
                <div key={i.id} className="flex justify-between text-xs">
                  <span className="text-stone-400 truncate">{i.title} ×{i.quantity}</span>
                  <span className="text-stone-300 font-mono ml-2">₹{i.price * i.quantity}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-stone-600 text-xs">+{order.items.length - 2} more items</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-amber-300 font-bold text-sm">₹{order.total}</span>
              {adminMode && (
                <span className="text-stone-500 text-[10px] uppercase tracking-wider">Click to view →</span>
              )}
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-amber-400 rounded-b-2xl"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewOrderToast;
