import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseReady } from '../lib/supabase';

const inputCls =
  'w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 text-sm ' +
  'placeholder:text-stone-700 focus:outline-none focus:border-orange-200/50 transition-all';

const LoginPage = () => {
  const { signIn, authError, clearError, isLoggedIn, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass]     = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn, loading, navigate, from]);

  useEffect(() => { clearError(); }, [clearError]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn({ email: form.email, password: form.password });
    setSubmitting(false);
    if (!error) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 relative overflow-hidden pt-20">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/4 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand mark */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-200 to-amber-400 mb-4 shadow-xl shadow-amber-400/20"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="material-symbols-outlined text-stone-950 text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                coffee
              </span>
            </motion.div>
          </Link>
          <h1 className="font-headline text-2xl italic text-stone-100">Welcome back</h1>
          <p className="text-stone-500 text-sm mt-1">Sign in to your Veloura account</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900/50 backdrop-blur-xl border border-stone-800/60 rounded-2xl p-8 shadow-2xl">
          {!isSupabaseReady() && (
            <div className="mb-5 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-400 text-base mt-0.5 shrink-0">info</span>
              <p className="text-amber-300/80 text-xs leading-relaxed">
                Supabase is not configured. Add your credentials to <code className="bg-stone-800 px-1 rounded">.env</code> to enable authentication.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-stone-400 text-xs uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={`${inputCls} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-lg">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-400/8 border border-red-400/20 rounded-xl px-3 py-2.5"
              >
                <span className="material-symbols-outlined text-red-400 text-base mt-0.5 shrink-0">error</span>
                <p className="text-red-300 text-xs">{authError}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={submitting || !isSupabaseReady()}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-orange-200 text-stone-950 font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-orange-200/15 hover:bg-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing in…
                </>
              ) : 'Sign In'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-sm mt-6">
          No account?{' '}
          <Link to="/signup" className="text-orange-200 hover:text-orange-100 transition-colors font-medium">
            Create one
          </Link>
        </p>
        <p className="text-center mt-3">
          <Link to="/" className="text-stone-700 hover:text-stone-400 text-xs transition-colors">
            ← Back to Veloura Café
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
