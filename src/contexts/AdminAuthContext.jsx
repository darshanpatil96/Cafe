import React, { createContext, useContext, useState, useCallback } from 'react';

// Demo credentials — swap for real auth when backend is connected
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'veloura2026', role: 'Manager', name: 'Aryan Kapoor' },
  { username: 'kitchen', password: 'kitchen123', role: 'Kitchen', name: 'Chef Rajan' },
  { username: 'cashier', password: 'cashier123', role: 'Cashier', name: 'Meera Nair' },
];

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = sessionStorage.getItem('veloura-admin');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loginError, setLoginError] = useState('');

  const login = useCallback((username, password) => {
    const found = DEMO_CREDENTIALS.find(
      c => c.username === username && c.password === password
    );
    if (found) {
      const session = { ...found, loginAt: new Date().toISOString() };
      setAdmin(session);
      sessionStorage.setItem('veloura-admin', JSON.stringify(session));
      setLoginError('');
      return true;
    }
    setLoginError('Invalid credentials. Try admin / veloura2026');
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    sessionStorage.removeItem('veloura-admin');
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loginError }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
