import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// ─── Customer pages ──────────────────────────────────────────────────────────
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import TrustSection     from './components/TrustSection';
import Menu             from './components/Menu';
import VelouraExperience from './components/VelouraExperience';
import GuestFavorites   from './components/GuestFavorites';
import Locations        from './components/Locations';
import ReservationContact from './components/ReservationContact';
import HowItWorks       from './components/HowItWorks';
import TryTableOrderingBanner from './components/TryTableOrderingBanner';
import WhyGuestsLoveVeloura from './components/WhyGuestsLoveVeloura';
import Footer           from './components/Footer';
import MagneticCursor   from './components/MagneticCursor';
import FloatingParticles from './components/FloatingParticles';
import CartDrawer       from './components/CartDrawer';
import LiquidTransition from './components/LiquidTransition';
import CategoryPage     from './pages/CategoryPage';
import CheckoutPage     from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage  from './pages/OrderHistoryPage';
import LoginPage         from './pages/LoginPage';
import SignupPage        from './pages/SignupPage';
import TableRouteHandler from './pages/TableRouteHandler';

// ─── Admin pages ──────────────────────────────────────────────────────────────
import AdminLayout        from './admin/components/AdminLayout';
import ProtectedRoute     from './admin/components/ProtectedRoute';
import NewOrderToast      from './admin/components/NewOrderToast';
import AdminLogin         from './admin/pages/AdminLogin';
import AdminDashboard     from './admin/pages/AdminDashboard';
import AdminOrders        from './admin/pages/AdminOrders';
import AdminOrderDetail   from './admin/pages/AdminOrderDetail';
import AdminMenuManagement from './admin/pages/AdminMenuManagement';
import AdminAnalytics     from './admin/pages/AdminAnalytics';
import AdminKitchen       from './admin/pages/AdminKitchen';

// ─── Contexts ─────────────────────────────────────────────────────────────────
import { TransitionProvider } from './contexts/TransitionContext';
import { CartProvider }       from './contexts/CartContext';
import { OrderProvider }      from './contexts/OrderContext';
import { AdminAuthProvider }  from './contexts/AdminAuthContext';
import { AuthProvider }       from './contexts/AuthContext';

// ─── Customer shell — Navbar + Footer + all premium effects ──────────────────
const CustomerShell = () => {
  const location = useLocation();
  return (
    <div className="bg-background text-on-surface font-body selection:bg-orange-200/30 relative">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── Main pages ── */}
            <Route path="/" element={
              <>
                <Hero />
                <TrustSection />
                <HowItWorks />
                <TryTableOrderingBanner />
                <Menu />
                <VelouraExperience />
                <WhyGuestsLoveVeloura />
                <GuestFavorites />
                <Locations />
                <ReservationContact />
              </>
            } />
            <Route path="/menu/:slug"       element={<CategoryPage />} />
            <Route path="/checkout"         element={<CheckoutPage />} />

            {/* ── Order tracking & history ── */}
            <Route path="/track/:orderId"   element={<OrderTrackingPage />} />
            <Route path="/orders/history"   element={<OrderHistoryPage />} />

            {/* ── Auth ── */}
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/signup"           element={<SignupPage />} />

            {/* ── Catch-all inside customer shell ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingParticles />
      <LiquidTransition />
      <CartDrawer />
      {/* New-order confirmation toast on customer side */}
      <NewOrderToast adminMode={false} />
    </div>
  );
};

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <OrderProvider>
          <TransitionProvider>
            <CartProvider>
              <Router>
                {/*
                 * MagneticCursor lives at the true root — outside all routes —
                 * so it persists across customer pages AND admin pages.
                 * z-index: 2147483647 guarantees nothing covers it.
                 */}
                <MagneticCursor />

                <Routes>
                  {/* ── Admin routes (separate shell, no Navbar/Footer) ── */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index                element={<AdminDashboard />} />
                    <Route path="dashboard"     element={<AdminDashboard />} />
                    <Route path="orders"        element={<AdminOrders />} />
                    <Route path="order/:id"     element={<AdminOrderDetail />} />
                    <Route path="menu-management" element={<AdminMenuManagement />} />
                    <Route path="analytics"     element={<AdminAnalytics />} />
                    <Route path="kitchen"       element={<AdminKitchen />} />
                  </Route>

                  {/* ── Table QR welcome route (standalone) ── */}
                  <Route path="/table/:tableNum" element={<TableRouteHandler />} />

                  {/* ── All customer routes ── */}
                  <Route path="/*" element={<CustomerShell />} />
                </Routes>
              </Router>
            </CartProvider>
          </TransitionProvider>
        </OrderProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;
