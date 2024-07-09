import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { equipItem, swapEquipmentAndInventory } from '../features/player/playerSlice';
import DraggableItem from './draggableItems';

const EquipmentSlot = ({ slot, item }) => {
  const dispatch = useDispatch();
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'item',
    canDrop: (droppedItem) => {
      // Check if the item type matches the slot type
      return droppedItem.type.toLowerCase() === slot.toLowerCase();
    },
    drop: (droppedItem) => {
      if (droppedItem) {
        console.log(`Dropped item: ${droppedItem.name} into slot: ${slot}`);
        console.log(`Current item in slot: ${item.name}`);
        if (item.id !== 'empty-slot') {
          dispatch(swapEquipmentAndInventory({ fromInventoryIndex: droppedItem.index, toEquipmentSlot: slot }));
        } else {
          dispatch(equipItem({ item: droppedItem, slot }));
        }
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
        </>
      ) : (
        <div className="item-details">
          <span>Empty {slot} slot</span>
        </div>
      )}
    </div>
  );
};

const Equipment = () => {
  const equipment = useSelector(state => state.player.equipment);

  return (
    <div className="equipment-grid">
      {Object.entries(equipment).map(([slot, item]) => (
        <EquipmentSlot key={slot} slot={slot} item={item} />
      ))}
    </div>
  );
};

export default Equipment;
