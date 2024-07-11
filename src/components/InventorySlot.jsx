import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItems';
import { swapItems, unequipItem, setEquipmentFlag, swapInventoryAndEquipment } from '../features/player/playerSlice';
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

  useEffect(() => {
    console.log("Item updated in slot:", index, item);
  }, [item, index]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      console.log("Dropping item:", draggedItem);
      if (draggedItem.isEquipmentSlot) {
        if(isEmptySlot) {
          console.log("Dispatching unequipItem:", { slot: draggedItem.index, targetIndex: index });
          dispatch(unequipItem({ slot: draggedItem.index, targetIndex: index }));
          dispatch(setEquipmentFlag({ index: index, isEquipmentSlot: false }));
        }
        else {
          console.log("Dispatching swap inv items:")
          //dispatch(swapInventoryAndEquipment({ fromEquipmentSlot: draggedItem.index, toInventoryIndex: index }));
          //dispatch(setEquipmentFlag({ index: index, isEquipmentSlot: false }));
        }
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
          <DraggableItem key={`${item.id}-${index}`} item={item} index={index} isEquipmentSlot={true}/>
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
