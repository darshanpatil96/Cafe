import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useOrders } from '../../contexts/OrderContext';
import AdminNotifDrawer from './AdminNotifDrawer';

const NAV = [
  { label: 'Dashboard',   icon: 'dashboard',        path: '/admin/dashboard' },
  { label: 'Live Orders', icon: 'receipt_long',      path: '/admin/orders' },
  { label: 'Tables',      icon: 'table_restaurant',  path: '/admin/tables' },
  { label: 'Analytics',   icon: 'bar_chart',         path: '/admin/analytics' },
  { label: 'Menu',        icon: 'restaurant_menu',   path: '/admin/menu-management' },
  { label: 'Kitchen',     icon: 'outdoor_grill',     path: '/admin/kitchen' },
];

// ─── Extracted so it is never re-created inside render ────────────────────────
const SidebarContent = ({ collapsed, admin, onClose, onLogout }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
        <span className="material-symbols-outlined text-stone-950 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
      </div>
      {!collapsed && (
        <div>
          <p className="font-headline text-sm italic text-orange-200 leading-tight">Aura Cafe</p>
          <p className="text-[9px] tracking-[0.2em] uppercase text-stone-500">Admin OS</p>
        </div>
      )}
    </div>

    {/* Nav items */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
      {NAV.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
              isActive
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                : 'text-stone-500 hover:text-stone-200 hover:bg-white/5'
            } ${collapsed ? 'justify-center' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-amber-400/10 border border-amber-400/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`material-symbols-outlined text-xl z-10 ${isActive ? 'text-amber-300' : ''}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="font-label text-xs tracking-wide font-semibold uppercase z-10">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-xs text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* User + logout */}
    <div className="border-t border-white/5 p-3 space-y-2">
      {!collapsed && admin && (
        <div className="px-3 py-2 rounded-xl bg-white/5">
          <p className="text-stone-200 text-xs font-semibold truncate">{admin.name}</p>
          <p className="text-stone-500 text-[10px] uppercase tracking-wider">{admin.role}</p>
        </div>
      )}
      <button
        onClick={onLogout}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-400/5 transition-all ${collapsed ? 'justify-center' : ''}`}
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        {!collapsed && <span className="font-label text-xs tracking-wide font-semibold uppercase">Logout</span>}
      </button>
    </div>
  </div>
);

// ─── Main layout ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const { unreadCount, toggleNotifDrawer } = useOrders();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen bg-[#0c0b09] text-stone-100 overflow-hidden" style={{ cursor: 'none' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col bg-stone-950 border-r border-white/5 relative z-30 shrink-0 overflow-hidden"
      >
        <SidebarContent
          collapsed={collapsed}
          admin={admin}
          onClose={() => {}}
          onLogout={handleLogout}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-orange-200 z-40 transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-sm">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-56 bg-stone-950 border-r border-white/5 z-50 md:hidden flex flex-col"
              initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent
                collapsed={false}
                admin={admin}
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-stone-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-stone-400 hover:text-stone-200 p-1"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-stone-500 text-sm">
            <motion.span
              className="material-symbols-outlined text-base text-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              circle
            </motion.span>
            <span className="text-xs tracking-widest uppercase text-emerald-400/70">Live</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notification bell */}
            <button
              onClick={toggleNotifDrawer}
              className="relative w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-stone-400 hover:text-amber-300 hover:border-amber-400/30 transition-all"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[9px] font-extrabold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Avatar + name */}
            {admin && (
              <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-stone-950 font-extrabold text-xs">
                  {admin.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-stone-200 text-xs font-semibold leading-none">{admin.name}</p>
                  <p className="text-stone-500 text-[10px] uppercase tracking-wider">{admin.role}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <AdminNotifDrawer />
    </div>
  );
};

export default AdminLayout;
