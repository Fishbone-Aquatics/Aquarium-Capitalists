import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';
import Tooltip from './Tooltip';
import {
  swapItems,
  unequipItem,
  setEquipmentFlag,
  swapInventoryAndEquipment
} from '../features/player/playerSlice';

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

const InventorySlot = ({ item, index, dispatch, onContextMenu, isContextMenuVisible }) => {
  const isEmptySlot = !item || item.id === 'empty-slot';
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipData = extractTooltipData(item);
  const slotRef = useRef(null);

  useEffect(() => {
    console.log(`Item updated in slot ${index}:`, item);
  }, [item, index]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem) => {
      console.log(`Dropping item:`, draggedItem);
      if (draggedItem.isEquipmentSlot) {
        console.log(`Item is from equipment slot`);
        console.log(`Current item in target slot ${index}:`, item);
        if (isEmptySlot) {
          console.log(`Dispatching unequipItem:`, { slot: draggedItem.index, targetIndex: index });
          dispatch(unequipItem({ slot: draggedItem.index, targetIndex: index }));
        } else {
          console.log(`Dispatching swapInventoryAndEquipment:`);
          dispatch(swapInventoryAndEquipment({ fromEquipmentSlot: draggedItem.index, toInventoryIndex: index }));
        }
        dispatch(setEquipmentFlag({ index: draggedItem.index, isEquipmentSlot: false }));
      } else {
        console.log(`Dispatching swapItems:`);
        dispatch(swapItems({ from: draggedItem.index, to: index }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (dropRef.current) {
      console.log(`Drop ref assigned to slot ${index}`);
    }
  }, [dropRef, index]);

  const handleContextMenu = (e) => {
    if (!isEmptySlot) {
      onContextMenu(e, item, index);
    }
  };

  return (
    <div
      ref={dropRef}
      className={`item-box ${isOver ? 'highlight' : ''} ${isContextMenuVisible ? 'no-hover' : ''}`}
      onContextMenu={handleContextMenu}
    >
      {!isEmptySlot ? (
        <div
          className="item-icon"
          onMouseEnter={() => !isContextMenuVisible && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <DraggableItem key={`${item.id}-${index}`} item={item} index={index} isEquipmentSlot={item.isEquipmentSlot} />
          {showTooltip && <Tooltip data={tooltipData} />}
          {item.quantity > 0 && <div className="quantity">{item.quantity}</div>}
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
