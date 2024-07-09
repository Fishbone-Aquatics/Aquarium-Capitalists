import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import '../css/inventory.css';
import DraggableItem from '../components/inventory/draggableItems';
import { swapItems, unequipItem } from '../features/player/playerSlice';

const InventorySlot = ({ item, index, onSwap, onUnequip }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      if (draggedItem.equipmentSlot) {
        console.log(`Unequipping item: ${draggedItem.name} from slot: ${draggedItem.equipmentSlot}`);
        onUnequip(draggedItem.equipmentSlot, index);
      } else {
        console.log(`Swapping items: ${draggedItem.name} at index: ${draggedItem.index} with item at index: ${index}`);
        onSwap(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const isEmptySlot = !item || item.id === 'empty-slot';

  return (
    <div ref={dropRef} className={`item-box ${isOver ? 'highlight' : ''}`}>
      {!isEmptySlot ? (
        <div className="item-icon">
          <DraggableItem item={item} index={index} />
        </div>
      ) : (
        <div className="item-details">
          <span>Empty inventory slot</span>
        </div>
      )}
    </div>
  );
};

function Inventory() {
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();

  const handleSwap = (draggedIndex, targetIndex) => {
    console.log(`Swapping items in inventory: from index ${draggedIndex} to ${targetIndex}`);
    dispatch(swapItems({ from: draggedIndex, to: targetIndex }));
  };

  const handleUnequip = (slot, targetIndex) => {
    console.log(`Unequipping item from slot ${slot} to inventory index ${targetIndex}`);
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
            onSwap={handleSwap}
            onUnequip={handleUnequip}
          />
        ))}
      </div>
    </div>
  );
}

export default Inventory;
