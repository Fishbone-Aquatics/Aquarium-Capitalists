import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { equipItem } from '../../features/player/playerSlice';

const EquipmentSlot = ({ slot, item }) => {
  const dispatch = useDispatch();
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'item',
    drop: (droppedItem) => {
      // Validate dropped item
      console.log(droppedItem, item)
      //if (!droppedItem || droppedItem.type === item.type) {
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
  const imgSrc = item ? item.image : `icons/equipment/${slot}.svg`
  return (
    <div ref={dropRef} className="item-box" style={{ backgroundColor: isOver ? 'lightgreen' : canDrop ? 'lightblue' : 'transparent' }}>
      <div className="item-icon">
        {item ? <img src={item.image} alt={item.name} /> : <img src={imgSrc} alt="Empty Slot" />}
      </div>
      <div className="item-details">
      {item ? <span>{item.type} - {item.name} </span> : <span>Empty Slot</span>}
      </div>
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
