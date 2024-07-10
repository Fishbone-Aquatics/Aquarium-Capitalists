// src/pages/Gathering.jsx
import React, { useState } from 'react';
import './Gathering.css';

const Gathering = () => {
  const [activeTab, setActiveTab] = useState('minerals');

  return (
    <div className="gathering-container">
      <div className="gathering-header">
        <h2>Pine Tree</h2>
        <img src="/path-to-tree-image.png" alt="Tree" />
        <div className="gathering-drops">
          <h3>Drops</h3>
          <ul>
            <li>Pine Log (Common)</li>
            <li>Apple (Rare)</li>
          </ul>
        </div>
        <button className="gather-btn">Gather</button>
        <div className="gathering-nav">
          <button onClick={() => setActiveTab('minerals')}>Minerals</button>
          <button onClick={() => setActiveTab('resources')}>Resources</button>
        </div>
      </div>
      <div className="gathering-content">
        {activeTab === 'minerals' && (
          <div>
            <h3>Minerals</h3>
            <ul>
              <li>Calcium Carbonate (CaCO3)</li>
              <li>Magnesium</li>
              <li>Iodine</li>
            </ul>
          </div>
        )}
        {activeTab === 'resources' && (
          <div>
            <h3>Resources</h3>
            <ul>
              <li>Iron</li>
              <li>Potassium</li>
              <li>Silica (SiO2)</li>
            </ul>
          </div>
        )}
      </div>
      <div className="gathering-sidebar">
        <h3>Woodcutting</h3>
        <p>Level: 15</p>
        <p>46% (1,837 / 3,975 XP)</p>
        <p>Woodcutting Speed: +12%</p>
        <p>Woodcutting Efficiency: +3.75%</p>
        <p>Total Woodcutting XP: 17,522 XP</p>
      </div>
      <div className="gathering-placeholders">
        <div>Village</div>
        <div>Outskirts</div>
        <div>Consumables</div>
      </div>
    </div>
  );
};

export default Gathering;
