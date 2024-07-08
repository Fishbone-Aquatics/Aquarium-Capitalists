import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { equipItem, determineSlot } from '../../features/player/playerSlice';
import DraggableItem from './draggableItems';

const Inventory = () => {
  const inventory = useSelector(state => state.player.inventory);
  const dispatch = useDispatch();

  const handleClick = (item) => {
    if (item) {
      console.log('Clicked item:', item)
      dispatch(equipItem({ item, slot: determineSlot(item.type) }));
    }
  };

  return (
    <div className="inventory-grid">
      {inventory.map((item, index) => (
        <DraggableItem key={index} item={item} onClick={handleClick} />
      ))}
    </div>
  );
};

export default Inventory;
