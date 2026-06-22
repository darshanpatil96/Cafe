import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useOrders, ORDER_STATUS } from '../../contexts/OrderContext';

const CHART_COLORS = ['#f59e0b', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      {label && <p className="text-stone-400 text-xs mb-2">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.name?.toLowerCase().includes('revenue') || p.name?.toLowerCase().includes('₹') ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

const AdminAnalytics = () => {
  const { orders } = useOrders();

  // Build hourly data for today
  const hourlyData = useMemo(() => {
    const today = new Date().toDateString();
    const buckets = {};
    for (let h = 8; h <= 22; h++) {
      buckets[h] = { hour: `${h}:00`, revenue: 0, orders: 0 };
    }
    orders
      .filter(o => new Date(o.createdAt).toDateString() === today && o.status !== ORDER_STATUS.CANCELLED)
      .forEach(o => {
        const h = new Date(o.createdAt).getHours();
        if (buckets[h]) { buckets[h].revenue += o.total; buckets[h].orders += 1; }
      });
    return Object.values(buckets);
  }, [orders]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const cats = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        // Guess category from item ID
        const cat = item.id.includes('coffee') || item.id === 'espresso' || item.id === 'cappuccino' || item.id === 'cold-drip' || item.id === 'filter-coffee' ? 'Coffee'
          : item.id.includes('latte') || item.id.includes('brew') || item.id.includes('matcha') || item.id.includes('lassi') || item.id.includes('mojito') ? 'Drinks'
          : item.id.includes('croissant') || item.id.includes('roll') || item.id.includes('tart') || item.id.includes('eclair') || item.id.includes('pain') ? 'Pastries'
          : item.id.includes('salmon') || item.id.includes('risotto') || item.id.includes('lamb') || item.id.includes('dal') ? 'Main Course'
          : item.id.includes('gulab') || item.id.includes('tiramisu') || item.id.includes('cake') ? 'Desserts'
          : item.id.includes('benedict') || item.id.includes('avocado') || item.id.includes('french-toast') || item.id.includes('shakshuka') ? 'Brunch'
          : item.id.includes('wagyu') || item.id.includes('lobster') || item.id.includes('thali') || item.id.includes('chef') ? 'Specials'
          : 'Starters';
        cats[cat] = (cats[cat] || 0) + item.quantity;
      });
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [orders]);

  // Top 8 items
  const topItems = useMemo(() => {
    const items = {};
    orders.forEach(o => o.items.forEach(i => {
      if (!items[i.title]) items[i.title] = { name: i.title, quantity: 0, revenue: 0 };
      items[i.title].quantity += i.quantity;
      items[i.title].revenue += i.price * i.quantity;
    }));
    return Object.values(items).sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  }, [orders]);

  // Status breakdown
  const statusData = useMemo(() => {
    return Object.values(ORDER_STATUS).map(status => ({
      name: status,
      value: orders.filter(o => o.status === status).length,
    })).filter(d => d.value > 0);
  }, [orders]);

  // Weekly revenue (last 7 days)
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === key && o.status !== ORDER_STATUS.CANCELLED);
      days.push({
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const totalRevenue = orders.filter(o => o.status !== ORDER_STATUS.CANCELLED).reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const activeTablesCount = useMemo(() => {
    const activeTables = new Set(
      orders
        .filter(o => o.tableNumber && o.status !== ORDER_STATUS.COMPLETED && o.status !== ORDER_STATUS.CANCELLED)
        .map(o => o.tableNumber)
    );
    return activeTables.size;
  }, [orders]);

  const dineInCount = useMemo(() => orders.filter(o => o.orderType === 'Dine In').length, [orders]);
  const takeawayCount = useMemo(() => orders.filter(o => o.orderType === 'Takeaway').length, [orders]);
  const deliveryCount = useMemo(() => orders.filter(o => o.orderType === 'Delivery').length, [orders]);

  const avgTableSpend = useMemo(() => {
    const dineInOrders = orders.filter(o => o.orderType === 'Dine In');
    return dineInOrders.length > 0
      ? Math.round(dineInOrders.reduce((sum, o) => sum + o.total, 0) / dineInOrders.length)
      : 0;
  }, [orders]);

  const orderTypeData = useMemo(() => {
    return [
      { name: 'Dine In', value: dineInCount },
      { name: 'Takeaway', value: takeawayCount },
      { name: 'Delivery', value: deliveryCount },
    ].filter(d => d.value > 0);
  }, [dineInCount, takeawayCount, deliveryCount]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="font-headline text-2xl italic text-stone-100">Analytics</h1>
        <p className="text-stone-500 text-sm mt-0.5">Performance overview — all time</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: 'currency_rupee', color: 'text-amber-400' },
          { label: 'Total Orders', value: orders.length, icon: 'receipt_long', color: 'text-blue-400' },
          { label: 'Avg Order Value', value: `₹${avgOrder}`, icon: 'avg_pace', color: 'text-purple-400' },
          { label: 'Completion Rate', value: `${orders.length > 0 ? Math.round(orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length / orders.length * 100) : 0}%`, icon: 'done_all', color: 'text-emerald-400' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-stone-950/60 border border-white/8 rounded-2xl p-5"
          >
            <span className={`material-symbols-outlined text-2xl mb-3 block ${s.color}`} style={{fontVariationSettings:"'FILL' 1"}}>{s.icon}</span>
            <p className="text-stone-100 font-mono text-2xl font-bold">{s.value}</p>
            <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Mode & Table Metrics */}
      <div className="space-y-4">
        <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest border-b border-stone-900/60 pb-2">Order Mode & Table Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Active Tables', value: activeTablesCount, icon: 'table_restaurant', color: 'text-amber-500' },
            { label: 'Avg Table Spend', value: `₹${avgTableSpend}`, icon: 'restaurant', color: 'text-pink-400' },
            { label: 'Dine-In Orders', value: dineInCount, icon: 'deck', color: 'text-orange-500' },
            { label: 'Takeaway Orders', value: takeawayCount, icon: 'takeout_dining', color: 'text-blue-500' },
            { label: 'Delivery Orders', value: deliveryCount, icon: 'local_shipping', color: 'text-emerald-500' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-stone-950/60 border border-white/8 rounded-2xl p-5"
            >
              <span className={`material-symbols-outlined text-2xl mb-3 block ${s.color}`} style={{fontVariationSettings:"'FILL' 1"}}>{s.icon}</span>
              <p className="text-stone-100 font-mono text-2xl font-bold">{s.value}</p>
              <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Revenue */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
        <h2 className="font-headline italic text-stone-200 text-lg mb-6">Weekly Revenue</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="day" stroke="#44403c" tick={{ fill: '#78716c', fontSize: 11 }} />
            <YAxis stroke="#44403c" tick={{ fill: '#78716c', fontSize: 11 }} tickFormatter={v => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" fill="url(#rev)" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Hourly + Category row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's hourly */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
          <h2 className="font-headline italic text-stone-200 text-lg mb-6">Today — Hourly Orders</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="hour" stroke="#44403c" tick={{ fill: '#78716c', fontSize: 10 }} />
              <YAxis stroke="#44403c" tick={{ fill: '#78716c', fontSize: 10 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
          <h2 className="font-headline italic text-stone-200 text-lg mb-6">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={val => <span className="text-stone-400 text-xs">{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
        <h2 className="font-headline italic text-stone-200 text-lg mb-6">Top Selling Items</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={topItems} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
            <XAxis type="number" stroke="#44403c" tick={{ fill: '#78716c', fontSize: 10 }} />
            <YAxis type="category" dataKey="name" stroke="#44403c" tick={{ fill: '#a8a29e', fontSize: 11 }} width={160} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quantity" name="Quantity Sold" radius={[0, 4, 4, 0]}>
              {topItems.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order status donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
          <h2 className="font-headline italic text-stone-200 text-lg mb-6">Order Status Distribution</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {statusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <div>
                    <p className="text-stone-300 text-xs font-semibold">{d.name}</p>
                    <p className="text-stone-500 text-[10px]">{d.value} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Order type donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-stone-950/60 border border-white/8 rounded-2xl p-6">
          <h2 className="font-headline italic text-stone-200 text-lg mb-6">Order Type Distribution</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={orderTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {orderTypeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-3 flex-1">
              {orderTypeData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[(i + 2) % CHART_COLORS.length] }} />
                  <div>
                    <p className="text-stone-300 text-xs font-semibold">{d.name}</p>
                    <p className="text-stone-500 text-[10px]">{d.value} orders ({Math.round(d.value / (orders.length || 1) * 100)}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
