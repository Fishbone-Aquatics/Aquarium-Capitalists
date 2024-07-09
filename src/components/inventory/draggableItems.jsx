import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item, index }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'item',
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (droppedItem, monitor) => {
      if (monitor.didDrop()) {
        console.log('Item dropped');
      } else {
        console.log('Drop canceled', item.name);
      }
    }
  }));

  return (
    <div ref={dragRef} className="item-box" style={{ opacity: isDragging ? 0.5 : 1 }}>
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
