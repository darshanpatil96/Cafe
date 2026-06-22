import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || SUPABASE_URL === 'https://your-project.supabase.co') {
  console.warn(
    '[Veloura Café] Supabase is not configured. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file. ' +
    'The app will run in offline/local-state mode until then.'
  );
}

// ─── Singleton Supabase client ────────────────────────────────────────────────
export const supabase = createClient(
  SUPABASE_URL  || 'https://placeholder.supabase.co',
  SUPABASE_ANON || 'placeholder-key',
  {
    auth: { persistSession: true, autoRefreshToken: true },
    realtime: { params: { eventsPerSecond: 10 } },
  }
);

// ─── Helper: is Supabase actually configured? ─────────────────────────────────
export const isSupabaseReady = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
  );

// ─── Shape normalizer ─────────────────────────────────────────────────────────
/**
 * Convert a raw Supabase orders row (with joined order_items) into the
 * internal Order shape used everywhere in the app.
 */
export const normalizeOrder = (row) => ({
  id:           row.id,
  orderNumber:  row.order_number,
  customerName: row.customer_name,
  phone:        row.phone        || '',
  email:        row.email        || '',
  address:      row.address      || '',
  tableNumber:  row.table_number || '',
  subtotal:     row.subtotal,
  gst:          row.gst,
  total:        row.total,
  status:       row.status,
  notes:        row.notes        || '',
  orderType:    row.order_type   || 'Delivery',
  waiterNotes:  row.waiter_notes || '',
  createdAt:    row.created_at,
  updatedAt:    row.updated_at   || null,
  items: (row.order_items || []).map(i => ({
    id:       i.item_id,
    title:    i.title,
    price:    i.price,
    quantity: i.quantity,
    image:    i.image || '',
  })),
});

// ─── Orders API ───────────────────────────────────────────────────────────────

/**
 * Save a new order + its items to Supabase.
 * Returns the saved order row (with generated id and order_number).
 */
export const saveOrderToSupabase = async (orderData) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: orderData.customerName,
      phone:         orderData.phone   || null,
      email:         orderData.email   || null,
      address:       orderData.address || null,
      table_number:  orderData.tableNumber || null,
      subtotal:      orderData.subtotal,
      gst:           orderData.gst,
      total:         orderData.total,
      notes:         orderData.notes   || null,
      order_type:    orderData.orderType || 'Delivery',
      waiter_notes:  orderData.waiterNotes || null,
      status:        'Pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const items = orderData.items.map(i => ({
    order_id: order.id,
    item_id:  i.id,
    title:    i.title,
    price:    i.price,
    quantity: i.quantity,
    image:    i.image || null,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);

  if (itemsError) throw itemsError;

  return order;
};

/**
 * Update order status in Supabase.
 */
export const updateOrderStatusInSupabase = async (orderId, status) => {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
};

/**
 * Fetch all orders with their items, newest first.
 * Used by admin dashboard on initial load.
 */
export const fetchAllOrders = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`*, order_items(item_id, title, price, quantity, image)`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (orders || []).map(normalizeOrder);
};

/**
 * Fetch orders by customer email (for order history page).
 */
export const fetchOrdersByEmail = async (email) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(item_id, title, price, quantity, image)`)
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeOrder);
};
