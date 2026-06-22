import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '../contexts/OrderContext';

const OrderingModeSelectorModal = () => {
  const {
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    dineInStatus,
    setDineInStatus,
    modeSelectorOpen,
    setModeSelectorOpen
  } = useOrders();

  const [tempType, setTempType] = useState(orderType);
  const [tempTable, setTempTable] = useState(tableNumber);

  if (!modeSelectorOpen) return null;

  const handleConfirm = () => {
    setOrderType(tempType);
    if (tempType === 'Dine In') {
      if (!tempTable) {
        alert('Please select a table number.');
        return;
      }
      setTableNumber(tempTable);
      setDineInStatus('Active');
    } else {
      setTableNumber('');
      setDineInStatus('Available');
    }
    setModeSelectorOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModeSelectorOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-lg bg-stone-950 border border-stone-850 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="font-headline text-2xl italic text-stone-100">Select Order Mode</h2>
            <button
              onClick={() => setModeSelectorOpen(false)}
              className="text-stone-500 hover:text-stone-200 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto no-scrollbar p-6 space-y-6 flex-1">
            {/* Options grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'Dine In', icon: 'restaurant', desc: 'Eat at Table' },
                { type: 'Takeaway', icon: 'shopping_bag', desc: 'Pickup Counter' },
                { type: 'Delivery', icon: 'local_shipping', desc: 'To Doorstep' }
              ].map(opt => {
                const active = tempType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setTempType(opt.type)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                      active
                        ? 'bg-orange-200/10 border-orange-200/40 text-orange-200 shadow-lg shadow-orange-500/5'
                        : 'bg-stone-900/40 border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl mb-2" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{opt.icon}</span>
                    <span className="font-label text-xs font-bold uppercase tracking-wider">{opt.type}</span>
                    <span className="text-[9px] text-stone-600 mt-1 text-center font-light leading-tight">{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-panel for Dine-In Table grid */}
            {tempType === 'Dine In' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 border-t border-white/5 pt-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Select Table Number</span>
                  {tempTable && (
                    <span className="text-orange-200 font-mono text-xs font-bold bg-orange-200/10 border border-orange-200/20 px-2 py-0.5 rounded-lg">
                      Table {tempTable} Selected
                    </span>
                  )}
                </div>

                {/* Table buttons grid */}
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto pr-1 no-scrollbar border border-stone-900 bg-stone-900/20 rounded-2xl p-3">
                  {Array.from({ length: 50 }).map((_, i) => {
                    const tNum = String(i + 1);
                    const selected = tempTable === tNum;
                    return (
                      <button
                        key={tNum}
                        onClick={() => setTempTable(tNum)}
                        className={`aspect-square flex items-center justify-center rounded-xl font-mono text-xs font-bold border transition-all duration-200 ${
                          selected
                            ? 'bg-orange-200 text-stone-950 border-orange-200 shadow-md shadow-orange-500/10'
                            : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        {tNum}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-stone-950/60">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-orange-200 text-stone-950 font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-orange-100 transition-all shadow-[0_0_20px_rgba(254,212,136,0.1)]"
            >
              Confirm Selection
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderingModeSelectorModal;
