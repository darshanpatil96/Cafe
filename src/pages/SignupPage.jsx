import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseReady } from '../lib/supabase';

const inputCls =
  'w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 text-sm ' +
  'placeholder:text-stone-700 focus:outline-none focus:border-orange-200/50 transition-all';

const validate = (form) => {
  const errs = {};
  if (!form.name.trim())        errs.name     = 'Name is required';
  if (!form.email.includes('@')) errs.email   = 'Valid email required';
  if (form.password.length < 6) errs.password = 'At least 6 characters';
  if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
  return errs;
};

const SignupPage = () => {
  const { signUp, authError, clearError, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [success, setSuccess]       = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, loading, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    const { error } = await signUp({
      email:    form.email,
      password: form.password,
      name:     form.name,
      phone:    form.phone,
    });
    setSubmitting(false);
    if (!error) setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 pt-20">
        <motion.div
          className="text-center max-w-sm space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
          </div>
          <div>
            <h2 className="font-headline text-2xl italic text-stone-100 mb-2">Check your email</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              We've sent a confirmation link to <span className="text-orange-200 font-medium">{form.email}</span>.
              Click it to activate your account.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block bg-orange-200 text-stone-950 px-8 py-3 rounded-full font-extrabold text-xs tracking-widest uppercase hover:bg-orange-100 transition-all"
          >
            Go to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 relative overflow-hidden py-24">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/4 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-200 to-amber-400 mb-4 shadow-xl shadow-amber-400/20"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="material-symbols-outlined text-stone-950 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
            </motion.div>
          </Link>
          <h1 className="font-headline text-2xl italic text-stone-100">Create account</h1>
          <p className="text-stone-500 text-sm mt-1">Join Veloura Café for order history & tracking</p>
        </div>

        <div className="bg-stone-900/50 backdrop-blur-xl border border-stone-800/60 rounded-2xl p-8 shadow-2xl">
          {!isSupabaseReady() && (
            <div className="mb-5 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-400 text-base mt-0.5 shrink-0">info</span>
              <p className="text-amber-300/80 text-xs leading-relaxed">
                Supabase is not configured. Auth won't work until you add credentials to <code className="bg-stone-800 px-1 rounded">.env</code>.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">person</span>
                <input type="text" value={form.name} onChange={set('name')}
                  placeholder="Your name" autoComplete="name" className={`${inputCls} pl-10`} />
              </div>
              <AnimatePresence>{errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-1">{errors.name}</motion.p>}</AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">mail</span>
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com" autoComplete="email" className={`${inputCls} pl-10`} />
              </div>
              <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-1">{errors.email}</motion.p>}</AnimatePresence>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">
                Phone <span className="text-stone-600 normal-case tracking-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">call</span>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="+91 98765 43210" autoComplete="tel" className={`${inputCls} pl-10`} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">lock</span>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min 6 characters" autoComplete="new-password" className={`${inputCls} pl-10 pr-10`} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors" aria-label="Toggle">
                  <span className="material-symbols-outlined text-lg">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <AnimatePresence>{errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-1">{errors.password}</motion.p>}</AnimatePresence>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-stone-400 text-xs uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-600 text-lg">lock_reset</span>
                <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
                  placeholder="Same password again" autoComplete="new-password" className={`${inputCls} pl-10`} />
              </div>
              <AnimatePresence>{errors.confirm && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-1">{errors.confirm}</motion.p>}</AnimatePresence>
            </div>

            {authError && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-400/8 border border-red-400/20 rounded-xl px-3 py-2.5">
                <span className="material-symbols-outlined text-red-400 text-base mt-0.5 shrink-0">error</span>
                <p className="text-red-300 text-xs">{authError}</p>
              </motion.div>
            )}

            <motion.button type="submit" disabled={submitting || !isSupabaseReady()} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl bg-orange-200 text-stone-950 font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-orange-200/15 hover:bg-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {submitting ? (
                <>
                  <motion.div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Creating account…
                </>
              ) : 'Create Account'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-200 hover:text-orange-100 transition-colors font-medium">Sign in</Link>
        </p>
        <p className="text-center mt-3">
          <Link to="/" className="text-stone-700 hover:text-stone-400 text-xs transition-colors">← Back to Veloura Café</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
