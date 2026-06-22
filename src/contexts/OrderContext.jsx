import React, {
  createContext, useContext, useReducer,
  useEffect, useCallback, useRef, useState,
} from 'react';
import {
  supabase, isSupabaseReady,
  saveOrderToSupabase, updateOrderStatusInSupabase,
  fetchAllOrders, normalizeOrder,
} from '../lib/supabase';

// ─── Status constants ────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY:     'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const STATUS_ORDER = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

// ─── Seed data (offline / demo fallback) ─────────────────────────────────────
const SEED_ORDERS = [
  {
    id: 'ORD-1018', orderNumber: 1018,
    customerName: 'Priya Mehta', phone: '+91 98123 45678',
    address: '14 Marine Drive, Mumbai', tableNumber: '5',
    items: [
      { id: 'paneer-tikka', title: 'Paneer Tikka', price: 299, quantity: 2, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=200' },
      { id: 'filter-coffee', title: 'South Indian Filter Coffee', price: 150, quantity: 2, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200' },
    ],
    subtotal: 898, gst: 45, total: 943,
    status: ORDER_STATUS.PREPARING, notes: 'Less spicy please',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'ORD-1019', orderNumber: 1019,
    customerName: 'Arjun Kapoor', phone: '+91 90011 22334',
    address: '7 Bandra West, Mumbai', tableNumber: '12',
    items: [
      { id: 'wagyu-burger', title: 'Wagyu Smash Burger', price: 1499, quantity: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
      { id: 'gold-latte', title: 'Signature Gold Latte', price: 285, quantity: 1, image: 'https://images.unsplash.com/photo-1586346398499-d08bef6f56b0?w=200' },
    ],
    subtotal: 1784, gst: 89, total: 1873,
    status: ORDER_STATUS.CONFIRMED, notes: '',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-1020', orderNumber: 1020,
    customerName: 'Sneha Pillai', phone: '+91 87654 32109',
    address: 'Online Delivery', tableNumber: '',
    items: [
      { id: 'truffle-fries', title: 'Truffle Fries', price: 420, quantity: 1, image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=200' },
      { id: 'hibiscus', title: 'Hibiscus Cold Brew', price: 250, quantity: 2, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200' },
      { id: 'gulab-jamun', title: 'Gulab Jamun', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1666395344217-5d13dcb49e2c?w=200' },
    ],
    subtotal: 1169, gst: 58, total: 1227,
    status: ORDER_STATUS.READY, notes: 'Extra sauce on the side',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 'ORD-1021', orderNumber: 1021,
    customerName: 'Rahul Sharma', phone: '+91 99887 76655',
    address: '22 Connaught Place, Delhi', tableNumber: '3',
    items: [
      { id: 'salmon', title: 'Pan-Seared Salmon', price: 1050, quantity: 1, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200' },
      { id: 'cappuccino', title: 'Artisan Cappuccino', price: 240, quantity: 2, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=200' },
    ],
    subtotal: 1530, gst: 77, total: 1607,
    status: ORDER_STATUS.COMPLETED, notes: '',
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
  },
  {
    id: 'ORD-1022', orderNumber: 1022,
    customerName: 'Nisha Verma', phone: '+91 76543 21098',
    address: '5 Jubilee Hills, Hyderabad', tableNumber: '8',
    items: [
      { id: 'avocado-toast', title: 'Premium Avocado Toast', price: 550, quantity: 1, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=200' },
      { id: 'matcha', title: 'Matcha Fusion', price: 260, quantity: 1, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200' },
    ],
    subtotal: 810, gst: 41, total: 851,
    status: ORDER_STATUS.PENDING, notes: 'Gluten-free if possible',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

const getLocalOrders = () => {
  try {
    const s = localStorage.getItem('veloura-orders');
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return SEED_ORDERS;
};

let localCounter = 1024;

// ─── Reducer ─────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
  switch (action.type) {
    // ── Full replace (from Supabase fetch) ───────────────────────────────────
    case 'SET_ORDERS':
      return { ...state, orders: action.orders, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.value };

    // ── New order arrived (local optimistic or realtime push) ────────────────
    case 'ADD_ORDER': {
      // Avoid duplicates (realtime may echo our own insert)
      if (state.orders.find(o => o.id === action.order.id)) return state;
      return {
        ...state,
        orders: [action.order, ...state.orders],
        notifications: [
          { id: action.order.id, order: action.order, read: false, timestamp: new Date().toISOString() },
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      };
    }

    // ── Status update (local optimistic or realtime push) ───────────────────
    case 'UPDATE_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.id
            ? { ...o, status: action.status, updatedAt: new Date().toISOString() }
            : o
        ),
      };

    case 'MARK_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(
          0,
          state.unreadCount -
            (state.notifications.find(n => n.id === action.id && !n.read) ? 1 : 0)
        ),
      };
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })), unreadCount: 0 };
    case 'TOGGLE_NOTIF_DRAWER':
      return { ...state, notifDrawerOpen: !state.notifDrawerOpen };
    case 'CLOSE_NOTIF_DRAWER':
      return { ...state, notifDrawerOpen: false };
    case 'UPDATE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.map(i => i.id === action.item.id ? action.item : i) };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [action.item, ...state.menuItems] };
    case 'DELETE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.filter(i => i.id !== action.id) };
    default:
      return state;
  }
};

// ─── Notification sound ───────────────────────────────────────────────────────
const playOrderSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1100, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch { /* audio not critical */ }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    orders: getLocalOrders(),
    loading: false,
    notifications: SEED_ORDERS.slice(0, 3).map(o => ({
      id: o.id, order: o, read: false, timestamp: o.createdAt,
    })),
    unreadCount: 3,
    notifDrawerOpen: false,
    menuItems: [],
  });

  const realtimeRef = useRef(null);
  const ready = isSupabaseReady();

  // ─── Table Ordering States ────────────────────────────────────────────────
  const [orderType, setOrderType] = useState(() => localStorage.getItem('veloura-order-type') || 'Delivery');
  const [tableNumber, setTableNumber] = useState(() => localStorage.getItem('veloura-table-number') || '');
  const [dineInStatus, setDineInStatus] = useState(() => localStorage.getItem('veloura-dine-in-status') || 'Available');
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('veloura-order-type', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('veloura-table-number', tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem('veloura-dine-in-status', dineInStatus);
  }, [dineInStatus]);

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    dispatch({ type: 'SET_LOADING', value: true });
    fetchAllOrders()
      .then(orders => dispatch({ type: 'SET_ORDERS', orders }))
      .catch(err => {
        console.error('[Veloura] fetchAllOrders failed:', err.message);
        dispatch({ type: 'SET_LOADING', value: false });
      });
  }, [ready]);

  // ── Persist offline orders ─────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) {
      localStorage.setItem('veloura-orders', JSON.stringify(state.orders));
    }
  }, [state.orders, ready]);

  // ── Supabase Realtime subscription ────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const channel = supabase
      .channel('orders-live')
      // New order inserted
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          // Fetch full order with items
          const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', payload.new.id)
            .single();

          if (error || !data) return;

          const order = normalizeOrder(data);
          dispatch({ type: 'ADD_ORDER', order });
          playOrderSound();
        }
      )
      // Status updated
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const { id, status } = payload.new;
          dispatch({ type: 'UPDATE_STATUS', id, status });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Veloura] Realtime orders channel active');
        }
      });

    realtimeRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ready]);

  // ── placeOrder ─────────────────────────────────────────────────────────────
  const placeOrder = useCallback(async (orderData) => {
    if (ready) {
      try {
        // Save to Supabase — Realtime will push back to all connected clients
        const saved = await saveOrderToSupabase(orderData);
        // Optimistic local add (Realtime echo will be deduped by ADD_ORDER)
        const optimistic = {
          ...orderData,
          id:          saved.id,
          orderNumber: saved.order_number,
          status:      ORDER_STATUS.PENDING,
          createdAt:   saved.created_at,
        };
        dispatch({ type: 'ADD_ORDER', order: optimistic });
        playOrderSound();
        return optimistic;
      } catch (err) {
        console.error('[Veloura] placeOrder failed, falling back to local:', err.message);
      }
    }

    // ── Offline / demo fallback ──────────────────────────────────────────────
    const id = `ORD-${localCounter++}`;
    const order = {
      ...orderData,
      id,
      orderNumber: localCounter - 1,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      orderType: orderData.orderType || 'Delivery',
      tableNumber: orderData.tableNumber || '',
      waiterNotes: orderData.waiterNotes || '',
    };
    dispatch({ type: 'ADD_ORDER', order });
    playOrderSound();
    return order;
  }, [ready]);

  // ── updateStatus ──────────────────────────────────────────────────────────
  const updateStatus = useCallback(async (id, status) => {
    // Optimistic local update immediately (instant UI response)
    dispatch({ type: 'UPDATE_STATUS', id, status });

    if (ready) {
      try {
        await updateOrderStatusInSupabase(id, status);
        // Realtime UPDATE event will arrive and be deduped (same status, no visible change)
      } catch (err) {
        console.error('[Veloura] updateStatus failed:', err.message);
        // Could roll back here if needed
      }
    }
  }, [ready]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const markNotifRead    = useCallback((id) => dispatch({ type: 'MARK_NOTIF_READ', id }), []);
  const markAllRead      = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), []);
  const toggleNotifDrawer = useCallback(() => dispatch({ type: 'TOGGLE_NOTIF_DRAWER' }), []);
  const closeNotifDrawer = useCallback(() => dispatch({ type: 'CLOSE_NOTIF_DRAWER' }), []);
  const updateMenuItem   = useCallback((item) => dispatch({ type: 'UPDATE_MENU_ITEM', item }), []);
  const addMenuItem      = useCallback((item) => dispatch({ type: 'ADD_MENU_ITEM', item }), []);
  const deleteMenuItem   = useCallback((id) => dispatch({ type: 'DELETE_MENU_ITEM', id }), []);

  const getOrdersByStatus = useCallback(
    (status) => state.orders.filter(o => o.status === status),
    [state.orders]
  );

  const getTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    return state.orders.filter(o => new Date(o.createdAt).toDateString() === today);
  }, [state.orders]);

  const getTodayRevenue = useCallback(() =>
    getTodayOrders()
      .filter(o => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((s, o) => s + o.total, 0),
    [getTodayOrders]
  );

  // ── Get single order by id (for order tracking) ───────────────────────────
  const getOrder = useCallback((id) =>
    state.orders.find(o => o.id === id) || null,
    [state.orders]
  );

  return (
    <OrderContext.Provider value={{
      orders:          state.orders,
      loading:         state.loading,
      notifications:   state.notifications,
      unreadCount:     state.unreadCount,
      notifDrawerOpen: state.notifDrawerOpen,
      menuItems:       state.menuItems,
      isOnline:        ready,
      placeOrder,
      updateStatus,
      markNotifRead,
      markAllRead,
      toggleNotifDrawer,
      closeNotifDrawer,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      getOrdersByStatus,
      getTodayOrders,
      getTodayRevenue,
      getOrder,
      orderType,
      setOrderType,
      tableNumber,
      setTableNumber,
      dineInStatus,
      setDineInStatus,
      modeSelectorOpen,
      setModeSelectorOpen,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
