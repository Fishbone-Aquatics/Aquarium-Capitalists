// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Expeditions from './pages/Expeditions';
import Gathering from './pages/Gathering';
import CurrentStatus from './components/CurrentStatus';
import Equipment from './components/Equipment';
import Stats from './components/Stats';
import AquariumShop from './components/AquariumShop';
import Statistics from './components/Statistics';
import About from './pages/About';
import XP from './pages/Xp';

import './App.css';
import './styles/tooltip.css';

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className="app-grid">
            <div className="sidebar">
              <Link to="/">Home</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/expeditions">Expeditions</Link>
              <Link to="/gathering">Gathering</Link>
              <Link to="/about">About</Link>
              <Link to="/xp">XP Curve Chart</Link>
            </div>
            <div className="status-bar">
              <CurrentStatus />
            </div>
            <main className="main-display">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/expeditions" element={<Expeditions />} />
                <Route path="/gathering" element={<Gathering />} />
                <Route path="/about" element={<About />} />
                <Route path="/xp" element={<XP />} />
              </Routes>
            </main>
            <aside className="right-side">
              <RightSideContent />
            </aside>
          </div>
        </Router>
      </DndProvider>
    </Provider>
  );
}

function RightSideContent() {
  const location = useLocation();

  if (location.pathname === '/') {
    return (
      <div className="right-side-content">
        <AquariumShop />
      </div>
    );
  }

  if (location.pathname === '/inventory') {
    return (
      <div className="right-side-content">
        <Stats />
        <Equipment />
      </div>
    );
  }

  if (location.pathname === '/expeditions') {
    return (
      <div className="right-side-content">
        <Statistics />
      </div>
    );
  }

  return null;
}

export default App;
