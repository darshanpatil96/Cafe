import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useOrders, ORDER_STATUS } from '../contexts/OrderContext';
import { fetchOrdersByEmail, isSupabaseReady } from '../lib/supabase';
import ImageWithFallback from '../components/ImageWithFallback';

const STATUS_STYLES = {
  [ORDER_STATUS.PENDING]:   'text-amber-400 bg-amber-400/10 border-amber-400/30',
  [ORDER_STATUS.CONFIRMED]: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  [ORDER_STATUS.PREPARING]: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  [ORDER_STATUS.READY]:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  [ORDER_STATUS.COMPLETED]: 'text-stone-400 bg-stone-800/60 border-stone-700',
  [ORDER_STATUS.CANCELLED]: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const statusCls = STATUS_STYLES[order.status] || STATUS_STYLES[ORDER_STATUS.PENDING];
  const isActive  = ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-stone-900/60 border border-stone-800/60 rounded-2xl overflow-hidden hover:border-orange-200/20 transition-all duration-300"
    >
      {/* Header row */}
      <button
        className="w-full flex flex-wrap items-center gap-4 px-5 py-4 text-left"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-orange-200/10 border border-orange-200/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-orange-200 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-orange-200 font-bold text-sm leading-none mb-0.5">#{order.orderNumber}</p>
            <p className="text-stone-500 text-xs">{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusCls}`}>
            {order.status}
          </span>
          <span className="font-mono font-bold text-stone-200 text-sm">₹{order.total}</span>
          <span className={`material-symbols-outlined text-stone-500 text-lg transition-transform ${expanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-stone-800/60 pt-4">
              {/* Items */}
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
                      </div>
                    )}
                    <span className="text-stone-300 text-sm flex-1 truncate">{item.title}</span>
                    <span className="text-stone-500 text-xs shrink-0">×{item.quantity}</span>
                    <span className="text-stone-200 font-mono text-sm font-bold shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex items-center justify-between border-t border-stone-800 pt-3 text-sm">
                <div className="space-y-1">
                  <p className="text-stone-500 text-xs">Subtotal: <span className="text-stone-300">₹{order.subtotal}</span></p>
                  <p className="text-stone-500 text-xs">GST (5%): <span className="text-stone-300">₹{order.gst}</span></p>
                </div>
                <p className="font-mono font-bold text-orange-200 text-base">₹{order.total}</p>
              </div>

              {/* CTA */}
              <div className="flex gap-2 pt-1">
                {isActive && (
                  <Link
                    to={`/track/${order.id}`}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-200 border border-orange-200/30 bg-orange-200/5 px-4 py-2 rounded-xl hover:bg-orange-200/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">my_location</span>
                    Track
                  </Link>
                )}
                <Link
                  to="/menu/starters"
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-700 px-4 py-2 rounded-xl hover:bg-stone-800 hover:text-stone-200 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">replay</span>
                  Reorder
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OrderHistoryPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { orders: contextOrders } = useOrders();

  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  // Fetch orders: use Supabase if ready + logged in, else fall back to context
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setLoading(true);
      try {
        if (isSupabaseReady() && isLoggedIn && user?.email) {
          const remote = await fetchOrdersByEmail(user.email);
          setOrders(remote);
        } else {
          // Demo / offline: show all context orders
          setOrders(contextOrders);
        }
      } catch (err) {
        console.error('[Aura] OrderHistory fetch failed:', err.message);
        setOrders(contextOrders);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, isLoggedIn, authLoading, contextOrders]);

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const activeCount = orders.filter(o =>
    ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-stone-500 text-xs tracking-widest uppercase">
          <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-orange-200">Order History</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl italic text-stone-100">Your Orders</h1>
            <p className="text-stone-500 text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
              {activeCount > 0 && (
                <span className="ml-2 text-orange-200 font-medium">· {activeCount} active</span>
              )}
            </p>
          </div>
          {!isLoggedIn && !authLoading && (
            <Link
              to="/login"
              className="shrink-0 flex items-center gap-2 bg-orange-200/10 border border-orange-200/30 text-orange-200 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-orange-200/15 transition-all"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Sign In
            </Link>
          )}
        </div>

        {/* Not logged in notice */}
        {!isLoggedIn && !authLoading && (
          <div className="bg-amber-400/8 border border-amber-400/20 rounded-2xl px-5 py-4 flex items-start gap-4">
            <span className="material-symbols-outlined text-amber-400 text-xl mt-0.5 shrink-0">info</span>
            <div>
              <p className="text-amber-300 text-sm font-medium mb-1">Showing demo orders</p>
              <p className="text-stone-500 text-xs">
                Sign in to see your personal order history synced across devices.
              </p>
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {['all', ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all ${
                filter === f
                  ? 'bg-orange-200/10 border-orange-200/30 text-orange-200'
                  : 'border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-700'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-t-orange-200 border-stone-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="material-symbols-outlined text-6xl text-stone-700">receipt_long</span>
            <p className="text-stone-400 font-light text-lg">
              {filter === 'all' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
            </p>
            <Link
              to="/"
              className="bg-orange-200 text-stone-950 px-8 py-3 rounded-full font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all"
            >
              Browse Menu
            </Link>
          </div>
        )}

        {/* Orders */}
        {!loading && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
