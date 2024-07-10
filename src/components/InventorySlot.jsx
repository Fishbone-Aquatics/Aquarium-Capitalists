// src/components/InventorySlot.js

import React, { useState } from 'react';
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

const InventorySlot = ({ item, index, dispatch }) => {
  const isEmptySlot = !item || item.id === 'empty-slot';
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipData = extractTooltipData(item);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      if (draggedItem.equipmentSlot) {
        dispatch(unequipItem({ slot: draggedItem.equipmentSlot, targetIndex: index }));
      } else {
        dispatch(swapItems({ from: draggedItem.index, to: index }));
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
          <DraggableItem item={item} index={index} />
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
