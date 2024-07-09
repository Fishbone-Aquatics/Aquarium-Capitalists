import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Expeditions from './pages/Expeditions';
import Breeding from './pages/Breeding';
import Equipment from './components/equipment/Equipment';
import Stats from './components/equipment/Stats';
import Action from './components/Action'; // Import Action component
import './App.css';
import './css/tooltip.css'; // Import the tooltip CSS

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
              <Stats />
              <Equipment />
            </aside>
          </div>
        </Router>
      </DndProvider>
    </Provider>
  );
}

export default App;
