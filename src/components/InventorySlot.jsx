import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItems';
import { swapItems, unequipItem } from '../features/player/playerSlice';
import Tooltip from './Tooltip';

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

const InventorySlot = ({ item, index, dispatch, isEquipmentSlot = false }) => {
  const isEmptySlot = !item || item.id === 'empty-slot';
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipData = extractTooltipData(item);

  useEffect(() => {
    console.log("Item updated in slot:", index, item);
  }, [item, index]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      console.log("Dropping item:", draggedItem);
      if (draggedItem.equipmentSlot !== undefined && draggedItem.equipmentSlot !== null) {
        // Dragging from equipment slot to inventory slot
        console.log("Dispatching unequipItem:", { slot: draggedItem.equipmentSlot, targetIndex: index });
        dispatch(unequipItem({ slot: draggedItem.equipmentSlot, targetIndex: index }));
      } else if (draggedItem.index !== undefined && draggedItem.index !== null) {
        // Swapping within inventory
        console.log("Dispatching swapItems:", { from: draggedItem.index, to: index });
        dispatch(swapItems({ from: draggedItem.index, to: index }));
      } else {
        console.error("Invalid drag and drop operation:", draggedItem);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={dropRef} className={`item-box ${isOver ? 'highlight' : ''}`}>
      {!isEmptySlot ? (
        <div
          className="item-icon"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <DraggableItem key={`${item.id}-${index}`} item={item} index={index} isEquipmentSlot={isEquipmentSlot} />
          {showTooltip && <Tooltip data={tooltipData} />}
          {item.quantity > 0 && (
            <div className="quantity">{item.quantity}</div>
          )}
        </div>
      ) : (
        <div className="item-details">
          <span>Empty inventory slot</span>
        </div>
      )}
    </div>
  );
};

export default InventorySlot;
