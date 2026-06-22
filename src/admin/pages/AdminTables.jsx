import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders, ORDER_STATUS } from '../../contexts/OrderContext';
import { Link } from 'react-router-dom';

const AdminTables = () => {
  const { orders, updateStatus } = useOrders();
  const [selectedTable, setSelectedTable] = useState(null);
  const [qrModalTable, setQrModalTable] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // all, occupied, available
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Generate 1 to 50 tables
  const tables = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const tableNum = String(i + 1);
      
      // Active orders: pending, confirmed, preparing, ready
      const activeOrders = orders.filter(o => 
        o.tableNumber === tableNum &&
        o.status !== ORDER_STATUS.COMPLETED &&
        o.status !== ORDER_STATUS.CANCELLED
      );

      const isOccupied = activeOrders.length > 0;
      const totalBill = activeOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        id: tableNum,
        number: tableNum,
        isOccupied,
        activeOrders,
        totalBill,
      };
    });
  }, [orders]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchesFilter = 
        filterMode === 'all' ||
        (filterMode === 'occupied' && t.isOccupied) ||
        (filterMode === 'available' && !t.isOccupied);
      
      const matchesSearch = 
        searchQuery === '' ||
        t.number.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });
  }, [tables, filterMode, searchQuery]);

  // Statistics
  const occupiedCount = useMemo(() => tables.filter(t => t.isOccupied).length, [tables]);
  const availableCount = 50 - occupiedCount;
  const totalActiveRevenue = useMemo(() => tables.reduce((sum, t) => sum + t.totalBill, 0), [tables]);

  // Close Table handler
  const handleCloseTable = async (tableNum) => {
    const tableObj = tables.find(t => t.number === tableNum);
    if (!tableObj || tableObj.activeOrders.length === 0) return;

    if (window.confirm(`Close Table ${tableNum} and mark all active orders as Completed?`)) {
      for (const order of tableObj.activeOrders) {
        await updateStatus(order.id, ORDER_STATUS.COMPLETED);
      }
      setSelectedTable(null);
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-full relative select-none">
      {/* Print stylesheet injected on the fly */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #qr-print-card, #qr-print-card * {
            visibility: visible !important;
          }
          #qr-print-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 420px !important;
            border: 2px solid #d4af37 !important;
            padding: 30px !important;
            background: #ffffff !important;
            color: #000000 !important;
            border-radius: 20px !important;
            box-shadow: none !important;
            text-align: center !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl italic text-stone-100">Table Management</h1>
          <p className="text-stone-500 text-sm">Real-time dine-in POS monitoring dashboard</p>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 bg-stone-900/60 border border-stone-800/80 rounded-2xl px-5 py-3.5 backdrop-blur-md">
          <div className="text-center px-3 border-r border-stone-800">
            <span className="block text-[9px] text-stone-500 uppercase tracking-widest">Occupied</span>
            <span className="text-sm font-bold text-orange-200">{occupiedCount}</span>
          </div>
          <div className="text-center px-3 border-r border-stone-800">
            <span className="block text-[9px] text-stone-500 uppercase tracking-widest">Available</span>
            <span className="text-sm font-bold text-emerald-400">{availableCount}</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-[9px] text-stone-500 uppercase tracking-widest">Active Unpaid</span>
            <span className="text-sm font-mono font-bold text-amber-300">₹{totalActiveRevenue}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">search</span>
          <input
            type="number"
            min="1"
            max="50"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Table Number..."
            className="w-full bg-stone-950/60 border border-stone-800/80 rounded-xl pl-10 pr-4 py-2.5 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-orange-200/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-stone-950/80 border border-stone-800/80 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Tables' },
            { id: 'occupied', label: 'Occupied' },
            { id: 'available', label: 'Available' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                filterMode === f.id
                  ? 'bg-orange-200 text-stone-950 font-extrabold'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
        {filteredTables.map(table => {
          const mainOrder = table.activeOrders[0];
          return (
            <motion.div
              layout
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`relative cursor-pointer aspect-square rounded-3xl border p-4 flex flex-col justify-between transition-all duration-300 group hover:scale-[1.03] ${
                table.isOccupied
                  ? 'bg-amber-400/5 border-amber-400/30 hover:border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.04)]'
                  : 'bg-stone-900/20 border-stone-800/80 hover:border-stone-700/80'
              }`}
            >
              {/* Card top bar */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-stone-500 text-xs tracking-wider uppercase">T-{table.number}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  table.isOccupied ? 'bg-amber-400 animate-pulse' : 'bg-stone-700'
                }`} />
              </div>

              {/* Center status */}
              <div className="text-center my-auto py-2">
                <span className={`block font-headline text-3xl font-black italic tracking-tight ${
                  table.isOccupied ? 'text-amber-300' : 'text-stone-600 group-hover:text-stone-500 transition-colors'
                }`}>
                  {table.number}
                </span>
                <span className="block text-[8px] uppercase tracking-widest text-stone-500 mt-1">
                  {table.isOccupied ? 'Occupied' : 'Available'}
                </span>
              </div>

              {/* Bottom details */}
              <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                {table.isOccupied ? (
                  <>
                    <span className="text-[10px] text-amber-200 font-mono font-bold">₹{table.totalBill}</span>
                    <span className="text-[8px] bg-stone-950 border border-stone-800 text-stone-400 px-1 py-0.5 rounded font-medium">
                      {table.activeOrders.length} order{table.activeOrders.length > 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] text-stone-500">Ready</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrModalTable(table.number);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg border border-stone-800 text-stone-600 hover:text-orange-200 hover:border-orange-200/30 transition-all"
                      title="Generate QR code"
                    >
                      <span className="material-symbols-outlined text-xs">qr_code_2</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Side Details Drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedTable && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTable(null)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-stone-900 border-l border-stone-850 z-50 flex flex-col shadow-2xl p-6 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
                <div>
                  <h2 className="font-headline text-2xl italic text-stone-100">Table {selectedTable.number}</h2>
                  <p className="text-stone-500 text-xs uppercase tracking-widest mt-0.5">
                    Status: <span className={selectedTable.isOccupied ? 'text-amber-400 font-bold' : 'text-stone-400 font-bold'}>
                      {selectedTable.isOccupied ? 'Occupied' : 'Available'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="w-8 h-8 rounded-xl border border-stone-850 hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
                {selectedTable.isOccupied ? (
                  <>
                    <div className="flex items-center justify-between bg-stone-950 p-4 rounded-2xl border border-stone-800">
                      <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Total Table Tab</span>
                      <span className="text-xl font-mono font-bold text-amber-300">₹{selectedTable.totalBill}</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-stone-400 text-xs uppercase tracking-widest font-bold">Active Orders</h3>
                      {selectedTable.activeOrders.map(order => (
                        <div key={order.id} className="bg-stone-950 border border-stone-850/80 rounded-2xl p-4 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/admin/order/${order.id}`}
                              className="text-orange-200 font-mono text-xs font-bold hover:underline flex items-center gap-1"
                            >
                              #{order.orderNumber}
                              <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                            </Link>
                            <span className="text-[10px] text-stone-500">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Customer */}
                          <div>
                            <p className="text-stone-200 text-xs font-semibold">{order.customerName}</p>
                            <p className="text-stone-600 text-[10px]">{order.phone}</p>
                          </div>

                          {/* Items list */}
                          <div className="border-t border-stone-900 pt-2.5 space-y-1">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-xs">
                                <span className="text-stone-400">{item.title}</span>
                                <span className="text-stone-300 font-mono">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Waiter Notes */}
                          {order.waiterNotes && (
                            <div className="bg-orange-950/20 border border-orange-900/30 rounded-xl p-2.5 text-[11px] text-orange-300 italic">
                              "{order.waiterNotes}"
                            </div>
                          )}

                          {/* Order Total & Status */}
                          <div className="flex justify-between items-center border-t border-stone-900 pt-2.5">
                            <span className="text-xs font-bold text-stone-400">Total: <strong className="text-stone-200">₹{order.total}</strong></span>
                            <span className="text-[10px] px-2 py-0.5 border border-stone-850 bg-stone-900/60 rounded-full font-bold uppercase tracking-wider text-amber-400">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 flex flex-col items-center justify-center gap-4 border border-dashed border-stone-800 rounded-3xl">
                    <span className="material-symbols-outlined text-4xl text-stone-700">table_restaurant</span>
                    <div>
                      <p className="text-stone-400 font-medium text-sm">Table is currently empty</p>
                      <p className="text-stone-600 text-xs mt-1">Ready for guests to seat and scan ordering QR code.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="border-t border-stone-800 pt-4 mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setQrModalTable(selectedTable.number);
                  }}
                  className="flex-1 py-3 bg-stone-950 hover:bg-stone-850 border border-stone-800 rounded-xl text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_2</span>
                  Table QR Code
                </button>

                {selectedTable.isOccupied && (
                  <button
                    onClick={() => handleCloseTable(selectedTable.number)}
                    className="flex-1 py-3 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.15)] flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                    Close Table
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── QR Generator & Printable Card Modal ────────────────────────────────── */}
      <AnimatePresence>
        {qrModalTable && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQrModalTable(null)}
              className="fixed inset-0 bg-black/75 z-[60] backdrop-blur-md no-print"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[90vh] bg-stone-900 border border-stone-800 rounded-[2.5rem] p-8 shadow-2xl z-[70] flex flex-col items-center no-print"
            >
              {/* Modal close */}
              <button
                onClick={() => setQrModalTable(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-xl border border-stone-800 hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <h2 className="font-headline text-xl italic text-stone-100 mb-6 text-center">Table QR Code Card</h2>

              {/* Card wrapper to style for printer */}
              <div
                id="qr-print-card"
                className="bg-white border border-orange-200/40 rounded-3xl p-6 text-center max-w-[280px] w-full flex flex-col items-center justify-center shadow-xl mb-8"
              >
                {/* Brand inside print template */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-stone-950 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-200 text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
                  </div>
                  <span className="font-headline text-xs italic text-stone-950 font-bold">Veloura Café</span>
                </div>

                <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1.5 font-bold">Scan & Order Instantly</p>
                <h3 className="font-mono text-3xl font-black text-stone-950 mb-4 border-b border-stone-100 pb-2 w-full">TABLE {qrModalTable}</h3>

                {/* QR Code image generated via free public API */}
                <div className="w-44 h-44 bg-stone-100 rounded-2xl flex items-center justify-center p-2 mb-4 border border-stone-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
                      `${window.location.origin}/table/${qrModalTable}`
                    )}`}
                    alt={`Table ${qrModalTable} QR Code`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[8px] text-stone-400 font-medium">1. Scan QR with your smartphone camera</p>
                  <p className="text-[8px] text-stone-400 font-medium">2. Choose your favorites from our menu</p>
                  <p className="text-[8px] text-stone-400 font-medium">3. Order placed. We'll serve you right here!</p>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-3 w-full border-t border-stone-800 pt-6 mt-2">
                <button
                  onClick={() => setQrModalTable(null)}
                  className="flex-1 py-3 border border-stone-850 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-bold uppercase transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handlePrintQR}
                  className="flex-1 py-3 bg-orange-200 hover:bg-orange-100 text-stone-950 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(254,212,136,0.15)] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-bold">print</span>
                  Print Card
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTables;
