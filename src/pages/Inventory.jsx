// src/pages/inventory/Inventory.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot';

const Inventory = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();

  return (
    <div className="inventory-page">
      <h1>{player.name}'s Inventory</h1>
      <div className="inventory-layout">
        <div className="inventory-grid">
          {player.inventory.map((item, index) => (
            <InventorySlot
              key={index}
              item={item}
              index={index}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
