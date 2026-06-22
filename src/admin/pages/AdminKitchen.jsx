import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders, ORDER_STATUS } from '../../contexts/OrderContext';

const ACTIVE_STATUSES = [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.PENDING];

const STATUS_STYLES = {
  [ORDER_STATUS.PENDING]:   { cls: 'border-amber-500/40 bg-amber-500/5',   dot: 'bg-amber-400',   label: 'text-amber-300',   badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30' },
  [ORDER_STATUS.CONFIRMED]: { cls: 'border-blue-500/40 bg-blue-500/5',     dot: 'bg-blue-400',    label: 'text-blue-300',    badge: 'bg-blue-400/20 text-blue-300 border-blue-400/30' },
  [ORDER_STATUS.PREPARING]: { cls: 'border-orange-500/40 bg-orange-500/5', dot: 'bg-orange-400',  label: 'text-orange-300',  badge: 'bg-orange-400/20 text-orange-300 border-orange-400/30' },
  [ORDER_STATUS.READY]:     { cls: 'border-emerald-500/40 bg-emerald-500/5',dot:'bg-emerald-400', label: 'text-emerald-300', badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' },
};

const NEXT_STATUS = {
  [ORDER_STATUS.PENDING]:   ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]:     ORDER_STATUS.COMPLETED,
};

const getNextLabel = (status, orderType) => {
  const isDineIn = orderType === 'Dine In';
  if (status === ORDER_STATUS.PENDING) return 'Accept';
  if (status === ORDER_STATUS.CONFIRMED) return 'Start';
  if (status === ORDER_STATUS.PREPARING) return isDineIn ? 'Ready to Serve 🍽️' : 'Ready ✓';
  if (status === ORDER_STATUS.READY) return isDineIn ? 'Serve Order ✓' : 'Complete Done';
  return 'Advance';
};

const elapsed = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return `${d}s`;
  if (d < 3600) return `${Math.floor(d / 60)}m ${d % 60}s`;
  return `${Math.floor(d / 3600)}h ${Math.floor((d % 3600) / 60)}m`;
};

const KitchenOrderTile = ({ order, isNew }) => {
  const { updateStatus } = useOrders();
  const [, setTick] = useState(0);
  const s = STATUS_STYLES[order.status] || STATUS_STYLES[ORDER_STATUS.PENDING];
  const next = NEXT_STATUS[order.status];

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedSecs = Math.floor((Date.now() - new Date(order.createdAt)) / 1000);
  const isUrgent = elapsedSecs > 600;

  return (
    <div className={`p-4 rounded-2xl border bg-stone-950/60 transition-all ${
      order.status === ORDER_STATUS.PENDING ? 'border-amber-500/20' : 'border-stone-800'
    } ${isUrgent ? 'border-red-500/30 bg-red-500/5' : ''}`}>
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="font-mono font-black text-xl text-stone-100">#{order.orderNumber}</span>
          <span className="block text-[10px] text-stone-500 mt-0.5">Guest: {order.customerName}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-extrabold uppercase tracking-widest ${s.badge}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {order.status}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2 py-2.5 border-t border-b border-stone-900">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <span className="text-stone-300 font-medium">{item.title}</span>
            <span className="text-orange-200 font-mono font-bold ml-2 shrink-0">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Notes / Special Instructions */}
      {(order.notes || order.waiterNotes) && (
        <div className="my-2.5 p-2 bg-orange-950/10 border border-orange-900/20 rounded-xl text-xs text-orange-300 italic flex gap-1.5">
          <span className="material-symbols-outlined text-sm shrink-0">warning</span>
          <p className="leading-tight">"{order.waiterNotes || order.notes}"</p>
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2.5">
        <div className="flex items-center gap-1 text-[10px] text-stone-500">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          <span className={isUrgent ? 'text-red-400 font-bold' : ''}>{elapsed(order.createdAt)}</span>
        </div>

        {next && (
          <button
            onClick={() => updateStatus(order.id, next)}
            className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 hover:text-orange-200 transition-all"
          >
            {getNextLabel(order.status, order.orderType)}
          </button>
        )}
      </div>
    </div>
  );
};

const AdminKitchen = () => {
  const { orders } = useOrders();
  const [statusFilter, setStatusFilter] = useState('active'); // active, ready, all
  const [viewMode, setViewMode] = useState('grouped'); // grouped, flat
  const [, setTick] = useState(0);

  // Poll for UI timers
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const [nowSnap] = useState(() => Date.now());

  // Filter and sort raw orders
  const sortedOrders = useMemo(() => {
    return orders
      .filter(o => {
        if (statusFilter === 'active') return ACTIVE_STATUSES.includes(o.status);
        if (statusFilter === 'ready') return o.status === ORDER_STATUS.READY;
        return ACTIVE_STATUSES.includes(o.status) || o.status === ORDER_STATUS.READY;
      })
      .sort((a, b) => {
        const PRIORITY = {
          [ORDER_STATUS.PREPARING]: 0,
          [ORDER_STATUS.CONFIRMED]: 1,
          [ORDER_STATUS.PENDING]:   2,
          [ORDER_STATUS.READY]:     3,
        };
        return (PRIORITY[a.status] ?? 9) - (PRIORITY[b.status] ?? 9) || new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [orders, statusFilter]);

  // Group active orders for KDS display
  const groupedGroups = useMemo(() => {
    const groups = {};

    sortedOrders.forEach(o => {
      let groupKey;
      if (o.orderType === 'Dine In' && o.tableNumber) {
        groupKey = `Table ${o.tableNumber}`;
      } else if (o.orderType === 'Takeaway') {
        groupKey = 'Takeaway';
      } else {
        groupKey = 'Delivery';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          type: o.orderType,
          tableNumber: o.tableNumber || '',
          orders: [],
        };
      }
      groups[groupKey].orders.push(o);
    });

    // Sort: Dine-In tables first numerically, then Takeaway, then Delivery
    return Object.values(groups).sort((a, b) => {
      if (a.type === 'Dine In' && b.type === 'Dine In') {
        return Number(a.tableNumber) - Number(b.tableNumber);
      }
      if (a.type === 'Dine In') return -1;
      if (b.type === 'Dine In') return 1;
      if (a.key === 'Takeaway') return -1;
      if (b.key === 'Takeaway') return 1;
      return 0;
    });
  }, [sortedOrders]);

  const newOrderIds = useMemo(() => {
    return new Set(
      orders
        .filter(o => nowSnap - new Date(o.createdAt).getTime() < 90000)
        .map(o => o.id)
    );
  }, [orders, nowSnap]);

  return (
    <div className="min-h-screen bg-[#090806] p-4 md:p-6 pb-20 select-none">
      {/* KDS Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">KDS Live</span>
          </div>

          <div>
            <h1 className="font-headline text-3xl italic text-stone-100 leading-none">Kitchen Display</h1>
            <p className="text-stone-500 text-xs mt-1.5">
              {sortedOrders.length} active order{sortedOrders.length !== 1 ? 's' : ''} in pipeline
            </p>
          </div>
        </div>

        {/* View Toggle + Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Group vs Flat toggle */}
          <div className="flex items-center gap-1 bg-stone-950/80 border border-stone-850 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                viewMode === 'grouped'
                  ? 'bg-orange-200 text-stone-950 font-extrabold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Grouped
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                viewMode === 'flat'
                  ? 'bg-orange-200 text-stone-950 font-extrabold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              Flat Queue
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-950/80 border border-stone-850 p-1 rounded-xl">
            {[
              { key: 'active', label: 'Prep Queue' },
              { key: 'ready',  label: 'Ready / Serving' },
              { key: 'all',    label: 'All Active' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === f.key
                    ? 'bg-amber-400/10 border border-amber-400/20 text-amber-300 font-extrabold'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl"
          >
            👨‍🍳
          </motion.div>
          <p className="text-stone-500 text-xl font-light italic">No pending orders in the kitchen</p>
          <p className="text-stone-700 text-xs tracking-[0.2em] uppercase">Ready to prepare new delights</p>
        </div>
      )}

      {/* Grouped View */}
      {viewMode === 'grouped' && sortedOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          <AnimatePresence mode="popLayout">
            {groupedGroups.map(group => {
              const isDineInTable = group.type === 'Dine In';
              const hasAlert = group.orders.some(o => (Date.now() - new Date(o.createdAt).getTime()) > 600000 || o.waiterNotes);
              return (
                <motion.div
                  layout
                  key={group.key}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`border-2 rounded-[2rem] p-5 flex flex-col gap-4 backdrop-blur-md transition-all ${
                    isDineInTable
                      ? hasAlert 
                        ? 'border-amber-400/30 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.02)]'
                        : 'border-stone-850 bg-stone-900/40'
                      : group.key === 'Takeaway'
                      ? 'border-blue-500/20 bg-blue-500/5'
                      : 'border-emerald-500/20 bg-emerald-500/5'
                  }`}
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-stone-400">
                        {isDineInTable ? 'table_restaurant' : group.key === 'Takeaway' ? 'takeout_dining' : 'local_shipping'}
                      </span>
                      <h3 className="font-headline text-lg italic font-bold text-stone-100">{group.key}</h3>
                    </div>
                    <span className="text-[10px] bg-stone-950 border border-stone-850 px-2 py-0.5 rounded-full text-stone-400 font-mono font-bold">
                      {group.orders.length} order{group.orders.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Orders tiles in this group */}
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 no-scrollbar">
                    {group.orders.map(order => (
                      <KitchenOrderTile
                        key={order.id}
                        order={order}
                        isNew={newOrderIds.has(order.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Flat Queue View */}
      {viewMode === 'flat' && sortedOrders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          <AnimatePresence mode="popLayout">
            {sortedOrders.map(order => {
              const s = STATUS_STYLES[order.status] || STATUS_STYLES[ORDER_STATUS.PENDING];
              const next = NEXT_STATUS[order.status];
              return (
                <motion.div
                  layout
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`border rounded-3xl p-5 flex flex-col gap-4 bg-stone-900/40 border-stone-850 ${
                    newOrderIds.has(order.id) ? 'shadow-[0_0_20px_rgba(251,191,36,0.1)] border-amber-400/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-2xl text-stone-100">#{order.orderNumber}</span>
                      <span className="text-[9px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        {order.orderType === 'Dine In' ? `T-${order.tableNumber}` : order.orderType}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-extrabold uppercase tracking-widest ${s.badge}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-2 py-1.5">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-stone-300">{item.title}</span>
                        <span className="text-orange-200 font-mono font-bold">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {(order.notes || order.waiterNotes) && (
                    <p className="text-[11px] text-orange-300 italic bg-orange-950/10 border border-orange-900/20 p-2 rounded-xl">
                      "{order.waiterNotes || order.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto border-t border-stone-800/80 pt-2.5">
                    <span className="text-[10px] text-stone-500 font-mono">{elapsed(order.createdAt)}</span>
                    {next && (
                      <button
                        onClick={() => updateStatus(order.id, next)}
                        className="px-2.5 py-1.5 bg-stone-950 hover:bg-stone-850 border border-stone-800 rounded-xl text-[9px] font-bold text-stone-200 uppercase"
                      >
                        {getNextLabel(order.status, order.orderType)}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Legend at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-stone-950/95 backdrop-blur-xl border border-stone-850 rounded-full px-6 py-3.5 shadow-2xl z-20">
        {Object.entries(STATUS_STYLES).map(([status, s]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-wider">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminKitchen;
