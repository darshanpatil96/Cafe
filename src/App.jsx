import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Serenity from './components/Serenity';
import Locations from './components/Locations';
import Footer from './components/Footer';
import MagneticCursor from './components/MagneticCursor';
import FloatingParticles from './components/FloatingParticles';
import { TransitionProvider } from './contexts/TransitionContext';
import LiquidTransition from './components/LiquidTransition';




function App() {
  return (
    <TransitionProvider>
      <Router>
        <div className="bg-background text-on-surface font-body selection:bg-orange-200/30 relative">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Menu />
                <Serenity />
                <Locations />
              </>
            } />
          </Routes>
        </main>
        <Footer />
        <MagneticCursor />
        <FloatingParticles />
        <LiquidTransition />
      </div>
    </Router>
    </TransitionProvider>
  );
}

export default App;