import React from 'react';
import { Route } from 'react-router-dom';
import CategoryPage from '../pages/CategoryPage';

// Returns an array of <Route> elements for all menu category slugs.
// Usage: wrap in <Routes> in App.jsx
const MenuRoutes = () => (
  <Route path="/menu/:slug" element={<CategoryPage />} />
);

export default MenuRoutes;
