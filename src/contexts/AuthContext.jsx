import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);   // Supabase user object
  const [profile, setProfile] = useState(null);   // public.profiles row
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // ── Load session on mount + subscribe to auth changes ──────────────────
  useEffect(() => {
    if (!isSupabaseReady()) { setLoading(false); return; }

    // Grab current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session) setProfile(null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Sign Up ─────────────────────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, name, phone }) => {
    setAuthError('');
    if (!isSupabaseReady()) {
      setAuthError('Supabase is not configured. Add credentials to .env');
      return { error: true };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
      },
    });

    if (error) { setAuthError(error.message); return { error }; }
    return { data };
  }, []);

  // ── Sign In ─────────────────────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }) => {
    setAuthError('');
    if (!isSupabaseReady()) {
      setAuthError('Supabase is not configured. Add credentials to .env');
      return { error: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthError(error.message); return { error }; }
    return { data };
  }, []);

  // ── Sign Out ────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const clearError = useCallback(() => setAuthError(''), []);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      authError,
      isLoggedIn: !!user,
      signUp,
      signIn,
      signOut,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
