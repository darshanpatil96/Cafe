import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrders, ORDER_STATUS } from '../../contexts/OrderContext';
import StatusBadge from '../components/StatusBadge';

const useCountUp = (target, duration = 1200) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    if (target === 0) {
      setVal(0);
      return;
    }
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
};

const StatCard = ({ icon, label, value, sub, color, delay = 0, prefix = '' }) => {
  const count = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative bg-stone-950/60 border border-white/8 rounded-2xl p-5 overflow-hidden group hover:border-amber-400/20 transition-all duration-300 shadow-lg"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${color}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-20 flex items-center justify-center border border-white/10`}>
          <span className="material-symbols-outlined text-xl" style={{fontVariationSettings:"'FILL' 1"}}>{icon}</span>
        </div>
        <span className="text-stone-600 text-[10px] tracking-widest uppercase font-bold">{sub}</span>
      </div>
      <p className="font-mono text-2xl font-bold text-stone-100 mb-1">
        {prefix}{typeof value === 'number' ? count.toLocaleString('en-IN') : value}
      </p>
      <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
    </motion.div>
  );
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
};

const AdminDashboard = () => {
  const { orders, getOrdersByStatus, getTodayOrders, getTodayRevenue } = useOrders();

  const todayOrders = getTodayOrders();
  const todayRevenue = getTodayRevenue();
  const pendingOrders = getOrdersByStatus(ORDER_STATUS.PENDING);
  const completedToday = todayOrders.filter(o => o.status === ORDER_STATUS.COMPLETED);
  
  const avgOrderValue = todayOrders.length > 0
    ? Math.round(todayOrders.reduce((s, o) => s + o.total, 0) / todayOrders.length)
    : 0;

  // Table specific metrics
  const activeTablesCount = useMemo(() => {
    const activeTables = new Set(
      orders
        .filter(o => o.tableNumber && o.status !== ORDER_STATUS.COMPLETED && o.status !== ORDER_STATUS.CANCELLED)
        .map(o => o.tableNumber)
    );
    return activeTables.size;
  }, [orders]);

  const dineInToday = useMemo(() => todayOrders.filter(o => o.orderType === 'Dine In').length, [todayOrders]);
  const takeawayToday = useMemo(() => todayOrders.filter(o => o.orderType === 'Takeaway').length, [todayOrders]);
  const deliveryToday = useMemo(() => todayOrders.filter(o => o.orderType === 'Delivery').length, [todayOrders]);

  const avgTableSpend = useMemo(() => {
    const dineInOrders = orders.filter(o => o.orderType === 'Dine In');
    return dineInOrders.length > 0
      ? Math.round(dineInOrders.reduce((sum, o) => sum + o.total, 0) / dineInOrders.length)
      : 0;
  }, [orders]);

  // Top selling items
  const itemCounts = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      itemCounts[i.title] = (itemCounts[i.title] || 0) + i.quantity;
    });
  });
  const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  }, [orders]);

  return (
    <div className="p-4 md:p-6 space-y-8 min-h-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl italic text-stone-100">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link
          to="/admin/orders"
          className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-xl hover:bg-amber-400/15 transition-all"
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          Live Orders
        </Link>
      </div>

      {/* Section 1: Global Performance Overview */}
      <div className="space-y-4">
        <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-2">Global Performance Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="currency_rupee" label="Today's Revenue" value={todayRevenue} prefix="₹" color="bg-amber-400 text-amber-300" delay={0} sub="Today" />
          <StatCard icon="receipt_long" label="Today's Orders" value={todayOrders.length} color="bg-blue-400 text-blue-300" delay={0.05} sub="Today" />
          <StatCard icon="schedule" label="Pending Orders" value={pendingOrders.length} color="bg-orange-400 text-orange-300" delay={0.1} sub="Urgent" />
          <StatCard icon="avg_pace" label="Avg Order Value" value={avgOrderValue} prefix="₹" color="bg-purple-400 text-purple-300" delay={0.15} sub="Value" />
        </div>
      </div>

      {/* Section 2: Order Mode & Table Analytics */}
      <div className="space-y-4">
        <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-2">Order Mode & Table Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon="table_restaurant" label="Active Tables" value={activeTablesCount} color="bg-amber-500 text-amber-400" delay={0.2} sub="Live" />
          <StatCard icon="restaurant" label="Avg Table Spend" value={avgTableSpend} prefix="₹" color="bg-pink-400 text-pink-300" delay={0.25} sub="Dine-In" />
          <StatCard icon="deck" label="Dine-In Today" value={dineInToday} color="bg-orange-500 text-orange-400" delay={0.3} sub="Dine-In" />
          <StatCard icon="takeout_dining" label="Takeaway Today" value={takeawayToday} color="bg-blue-500 text-blue-400" delay={0.35} sub="Takeaway" />
          <StatCard icon="local_shipping" label="Delivery Today" value={deliveryToday} color="bg-emerald-500 text-emerald-400" delay={0.4} sub="Delivery" />
        </div>
      </div>

      {/* Recent orders table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-stone-950/60 border border-white/8 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-headline italic text-stone-200 text-lg">Recent Orders</h2>
          <Link to="/admin/orders" className="text-amber-400 text-xs uppercase tracking-wider hover:text-amber-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Order', 'Customer', 'Type', 'Table', 'Items', 'Total', 'Status', 'Time', ''].map(h => (
                  <th key={h} className="text-left text-stone-600 text-[10px] uppercase tracking-widest font-bold px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-3.5 text-amber-300 font-mono text-sm font-bold">#{order.orderNumber}</td>
                  <td className="px-6 py-3.5 text-stone-200 text-sm font-medium">{order.customerName}</td>
                  <td className="px-6 py-3.5 text-stone-300 text-xs">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                      order.orderType === 'Dine In' 
                        ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' 
                        : order.orderType === 'Takeaway'
                        ? 'bg-blue-400/10 border-blue-400/25 text-blue-300'
                        : 'bg-emerald-400/10 border-emerald-400/25 text-emerald-300'
                    }`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-stone-300 font-mono text-sm">
                    {order.orderType === 'Dine In' && order.tableNumber ? `Table ${order.tableNumber}` : '-'}
                  </td>
                  <td className="px-6 py-3.5 text-stone-400 text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-6 py-3.5 text-stone-200 font-mono text-sm font-bold">₹{order.total}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-3.5 text-stone-500 text-xs">{timeAgo(order.createdAt)} ago</td>
                  <td className="px-6 py-3.5">
                    <Link
                      to={`/admin/order/${order.id}`}
                      className="text-stone-600 hover:text-amber-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
