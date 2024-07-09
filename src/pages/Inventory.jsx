import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import '../css/inventory.css'; // Ensure this CSS file contains the necessary styles
import DraggableItem from '../components/inventory/draggableItems';
import { swapItems } from '../features/player/playerSlice'; // Import swapItems action

function Inventory() {
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const handleSwap = (draggedIndex, targetIndex) => {
    dispatch(swapItems({ from: draggedIndex, to: targetIndex }));
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
            onSwap={handleSwap}
          />
        ))}
      </div>
    </div>
  );
}

const InventorySlot = ({ item, index, onSwap }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      onSwap(draggedItem.index, index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={dropRef} className={`item-box ${isOver ? 'highlight' : ''}`}>
      {item ? (
        <DraggableItem
          item={item}
          index={index}
        />
      ) : (
        'Empty Slot'
      )}
    </div>
  );
};

export default Inventory;
