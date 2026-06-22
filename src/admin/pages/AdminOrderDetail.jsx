import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders, ORDER_STATUS, STATUS_ORDER } from '../../contexts/OrderContext';
import StatusBadge from '../components/StatusBadge';
import ImageWithFallback from '../../components/ImageWithFallback';

const NEXT_MAP = {
  [ORDER_STATUS.PENDING]:   { label: 'Accept Order',       next: ORDER_STATUS.CONFIRMED,  icon: 'check_circle',   cls: 'from-blue-500 to-blue-400' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Start Preparing',    next: ORDER_STATUS.PREPARING,  icon: 'outdoor_grill',  cls: 'from-orange-500 to-amber-400' },
  [ORDER_STATUS.PREPARING]: { label: 'Mark Ready',         next: ORDER_STATUS.READY,      icon: 'done_all',       cls: 'from-emerald-500 to-green-400' },
  [ORDER_STATUS.READY]:     { label: 'Mark Completed',     next: ORDER_STATUS.COMPLETED,  icon: 'inventory_2',    cls: 'from-stone-600 to-stone-500' },
};

const formatDateTime = (iso) => new Date(iso).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateStatus } = useOrders();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-500 py-32">
        <span className="material-symbols-outlined text-5xl">receipt_long</span>
        <p>Order not found.</p>
        <Link to="/admin/orders" className="text-amber-300 text-sm underline">Back to orders</Link>
      </div>
    );
  }

  const nextAction = NEXT_MAP[order.status];
  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-200 text-sm transition-colors"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Orders
      </button>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-950/60 border border-white/8 rounded-2xl p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-mono text-2xl font-extrabold text-amber-300">#{order.orderNumber}</h1>
              <StatusBadge status={order.status} size="lg" />
            </div>
            <p className="text-stone-400 text-sm">{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Grand Total</p>
            <p className="font-mono text-3xl font-extrabold text-amber-300">₹{order.total}</p>
          </div>
        </div>

        {/* Status timeline */}
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar pb-2">
          {STATUS_ORDER.filter(s => s !== ORDER_STATUS.CANCELLED).map((status, idx) => {
            const done = STATUS_ORDER.indexOf(status) < currentIdx;
            const active = status === order.status;
            const cancelled = order.status === ORDER_STATUS.CANCELLED;
            return (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    cancelled ? 'border-red-400/30 bg-red-400/10 text-red-400' :
                    active ? 'border-amber-400 bg-amber-400/20 text-amber-300' :
                    done ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400' :
                    'border-stone-700 bg-stone-900 text-stone-600'
                  }`}>
                    {done && !active ? (
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings:"'FILL' 1"}}>check</span>
                    ) : (
                      <span className="text-[10px]">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[9px] mt-1 uppercase tracking-wider whitespace-nowrap ${active ? 'text-amber-300' : done ? 'text-emerald-400/60' : 'text-stone-700'}`}>
                    {status}
                  </span>
                </div>
                {idx < STATUS_ORDER.filter(s => s !== ORDER_STATUS.CANCELLED).length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 min-w-4 ${done ? 'bg-emerald-400/30' : 'bg-stone-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-stone-950/60 border border-white/8 rounded-2xl p-5 space-y-4"
        >
          <h2 className="font-label text-xs uppercase tracking-widest text-stone-500 font-bold">Customer</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 font-extrabold text-sm">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-stone-100 font-semibold">{order.customerName}</p>
                <p className="text-stone-500 text-xs">{order.phone}</p>
              </div>
            </div>
            {order.tableNumber && (
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-stone-600 text-base">table_restaurant</span>
                <span className="text-stone-400">Table {order.tableNumber}</span>
              </div>
            )}
            {order.address && (
              <div className="flex items-start gap-2 text-sm">
                <span className="material-symbols-outlined text-stone-600 text-base mt-0.5">location_on</span>
                <span className="text-stone-400">{order.address}</span>
              </div>
            )}
            {order.notes && (
              <div className="flex items-start gap-2 text-sm bg-orange-400/5 border border-orange-400/15 rounded-xl p-3">
                <span className="material-symbols-outlined text-orange-400/70 text-base mt-0.5">notes</span>
                <span className="text-orange-300/80 italic">{order.notes}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-stone-950/60 border border-white/8 rounded-2xl p-5 space-y-4"
        >
          <h2 className="font-label text-xs uppercase tracking-widest text-stone-500 font-bold">Items Ordered</h2>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-stone-200 text-sm font-medium truncate">{item.title}</p>
                  <p className="text-stone-500 text-xs">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="text-stone-200 font-mono text-sm font-bold shrink-0">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-t border-white/5 pt-3">
            <div className="flex justify-between text-sm text-stone-400">
              <span>Subtotal</span>
              <span className="font-mono">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-400">
              <span>GST (5%)</span>
              <span className="font-mono">₹{order.gst}</span>
            </div>
            <div className="flex justify-between text-stone-100 font-bold">
              <span>Grand Total</span>
              <span className="font-mono text-amber-300">₹{order.total}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        {nextAction && order.status !== ORDER_STATUS.COMPLETED && order.status !== ORDER_STATUS.CANCELLED && (
          <button
            onClick={() => updateStatus(order.id, nextAction.next)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${nextAction.cls} text-white font-extrabold text-xs tracking-widest uppercase shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            <span className="material-symbols-outlined text-base" style={{fontVariationSettings:"'FILL' 1"}}>{nextAction.icon}</span>
            {nextAction.label}
          </button>
        )}

        {order.status !== ORDER_STATUS.COMPLETED && order.status !== ORDER_STATUS.CANCELLED && (
          <button
            onClick={() => { updateStatus(order.id, ORDER_STATUS.CANCELLED); navigate('/admin/orders'); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-400/30 text-red-400 text-xs font-bold tracking-widest uppercase hover:bg-red-400/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">cancel</span>
            Cancel Order
          </button>
        )}

        {/* Manual status set */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-stone-600 text-xs">Set status:</span>
          <select
            value={order.status}
            onChange={e => updateStatus(order.id, e.target.value)}
            className="bg-stone-950/60 border border-white/10 rounded-xl px-3 py-2 text-stone-300 text-xs focus:outline-none focus:border-amber-400/40"
          >
            {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOrderDetail;
