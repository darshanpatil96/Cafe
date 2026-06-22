import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLogin = () => {
  const { login, loginError, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (admin) navigate('/admin/dashboard', { replace: true });
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulated async
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0905] flex items-center justify-center px-4 relative overflow-hidden" style={{ cursor: 'none' }}>
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-400/20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-2xl shadow-amber-400/30"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="material-symbols-outlined text-3xl text-stone-950" style={{fontVariationSettings:"'FILL' 1"}}>coffee</span>
          </motion.div>
          <h1 className="font-headline text-2xl italic text-stone-100">Aura Cafe</h1>
          <p className="text-stone-500 text-xs tracking-[0.3em] uppercase mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-stone-950/80 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-2xl">
          <h2 className="font-headline text-xl text-stone-100 mb-1">Welcome back</h2>
          <p className="text-stone-500 text-sm mb-7">Sign in to access the dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">person</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  className="w-full bg-stone-900/60 border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-amber-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-stone-900/60 border border-stone-800 rounded-xl pl-10 pr-10 py-3 text-stone-200 text-sm placeholder:text-stone-700 focus:outline-none focus:border-amber-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {loginError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
              >
                {loginError}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 font-extrabold text-sm tracking-widest uppercase shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-shadow disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-stone-950/40 border-t-stone-950 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-amber-400/5 border border-amber-400/15 rounded-xl">
            <p className="text-amber-400/70 text-[10px] uppercase tracking-wider mb-1.5 font-bold">Demo Credentials</p>
            <div className="space-y-0.5 text-stone-500 text-xs font-mono">
              <p>admin / aura2024 — Manager</p>
              <p>kitchen / kitchen123 — Kitchen</p>
              <p>cashier / cashier123 — Cashier</p>
            </div>
          </div>
        </div>

        <p className="text-center text-stone-700 text-xs mt-6">
          ← <a href="/" className="hover:text-orange-200 transition-colors">Back to Aura Cafe</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
