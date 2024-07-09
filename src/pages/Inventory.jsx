import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import '../css/inventory.css'; 
import DraggableItem from '../components/inventory/draggableItems';
import { swapItems, unequipItem, equipItem, addItemToInventory } from '../features/player/playerSlice'; // Import actions

const InventorySlot = ({ item, index, onSwap, onUnequip }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      if (draggedItem.equipmentSlot) {
        onUnequip(draggedItem.equipmentSlot, index);
      } else {
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

const EquipmentSlot = ({ slot, item }) => {
  const dispatch = useDispatch();
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'item',
    drop: (droppedItem) => {
      if (droppedItem) {
        console.log(`Dropped item: ${droppedItem.name} into slot: ${slot}`);
        dispatch(equipItem({ item: droppedItem, slot }));
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  });

  const isEmptySlot = !item || item.id === 'empty-slot';

  return (
    <div ref={dropRef} className="item-box" style={{ backgroundColor: isOver ? 'lightgreen' : canDrop ? 'lightblue' : 'transparent' }}>
      {!isEmptySlot ? (
        <>
          <div className="item-icon">
            <DraggableItem item={{ ...item, equipmentSlot: slot }} index={slot} />
          </div>
          <div className="item-details">
            <span>{item.type} - {item.name}</span>
          </div>
        </>
      ) : (
        <div className="item-details">
          <span>Empty {slot} slot</span>
        </div>
      )}
    </div>
  );
};

function Inventory() {
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
            onSwap={handleSwap}
            onUnequip={handleUnequip}
          />
        ))}
      </div>
      <h2>Equipment:</h2>
      <div className="equipment-grid">
        {Object.entries(player.equipment).map(([slot, item]) => (
          <EquipmentSlot key={slot} slot={slot} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Inventory;
