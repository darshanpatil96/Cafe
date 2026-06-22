import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_DATA, CATEGORY_LIST } from '../../data/menuData';
import { useOrders } from '../../contexts/OrderContext';
import ImageWithFallback from '../../components/ImageWithFallback';

// Flatten all items from menuData into a managed list
const buildInitialItems = () => {
  const items = [];
  Object.entries(MENU_DATA).forEach(([category, arr]) => {
    arr.forEach(item => items.push({ ...item, category }));
  });
  return items;
};

const CATEGORIES = CATEGORY_LIST.map(c => c.name);

const ItemFormModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || {
    id: `item-${Date.now()}`, title: '', description: '', price: '', category: 'Coffee',
    image: '', isAvailable: true, isVeg: true, rating: 4.5, prepTime: '10 mins',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = 'w-full bg-stone-900/60 border border-stone-700/60 rounded-xl px-3 py-2.5 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-amber-400/40 transition-all';

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-stone-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-headline italic text-stone-100 text-lg">{item ? 'Edit Item' : 'Add Item'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 no-scrollbar p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Item Name *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Truffle Fries" className={inputCls} required />
            </div>
            <div>
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} placeholder="299" className={inputCls} required />
            </div>
            <div>
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Prep Time</label>
              <input value={form.prepTime} onChange={e => set('prepTime', e.target.value)} placeholder="15 mins" className={inputCls} />
            </div>
            <div>
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Rating</label>
              <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => set('rating', Number(e.target.value))} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Short description shown on card" className={`${inputCls} resize-none`} />
            </div>
            <div className="col-span-2">
              <label className="block text-stone-500 text-[10px] uppercase tracking-wider mb-1.5">Image URL</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => set('isAvailable', !form.isAvailable)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${form.isAvailable ? 'bg-emerald-500' : 'bg-stone-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isAvailable ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-stone-400 text-sm">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <div
                  onClick={() => set('isVeg', !form.isVeg)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${form.isVeg ? 'bg-green-500' : 'bg-red-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isVeg ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-stone-400 text-sm">{form.isVeg ? 'Veg' : 'Non-Veg'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image preview */}
        {form.image && (
          <div className="px-6 pb-2">
            <ImageWithFallback src={form.image} alt="Preview" className="w-full h-24 object-cover rounded-xl" wrapperClassName="w-full h-24 rounded-xl" />
          </div>
        )}

        <div className="px-6 py-4 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-stone-400 text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button
            onClick={() => { if (form.title && form.price) { onSave(form); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 text-xs font-extrabold tracking-widest uppercase hover:opacity-90 transition-all"
          >
            {item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminMenuManagement = () => {
  const { addMenuItem, updateMenuItem, deleteMenuItem } = useOrders();
  const [items, setItems] = useState(buildInitialItems);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    return items
      .filter(i => activeCategory === 'All' || i.category === activeCategory)
      .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()));
  }, [items, activeCategory, search]);

  const handleSave = (item) => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
      updateMenuItem(item);
    } else {
      setItems(prev => [item, ...prev]);
      addMenuItem(item);
    }
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    deleteMenuItem(id);
    setConfirmDelete(null);
  };

  const toggleAvail = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <h1 className="font-headline text-2xl italic text-stone-100">Menu Management</h1>
          <p className="text-stone-500 text-sm">{items.length} items across {CATEGORIES.length} categories</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 text-xs font-extrabold tracking-widest uppercase px-5 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Item
        </button>
      </div>

      {/* Category pills + search */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48 max-w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">search</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full bg-stone-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-amber-400/40 transition-all"
          />
        </div>
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all ${activeCategory === cat ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-white/8 text-stone-500 hover:text-stone-300 hover:border-white/15'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-stone-950/60 border rounded-2xl overflow-hidden group transition-all duration-300 ${item.isAvailable ? 'border-white/8 hover:border-amber-400/20' : 'border-red-400/15 opacity-60'}`}
            >
              {/* Image */}
              <div className="relative w-full aspect-video overflow-hidden">
                {item.image ? (
                  <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" wrapperClassName="w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-stone-600 text-4xl">restaurant</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                {/* Veg indicator */}
                <div className={`absolute top-2 right-2 w-4 h-4 border-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-400' : 'border-red-400'} bg-stone-950/80`}>
                  <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <span className="absolute bottom-2 left-2 text-[9px] font-bold tracking-widest uppercase text-stone-400 bg-stone-950/80 px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-stone-100 font-semibold text-sm leading-tight">{item.title}</h3>
                  <span className="text-amber-300 font-mono font-bold text-sm shrink-0">₹{item.price}</span>
                </div>
                <p className="text-stone-500 text-xs line-clamp-2 mb-3">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Availability toggle */}
                  <button
                    onClick={() => toggleAvail(item.id)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border transition-all ${item.isAvailable ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10' : 'border-red-400/30 text-red-400 bg-red-400/5 hover:bg-red-400/10'}`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>
                      {item.isAvailable ? 'toggle_on' : 'toggle_off'}
                    </span>
                    {item.isAvailable ? 'Live' : 'Off'}
                  </button>
                  <button
                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                    className="flex items-center gap-1 text-stone-500 hover:text-amber-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-white/8 hover:border-amber-400/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    className="ml-auto text-stone-700 hover:text-red-400 transition-colors p-1"
                    aria-label="Delete item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <ItemFormModal
            item={editingItem}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingItem(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setConfirmDelete(null)} />
            <motion.div
              className="relative z-10 bg-stone-950 border border-red-400/20 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl"
              initial={{ scale: 0.92 }} animate={{ scale: 1 }}
            >
              <span className="material-symbols-outlined text-4xl text-red-400 mb-3 block" style={{fontVariationSettings:"'FILL' 1"}}>delete_forever</span>
              <h3 className="text-stone-100 font-semibold mb-2">Delete this item?</h3>
              <p className="text-stone-500 text-sm mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-stone-400 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-red-400 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenuManagement;
