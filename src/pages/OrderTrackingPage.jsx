import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders, ORDER_STATUS } from '../contexts/OrderContext';
import { supabase, normalizeOrder, isSupabaseReady } from '../lib/supabase';

// ─── Default static steps fallback ───────────────────────────────────────────
const DEFAULT_STEPS = [
  { status: ORDER_STATUS.PENDING,   label: 'Order Received',  icon: 'receipt_long',    desc: 'Placed and awaiting confirmation.' },
  { status: ORDER_STATUS.CONFIRMED, label: 'Order Confirmed', icon: 'check_circle',   desc: 'Our team has accepted your order.' },
  { status: ORDER_STATUS.PREPARING, label: 'Preparing',      icon: 'outdoor_grill',   desc: 'Our chefs are crafting your order.' },
  { status: ORDER_STATUS.READY,     label: 'Ready',          icon: 'done_all',        desc: 'Your order is ready!' },
  { status: ORDER_STATUS.COMPLETED, label: 'Delivered',      icon: 'local_shipping',  desc: 'Enjoy your meal!' },
];

const COLOR_MAP = {
  amber:   { ring: 'ring-amber-400',   bg: 'bg-amber-400',   text: 'text-amber-300',   glow: 'shadow-amber-400/30',   border: 'border-amber-400/40'   },
  blue:    { ring: 'ring-blue-400',    bg: 'bg-blue-400',    text: 'text-blue-300',    glow: 'shadow-blue-400/30',    border: 'border-blue-400/40'    },
  orange:  { ring: 'ring-orange-400',  bg: 'bg-orange-400',  text: 'text-orange-300',  glow: 'shadow-orange-400/30',  border: 'border-orange-400/40'  },
  emerald: { ring: 'ring-emerald-400', bg: 'bg-emerald-400', text: 'text-emerald-300', glow: 'shadow-emerald-400/30', border: 'border-emerald-400/40' },
  green:   { ring: 'ring-green-400',   bg: 'bg-green-400',   text: 'text-green-300',   glow: 'shadow-green-400/30',   border: 'border-green-400/40'   },
};

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const ETA = {
  [ORDER_STATUS.PENDING]:   '~20 mins',
  [ORDER_STATUS.CONFIRMED]: '~15 mins',
  [ORDER_STATUS.PREPARING]: '~10 mins',
  [ORDER_STATUS.READY]:     'Ready now',
  [ORDER_STATUS.COMPLETED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: '—',
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const [order, setOrder] = useState(() => getOrder(orderId));
  const [loading, setLoading] = useState(!order);

  // ── Subscribe to live status updates for THIS order ───────────────────────
  useEffect(() => {
    if (!isSupabaseReady()) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        async () => {
          // Re-fetch full order with items
          const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single();
          if (data) setOrder(normalizeOrder(data));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  // ── Initial fetch if not in local state ──────────────────────────────────
  useEffect(() => {
    if (order) { setLoading(false); return; }
    if (!isSupabaseReady()) { setLoading(false); return; }

    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setOrder(normalizeOrder(data));
        setLoading(false);
      });
  }, [orderId, order]);

  // ── Sync from context when context updates ───────────────────────────
  const contextOrder = getOrder(orderId);
  useEffect(() => {
    if (contextOrder) setOrder(contextOrder);
  }, [contextOrder]);

  const isCancelled = order?.status === ORDER_STATUS.CANCELLED;
  const isDineIn = order?.orderType === 'Dine In';

  // Dynamic timeline steps
  const steps = useMemo(() => {
    return [
      {
        status: ORDER_STATUS.PENDING,
        label:  'Order Received',
        icon:   'receipt_long',
        desc:   'Your order has been placed and is awaiting confirmation.',
        color:  'amber',
      },
      {
        status: ORDER_STATUS.CONFIRMED,
        label:  'Order Confirmed',
        icon:   'check_circle',
        desc:   isDineIn ? 'Our team has confirmed your order.' : 'Our team has accepted your order.',
        color:  'blue',
      },
      {
        status: ORDER_STATUS.PREPARING,
        label:  'Preparing',
        icon:   'outdoor_grill',
        desc:   isDineIn ? 'Our chefs are crafting your dishes.' : 'Our chefs are crafting your order with care.',
        color:  'orange',
      },
      {
        status: ORDER_STATUS.READY,
        label:  isDineIn ? 'Ready to Serve' : 'Ready',
        icon:   'done_all',
        desc:   isDineIn ? 'Your meal is prepared and will be served shortly.' : 'Your order is ready! Pickup or delivery in progress.',
        color:  'emerald',
      },
      {
        status: ORDER_STATUS.COMPLETED,
        label:  isDineIn ? 'Served' : 'Delivered',
        icon:   isDineIn ? 'restaurant' : 'local_shipping',
        desc:   isDineIn ? 'Your meal has been served to your table. Enjoy!' : 'Enjoy your meal! Thank you for choosing Veloura Café.',
        color:  'green',
      },
    ];
  }, [isDineIn]);

  const stepIndex = useMemo(() => {
    return Object.fromEntries(steps.map((s, i) => [s.status, i]));
  }, [steps]);

  const currentIdx = order ? (stepIndex[order.status] ?? 0) : 0;

  const etaText = useMemo(() => {
    if (isCancelled) return '—';
    if (isDineIn) {
      if (order.status === ORDER_STATUS.PENDING) return '12-18 mins';
      if (order.status === ORDER_STATUS.CONFIRMED) return '10-15 mins';
      if (order.status === ORDER_STATUS.PREPARING) return '5-10 mins';
      if (order.status === ORDER_STATUS.READY) return 'Serving now';
      if (order.status === ORDER_STATUS.COMPLETED) return 'Served';
      return '—';
    }
    return ETA[order.status];
  }, [isDineIn, order, isCancelled]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-t-orange-200 border-stone-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6 px-8 text-center pt-20">
        <span className="material-symbols-outlined text-6xl text-stone-700">receipt_long</span>
        <h1 className="font-headline text-2xl italic text-stone-300">Order not found</h1>
        <p className="text-stone-500 text-sm max-w-xs">
          This order ID doesn't exist or has expired. Check your confirmation and try again.
        </p>
        <Link to="/" className="bg-orange-200 text-stone-950 px-8 py-3 rounded-full font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-stone-500 text-xs tracking-widest uppercase">
          <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-orange-200">Track Order</span>
        </nav>

        {/* ── Order header card ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/60 backdrop-blur-md border border-stone-800/60 rounded-2xl p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Order Number</p>
              <h1 className="font-mono text-3xl font-black text-orange-200">#{order.orderNumber}</h1>
              <p className="text-stone-400 text-sm mt-1">
                {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
              </p>
              {isDineIn && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-300 text-[10px] uppercase font-bold tracking-widest">
                  <span className="material-symbols-outlined text-[12px]">deck</span>
                  Dine-In Table {order.tableNumber}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Total</p>
              <p className="font-mono text-2xl font-bold text-stone-100">₹{order.total}</p>
              {!isCancelled && (
                <p className="text-stone-500 text-xs mt-1">
                  {isDineIn ? 'Serving In: ' : 'ETA: '}
                  <span className="text-orange-200 font-bold">{etaText}</span>
                </p>
              )}
            </div>
          </div>

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="mt-4 flex items-center gap-3 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-red-400 text-xl">cancel</span>
              <p className="text-red-300 text-sm font-medium">This order was cancelled.</p>
            </div>
          )}
        </motion.div>

        {/* ── Live status timeline ────────────────────────────────────────── */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline italic text-stone-200 text-lg">Live Tracking</h2>
              {/* Pulse dot for active orders */}
              {order.status !== ORDER_STATUS.COMPLETED && (
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-orange-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-stone-500 text-xs uppercase tracking-wider">Live</span>
                </div>
              )}
            </div>

            <div className="space-y-0">
              {steps.map((step, idx) => {
                const isDone    = idx < currentIdx;
                const isActive  = idx === currentIdx;
                const isPending = idx > currentIdx;
                const c = COLOR_MAP[step.color] || COLOR_MAP.amber;

                return (
                  <div key={step.status} className="flex gap-5">
                    {/* ── Vertical connector + icon ────────────────────── */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                          isDone   ? `${c.bg} border-transparent` :
                          isActive ? `bg-stone-950 ${c.border} shadow-lg ${c.glow}` :
                          'bg-stone-900 border-stone-700'
                        }`}
                        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                      >
                        <span
                          className={`material-symbols-outlined text-lg transition-colors ${
                            isDone   ? 'text-stone-950'  :
                            isActive ? c.text :
                            'text-stone-700'
                          }`}
                          style={isDone || isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {isDone ? 'check' : step.icon}
                        </span>
                      </motion.div>

                      {/* Connector line */}
                      {idx < steps.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-6 my-1 relative overflow-hidden rounded-full bg-stone-800">
                          {isDone && (
                            <motion.div
                              className={`absolute inset-0 ${c.bg}`}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              style={{ originY: 0 }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Step content ───────────────────────────────────── */}
                    <div className={`pb-6 flex-1 ${idx === steps.length - 1 ? 'pb-0' : ''}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <p className={`font-semibold text-sm transition-colors ${
                          isDone   ? 'text-stone-300' :
                          isActive ? 'text-stone-100' :
                          'text-stone-600'
                        }`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.border} ${c.text} bg-transparent`}
                          >
                            Current
                          </motion.span>
                        )}
                      </div>
                      <AnimatePresence>
                        {(isDone || isActive) && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-stone-500 text-xs leading-relaxed"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Order items summary ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-headline italic text-stone-200 text-lg">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-stone-200 text-sm font-medium truncate">{item.title}</p>
                  <p className="text-stone-500 text-xs">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="text-stone-200 font-mono font-bold text-sm shrink-0">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-t border-stone-800 pt-4">
            <div className="flex justify-between text-stone-400 text-sm">
              <span>Subtotal</span><span className="font-mono">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-400 text-sm">
              <span>GST (5%)</span><span className="font-mono">₹{order.gst}</span>
            </div>
            <div className="flex justify-between text-stone-100 font-bold">
              <span>Total</span><span className="font-mono text-orange-200">₹{order.total}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Guest Info / Dining details ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6 space-y-3"
        >
          <h2 className="font-headline italic text-stone-200 text-lg">
            {isDineIn ? 'Dining Details' : 'Delivery Details'}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-stone-600 text-base">person</span>
              <span className="text-stone-300">{order.customerName}</span>
            </div>
            {order.phone && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-stone-600 text-base">call</span>
                <span className="text-stone-300">{order.phone}</span>
              </div>
            )}
            
            {isDineIn ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-stone-600 text-base">deck</span>
                <span className="text-stone-300 font-semibold text-orange-200">Table {order.tableNumber}</span>
              </div>
            ) : (
              order.address && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-stone-600 text-base mt-0.5">location_on</span>
                  <span className="text-stone-300">{order.address}</span>
                </div>
              )
            )}

            {(order.waiterNotes || order.notes) && (
              <div className="flex items-start gap-3 bg-orange-400/5 border border-orange-400/15 rounded-xl p-3 mt-2">
                <span className="material-symbols-outlined text-orange-400/70 text-base mt-0.5">notes</span>
                <span className="text-orange-300/80 italic text-xs">
                  {isDineIn ? order.waiterNotes : order.notes}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 text-center py-3 rounded-xl border border-stone-700 text-stone-400 text-xs font-bold tracking-widest uppercase hover:bg-stone-800 hover:text-stone-200 transition-all"
          >
            Back to Menu
          </Link>
          <Link
            to="/"
            className="flex-1 text-center py-3 rounded-xl bg-orange-200 text-stone-950 text-xs font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all"
          >
            Order More Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
