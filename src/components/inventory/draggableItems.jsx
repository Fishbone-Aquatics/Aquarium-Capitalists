import React from 'react';
import { useDrag } from 'react-dnd';


const DraggableItem = ({ item, onClick }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'item',
      item: item,
      collect: monitor => ({
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
  
    // Ensure the onClick is attached to an element that correctly registers clicks.
  //   return (
  //     <div ref={dragRef} alt={item.name} className="item-box" onClick={() => onClick(item)} style={{ opacity: isDragging ? 0.5 : 1 }}>
  //       <div className="item-icon">
  //         <img src={item.image} alt={item.name} />
  //       </div>
  //       <div className="item-details">
  //         {item.name} ({item.type}) - Quantity: {item.quantity}
  //       </div>
  //     </div>
  //   );
  // };
  return (
    <div ref={dragRef} alt={item.name} className="item-box" onClick={() => onClick(item)} style={{ opacity: isDragging ? 0.5 : 1 }}>
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