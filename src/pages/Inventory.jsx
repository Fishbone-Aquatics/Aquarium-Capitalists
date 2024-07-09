import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import '../styles/inventory.css';
import DraggableItem from '../components/draggableItems';
import { swapItems, unequipItem } from '../features/player/playerSlice';
import Tooltip from '../components/Tooltip';

const extractTooltipData = (item) => {
  const tooltip = item.tooltip || {};

  return {
    name: tooltip.name || item.name,
    type: tooltip.type || item.type,
    description: tooltip.description || item.description,
    id: tooltip.id || item.id,
    statChanges: tooltip.statChanges || item.statChanges,
  };
};

const InventorySlot = ({ item, index, onSwap, onUnequip }) => {
  const isEmptySlot = !item || item.id === 'empty-slot';
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipData = extractTooltipData(item);

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

  //console.log(`Rendering slot at index ${index}, item:`, item, 'Tooltip Data:', tooltipData);

  return (
    <div ref={dropRef} className={`item-box ${isOver ? 'highlight' : ''}`}>
      {!isEmptySlot ? (
        <div className="item-icon"
          onMouseEnter={() => {
            console.log('Mouse entered item slot:', item);
            setShowTooltip(true);
          }}
          onMouseLeave={() => {
            console.log('Mouse left item slot:', item);
            setShowTooltip(false);
          }}
        >
          <DraggableItem item={item} index={index} />
          {showTooltip && <Tooltip data={tooltipData} />}
        </div>
      ) : (
        <div className="item-details">
          <span>Empty inventory slot</span>
        </div>
      )}
    </div>
  );
};

const Inventory = () => {
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
};

export default Inventory;
