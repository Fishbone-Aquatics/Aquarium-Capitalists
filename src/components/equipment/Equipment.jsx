import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop, useDrag } from 'react-dnd';
import { equipItem, unequipItem } from '../../features/player/playerSlice';
import items from '../../data/items/items'; // Make sure this path is correct

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

  const [{ isDragging }, dragRef] = useDrag({
    type: 'item',
    item: item,
    canDrag: () => item.id !== items.equipment.emptySlot.id,
    end: (draggedItem, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(unequipItem({ slot }));
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const isEmptySlot = item.id === 'empty-slot';

  return (
    <div ref={dropRef} className="item-box" style={{ backgroundColor: isOver ? 'lightgreen' : canDrop ? 'lightblue' : 'transparent' }}>
      {!isEmptySlot ? (
        <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
          <div className="item-icon">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="item-details">
            <span>{item.type} - {item.name}</span>
          </div>
        </div>
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
