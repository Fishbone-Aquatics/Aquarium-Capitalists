import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item, index, isEquipmentSlot }) => {
  useEffect(() => {
    console.log("DraggableItem updated:", item, index, isEquipmentSlot);
  }, [item, index, isEquipmentSlot]);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'item',
    item: { ...item, index, isEquipmentSlot },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (droppedItem, monitor) => {
      if (monitor.didDrop()) {
        console.log('Item dropped:', droppedItem);
      } else {
        console.log('Drop canceled:', droppedItem);
      }
    }
  }));

  return (
    <div ref={dragRef} className="inventory-slot" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="item-icon">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="item-details">
        {item.name} ({item.type})
      </div>
    </div>
  );
};

export default DraggableItem;
