import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../css/inventory.css'; // Ensure this CSS file contains the necessary styles
import DraggableItem from '../components/inventory/draggableItems';

function Inventory() {
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    if (item) {
      dispatch(equipItem({ item, slot: determineSlot(item.type) }));
    }
  };

  return (
      <div>
        <h1>{player.name}'s Inventory</h1>
        <h2>Inventory:</h2>
        <div className="inventory-grid">
          {player.inventory.map((item, index) => (
            item ? (
              <DraggableItem
                key={item.id}
                className="item-box"
                item={item}
                alt={item.name}
                onClick={() => handleClick(item)}
              />
            ) : (
              <div key={index} className="item-box empty-slot">
                Empty Slot
              </div>
            )
          ))}
        </div>
      </div>
  );
}

export default Inventory;
