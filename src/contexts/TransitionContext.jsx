import React, { createContext, useContext, useState, useCallback } from 'react';

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [onTransitionHalfway, setOnTransitionHalfway] = useState(null);

  // Trigger a transition and execute a callback when the screen is fully covered
  const startTransition = useCallback((callback) => {
    setIsTransitioning(true);
    setOnTransitionHalfway(() => callback);
    
    // Reset state after animation finishes (duration is 1.5s total)
    // The exact timing depends on the Framer Motion sequence in LiquidTransition
    setTimeout(() => {
      setIsTransitioning(false);
      setOnTransitionHalfway(null);
    }, 1500); 
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, onTransitionHalfway, setOnTransitionHalfway }}>
      {children}
    </TransitionContext.Provider>
  );
};
