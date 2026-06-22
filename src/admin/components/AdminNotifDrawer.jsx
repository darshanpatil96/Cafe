import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders, ORDER_STATUS } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  [ORDER_STATUS.PENDING]:    'text-amber-400 bg-amber-400/10 border-amber-400/30',
  [ORDER_STATUS.CONFIRMED]:  'text-blue-400 bg-blue-400/10 border-blue-400/30',
  [ORDER_STATUS.PREPARING]:  'text-orange-400 bg-orange-400/10 border-orange-400/30',
  [ORDER_STATUS.READY]:      'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  [ORDER_STATUS.COMPLETED]:  'text-stone-400 bg-stone-400/10 border-stone-600',
  [ORDER_STATUS.CANCELLED]:  'text-red-400 bg-red-400/10 border-red-400/30',
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const AdminNotifDrawer = () => {
  const { notifications, notifDrawerOpen, closeNotifDrawer, markNotifRead, markAllRead, unreadCount } = useOrders();
  const navigate = useNavigate();

  const handleClick = (notif) => {
    markNotifRead(notif.id);
    closeNotifDrawer();
    navigate(`/admin/order/${notif.order.id}`);
  };

  return (
    <AnimatePresence>
      {notifDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9960] bg-black/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeNotifDrawer}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-[360px] z-[9965] bg-[#111009] border-l border-white/5 flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h2 className="font-headline italic text-stone-100 text-lg">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-amber-400 text-stone-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-stone-500 hover:text-amber-300 text-[10px] uppercase tracking-wider transition-colors">
                    Mark all read
                  </button>
                )}
                <button onClick={closeNotifDrawer} className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-stone-400 hover:text-stone-200 transition-colors">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-600 text-sm">
                  <span className="material-symbols-outlined text-4xl">notifications_off</span>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    onClick={() => handleClick(notif)}
                    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-amber-400/5' : ''}`}
                  >
                    {/* Dot */}
                    <div className="mt-1.5 shrink-0">
                      {!notif.read ? (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-amber-400"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-stone-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-stone-200 text-sm font-semibold truncate">
                          Order #{notif.order.orderNumber}
                        </p>
                        <span className="text-stone-600 text-[10px] shrink-0">{timeAgo(notif.timestamp)}</span>
                      </div>
                      <p className="text-stone-400 text-xs truncate">{notif.order.customerName}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border ${STATUS_COLOR[notif.order.status]}`}>
                          {notif.order.status}
                        </span>
                        <span className="text-amber-300 text-xs font-bold">₹{notif.order.total}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminNotifDrawer;
