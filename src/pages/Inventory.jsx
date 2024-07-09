// src/pages/inventory/Inventory.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot'; // Adjusted import path
import { swapItems, unequipItem } from '../features/player/playerSlice';
import Tooltip from '../components/Tooltip';

const Inventory = () => {
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const handleSwap = (draggedIndex, targetIndex) => {
    dispatch(swapItems({ from: draggedIndex, to: targetIndex }));
  };

  const handleUnequip = (slot, targetIndex) => {
    dispatch(unequipItem({ slot, targetIndex }));
  };

  return (
    <div>
      <h1>{player.name}'s Inventory</h1>
      <h2>Inventory:</h2>
      <div className="inventory-grid">
        {player.inventory.map((item, index) => (
          <InventorySlot
            key={index}
            item={item}
            index={index}
            dispatch={dispatch} // Pass dispatch to InventorySlot
          />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
