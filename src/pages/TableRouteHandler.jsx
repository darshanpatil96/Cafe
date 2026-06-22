import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../contexts/OrderContext';
import { useTransition } from '../contexts/TransitionContext';

const TableRouteHandler = () => {
  const { tableNum } = useParams();
  const { setOrderType, setTableNumber, setDineInStatus } = useOrders();
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  const num = Number(tableNum);
  const isValid = Number.isInteger(num) && num >= 1 && num <= 50;

  useEffect(() => {
    if (!isValid) {
      navigate('/', { replace: true });
    }
  }, [isValid, navigate]);

  if (!isValid) return null;

  const handleStartOrdering = () => {
    setOrderType('Dine In');
    setTableNumber(tableNum);
    setDineInStatus('Active');
    
    startTransition(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative luxury glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-200/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative z-10 w-full max-w-md bg-stone-900/60 backdrop-blur-xl border border-stone-800/60 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl hover:border-orange-200/20 transition-all duration-500"
      >
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/10">
          <span className="material-symbols-outlined text-stone-950 text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
        </div>

        {/* Headings */}
        <h1 className="font-headline text-4xl text-stone-100 italic font-light mb-3">
          Welcome to Veloura Café
        </h1>
        <p className="text-stone-400 text-sm font-light leading-relaxed mb-8">
          You are ordering from:
        </p>

        {/* Table Number Display */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-3xl py-6 px-8 mb-10 max-w-[200px] mx-auto">
          <span className="block text-stone-500 text-[10px] uppercase tracking-[0.25em] mb-1">Table</span>
          <span className="block font-mono text-5xl font-black text-orange-200">{tableNum}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartOrdering}
          className="w-full py-4 bg-orange-200 text-stone-950 font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-orange-100 transition-all shadow-[0_0_30px_rgba(254,212,136,0.15)] flex items-center justify-center gap-2"
        >
          Start Ordering
          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
        </button>
      </motion.div>
    </div>
  );
};

export default TableRouteHandler;
