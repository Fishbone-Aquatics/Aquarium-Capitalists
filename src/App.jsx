// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Expeditions from './pages/Expeditions';
import Breeding from './pages/Breeding';
import Action from './components/Action';
import Equipment from './components/Equipment';
import Stats from './components/Stats';
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
              <Link to="/breeding">Breeding</Link>
            </div>
            <main className="main-display">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/expeditions" element={<Expeditions />} />
                <Route path="/breeding" element={<Breeding />} />
              </Routes>
            </main>
            <aside className="right-side">
              <Action />
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

  if (location.pathname === '/inventory') {
    return (
      <div className="right-side-content">
        <Equipment />
        <Stats />
      </div>
    );
  }
  return null;
}

export default App;
