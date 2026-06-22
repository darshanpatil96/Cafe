import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders, ORDER_STATUS, STATUS_ORDER } from '../../contexts/OrderContext';
import StatusBadge from '../components/StatusBadge';

const COLUMN_CONFIG = [
  { status: ORDER_STATUS.PENDING,   label: 'Pending',   color: 'border-amber-400/40',   bg: 'bg-amber-400/5',   headerColor: 'text-amber-400' },
  { status: ORDER_STATUS.CONFIRMED, label: 'Confirmed', color: 'border-blue-400/40',    bg: 'bg-blue-400/5',    headerColor: 'text-blue-400' },
  { status: ORDER_STATUS.PREPARING, label: 'Preparing', color: 'border-orange-400/40',  bg: 'bg-orange-400/5',  headerColor: 'text-orange-400' },
  { status: ORDER_STATUS.READY,     label: 'Ready',     color: 'border-emerald-400/40', bg: 'bg-emerald-400/5', headerColor: 'text-emerald-400' },
];

const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const timeAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  return d < 1 ? 'Just now' : `${d}m ago`;
};

const NEXT_STATUS = {
  [ORDER_STATUS.PENDING]:   ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]:     ORDER_STATUS.COMPLETED,
};

const OrderCard = ({ order }) => {
  const { updateStatus } = useOrders();
  const [mountTime] = useState(() => Date.now());
  const isNew = (mountTime - new Date(order.createdAt).getTime()) < 90000;
  const next = NEXT_STATUS[order.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`relative bg-stone-950 border rounded-xl p-4 cursor-default group ${
        isNew ? 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.08)]' : 'border-white/8'
      } hover:border-amber-400/25 transition-all duration-300`}
    >
      {/* New pulse */}
      {isNew && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-mono text-sm font-extrabold">#{order.orderNumber}</span>
          {order.tableNumber && (
            <span className="text-[9px] bg-stone-800 border border-stone-700 text-stone-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
              T-{order.tableNumber}
            </span>
          )}
        </div>
        <span className="text-stone-500 text-[10px]">{formatTime(order.createdAt)}</span>
      </div>

      {/* Customer */}
      <p className="text-stone-200 text-sm font-semibold mb-0.5">{order.customerName}</p>
      {order.phone && <p className="text-stone-600 text-xs mb-3">{order.phone}</p>}

      {/* Items */}
      <div className="space-y-1 mb-3 border-t border-white/5 pt-3">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-stone-400 truncate">{item.title}</span>
            <span className="text-stone-300 font-mono ml-2 shrink-0">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <p className="text-orange-300/70 text-xs italic bg-orange-400/5 border border-orange-400/15 rounded-lg px-2.5 py-1.5 mb-3">
          "{order.notes}"
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-amber-300 font-bold font-mono text-sm">₹{order.total}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-stone-600 text-[10px]">{timeAgo(order.createdAt)}</span>
          <Link
            to={`/admin/order/${order.id}`}
            className="w-6 h-6 flex items-center justify-center rounded-lg border border-white/10 text-stone-500 hover:text-amber-300 hover:border-amber-400/30 transition-all"
            title="View details"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>
      </div>

      {/* Next status button */}
      {next && (
        <button
          onClick={() => updateStatus(order.id, next)}
          className="w-full mt-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-stone-400 text-[10px] font-bold tracking-widest uppercase hover:bg-amber-400/10 hover:border-amber-400/30 hover:text-amber-300 transition-all"
        >
          → {next}
        </button>
      )}
      {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.COMPLETED && (
        <button
          onClick={() => updateStatus(order.id, ORDER_STATUS.CANCELLED)}
          className="w-full mt-1.5 py-1 rounded-lg text-stone-700 text-[9px] font-bold tracking-widest uppercase hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          Cancel
        </button>
      )}
    </motion.div>
  );
};

const AdminOrders = () => {
  const { orders, getOrdersByStatus } = useOrders();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('kanban');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [filterType, setFilterType] = useState('all');
  const [filterTable, setFilterTable] = useState('');

  const completedOrCancelled = orders.filter(o =>
    o.status === ORDER_STATUS.COMPLETED || o.status === ORDER_STATUS.CANCELLED
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredList = orders
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .filter(o => filterType === 'all' || o.orderType === filterType)
    .filter(o => !filterTable || o.tableNumber === filterTable)
    .filter(o => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || String(o.orderNumber).includes(search))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <h1 className="font-headline text-2xl italic text-stone-100">Live Orders</h1>
          <p className="text-stone-500 text-sm">{orders.filter(o => o.status !== ORDER_STATUS.COMPLETED && o.status !== ORDER_STATUS.CANCELLED).length} active orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all ${viewMode === 'kanban' ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-white/10 text-stone-500 hover:text-stone-300'}`}
          >
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all ${viewMode === 'list' ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-white/10 text-stone-500 hover:text-stone-300'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {COLUMN_CONFIG.map(col => {
            const colOrders = getOrdersByStatus(col.status).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return (
              <div key={col.status} className={`rounded-2xl border ${col.color} ${col.bg} p-3 space-y-3`}>
                {/* Column header */}
                <div className="flex items-center justify-between px-1 pb-2 border-b border-white/5">
                  <span className={`font-label text-xs font-extrabold tracking-[0.2em] uppercase ${col.headerColor}`}>
                    {col.label}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.color} ${col.headerColor}`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards */}
                <AnimatePresence mode="popLayout">
                  {colOrders.length === 0 ? (
                    <div className="py-8 text-center text-stone-700 text-xs">No orders</div>
                  ) : (
                    colOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Search + filter */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">search</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or order #"
                className="w-full bg-stone-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-amber-400/40 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-stone-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-stone-300 text-sm focus:outline-none focus:border-amber-400/40 transition-all"
            >
              <option value="all">All Statuses</option>
              {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-stone-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-stone-300 text-sm focus:outline-none focus:border-amber-400/40 transition-all"
            >
              <option value="all">All Modes</option>
              <option value="Dine In">Dine In</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Delivery">Delivery</option>
            </select>

            <input
              type="text"
              value={filterTable}
              onChange={e => setFilterTable(e.target.value)}
              placeholder="Table #"
              className="w-24 bg-stone-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-stone-300 text-sm focus:outline-none focus:border-amber-400/40 transition-all"
            />
          </div>

          <div className="space-y-2">
            {filteredList.map(order => (
              <Link
                key={order.id}
                to={`/admin/order/${order.id}`}
                className="flex items-center gap-4 bg-stone-950/60 border border-white/8 rounded-xl px-5 py-4 hover:border-amber-400/20 transition-all group"
              >
                <span className="text-amber-300 font-mono font-extrabold text-sm w-20 shrink-0">#{order.orderNumber}</span>
                <span className="text-stone-200 text-sm flex-1 truncate">{order.customerName}</span>
                <span className="text-stone-400 text-xs hidden sm:block">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="text-stone-200 font-mono font-bold text-sm">₹{order.total}</span>
                <StatusBadge status={order.status} />
                <span className="text-stone-600 text-xs hidden md:block">{timeAgo(order.createdAt)}</span>
                <span className="material-symbols-outlined text-stone-600 group-hover:text-amber-300 transition-colors text-lg">chevron_right</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed / Cancelled section */}
      <div className="border-t border-white/5 pt-6">
        <h2 className="font-headline italic text-stone-500 text-lg mb-4">Completed & Cancelled</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {completedOrCancelled.slice(0, 6).map(order => (
            <Link
              key={order.id}
              to={`/admin/order/${order.id}`}
              className="flex items-center gap-3 bg-stone-950/40 border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-all opacity-60 hover:opacity-100"
            >
              <span className="text-stone-500 font-mono text-xs">#{order.orderNumber}</span>
              <span className="text-stone-400 text-xs flex-1 truncate">{order.customerName}</span>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
