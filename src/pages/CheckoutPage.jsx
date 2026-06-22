import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';

const inputClass =
  'w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:border-orange-200/50 focus:bg-stone-800 transition-all';

const CheckoutPage = () => {
  const { items, subtotal, gst, grandTotal, itemCount, clearCart, updateQty, removeItem } = useCart();
  const { placeOrder, orderType, tableNumber } = useOrders();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const isDineIn = orderType === 'Dine In';
      const order = await placeOrder({
        customerName: form.name,
        phone:        form.phone,
        email:        form.email,
        address:      isDineIn 
          ? `Table ${tableNumber}` 
          : orderType === 'Takeaway' 
            ? 'Takeaway Counter' 
            : `${form.address}, ${form.city} - ${form.pincode}`,
        orderType:    orderType,
        tableNumber:  isDineIn ? tableNumber : '',
        items:        items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal,
        gst,
        total: grandTotal,
        notes:        isDineIn ? '' : form.notes,
        waiterNotes:  isDineIn ? form.notes : '',
      });
      setPlacedOrder(order);
      setOrderPlaced(true);
      clearCart();
    } finally {
      setPlacing(false);
    }
  };

  // Empty cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6 px-8">
        <span className="material-symbols-outlined text-6xl text-stone-700">shopping_bag</span>
        <p className="text-stone-400 font-light text-lg">Your cart is empty.</p>
        <Link
          to="/"
          className="bg-orange-200 text-stone-950 px-8 py-3 rounded-full font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  // Order success
  if (orderPlaced && placedOrder) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-8 px-8 text-center pt-20">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="font-headline text-3xl text-stone-100 italic">Order Placed!</h2>
          <p className="text-stone-400 font-light max-w-sm">
            Thank you for your order. Our team will prepare your selection with care and craftsmanship.
          </p>
          {placedOrder.orderType === 'Dine In' && (
            <p className="text-orange-200 text-sm font-medium">
              We are serving you at <span className="underline">Table {placedOrder.tableNumber}</span>.
            </p>
          )}
          <p className="font-mono text-orange-200 font-bold text-lg">#{placedOrder.orderNumber}</p>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track/${placedOrder.id}`}
            className="flex items-center gap-2 justify-center bg-orange-200 text-stone-950 px-8 py-3 rounded-full font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all"
          >
            <span className="material-symbols-outlined text-base">my_location</span>
            Track Order
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 justify-center border border-stone-700 text-stone-300 px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-stone-800 transition-all"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const isDineIn = orderType === 'Dine In';
  const isDelivery = orderType === 'Delivery';

  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-stone-500 text-xs tracking-widest uppercase mb-10" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-orange-200">Checkout</span>
        </nav>

        <h1 className="font-headline text-4xl text-stone-100 italic mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: Information form */}
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div className="bg-stone-900/60 backdrop-blur-md border border-stone-800/60 rounded-2xl p-6 space-y-5">
              <h2 className="text-stone-300 text-xs tracking-widest uppercase font-bold">
                {orderType === 'Dine In' 
                  ? 'Dine-In Guest Details' 
                  : orderType === 'Takeaway' 
                    ? 'Takeaway Details' 
                    : 'Delivery Information'}
              </h2>
              
              {isDineIn && (
                <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl text-orange-200">table_restaurant</span>
                    <div>
                      <p className="text-stone-200 text-xs font-semibold uppercase tracking-wider">Dining Location</p>
                      <p className="text-stone-400 text-xs mt-0.5">Your order will be served directly to your seat.</p>
                    </div>
                  </div>
                  <div className="bg-stone-900 border border-stone-700 px-4 py-2 rounded-lg text-center min-w-[80px]">
                    <span className="block text-[8px] text-stone-500 uppercase tracking-widest">Table</span>
                    <span className="font-mono text-lg font-bold text-orange-200">{tableNumber || 'N/A'}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="Your Name" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" className={inputClass} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" className={inputClass} required />
                </div>

                {isDelivery && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="address">Delivery Address</label>
                      <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
                        placeholder="House / Street / Apartment" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="city">City</label>
                      <input id="city" name="city" type="text" value={form.city} onChange={handleChange}
                        placeholder="Mumbai" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="pincode">PIN Code</label>
                      <input id="pincode" name="pincode" type="text" value={form.pincode} onChange={handleChange}
                        placeholder="400001" className={inputClass} required pattern="\d{6}" />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-stone-500 text-xs uppercase tracking-wider mb-1.5" htmlFor="notes">
                    {isDineIn ? 'Special Instructions / Waiter Notes (optional)' : 'Special Instructions (optional)'}
                  </label>
                  <textarea id="notes" name="notes" value={form.notes} onChange={handleChange}
                    placeholder={isDineIn ? "Allergies, customize ingredients, extra cutlery..." : "Allergies, preferences, seating requests..."} rows={3}
                    className={`${inputClass} resize-none`} />
                </div>
              </div>

              {isDineIn && (
                <div className="pt-2 flex items-center gap-2 text-stone-400 text-xs">
                  <span className="material-symbols-outlined text-orange-200/80 text-lg">hourglass_empty</span>
                  <span>Estimated Preparation Time: <strong className="text-stone-200">12 - 18 minutes</strong></span>
                </div>
              )}
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={placing || (isDineIn && !tableNumber)}
              className="w-full py-4 bg-orange-200 text-stone-950 font-extrabold text-sm tracking-widest uppercase rounded-xl hover:bg-orange-100 transition-all shadow-[0_0_30px_rgba(254,212,136,0.15)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {placing ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Placing Order…
                </>
              ) : isDineIn && !tableNumber ? (
                'Select a Table to Order'
              ) : (
                `Place ${orderType} Order · ₹${grandTotal}`
              )}
            </button>
          </form>

          {/* Right: Order summary */}
          <div className="space-y-4">
            <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-stone-800/60">
                <h2 className="text-stone-300 text-xs tracking-widest uppercase font-bold">
                  Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h2>
              </div>

              {/* Items */}
              <div className="px-4 py-3 space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-200 text-xs font-medium truncate">{item.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-0">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center border border-stone-600 rounded-l text-stone-400 hover:text-orange-200 text-xs font-bold"
                            aria-label="Decrease">−</button>
                          <span className="w-6 h-5 flex items-center justify-center border-t border-b border-stone-600 text-stone-300 text-xs font-mono">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center border border-stone-600 rounded-r text-stone-400 hover:text-orange-200 text-xs font-bold"
                            aria-label="Increase">+</button>
                        </div>
                        <span className="text-orange-200 text-xs font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="text-stone-600 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${item.title}`}>
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t border-stone-800/60 space-y-2.5">
                <div className="flex justify-between text-stone-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-stone-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-sm">
                  <span>GST (5%)</span>
                  <span className="text-stone-200">₹{gst}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-sm">
                  <span>Delivery</span>
                  <span className="text-green-400 text-xs font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-stone-100 font-bold text-base pt-2 border-t border-stone-800">
                  <span>Grand Total</span>
                  <span className="text-orange-200">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-stone-900/40 border border-stone-800/40 rounded-xl px-4 py-3 flex flex-wrap gap-3 justify-around">
              {[
                { icon: 'verified', label: 'Secure Payment' },
                { icon: 'local_shipping', label: 'Free Delivery' },
                { icon: 'restaurant', label: 'Fresh Prepared' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-stone-500 text-xs">
                  <span className="material-symbols-outlined text-base text-orange-200/70">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
