import React from 'react';
import { useDrag } from 'react-dnd';
import './main.css'; // Import the main CSS file for styling

const InventoryItem = ({ item, handleDropSuccess }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'inventory-item',
    item: item,
    end: (item, monitor) => {
      // Use the handleDropSuccess to signal a successful drop
      handleDropSuccess(item, monitor.didDrop());
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`inventory-selection-item ${item.shape}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {item.name}
    </div>
  );
};

const InventorySelection = ({ items, onItemDropped }) => {
  // This method is called when the drag operation ends
  const handleDropSuccess = (item, didDrop) => {
    // If the item was dropped successfully (i.e., in a valid drop zone), remove it from the selection
    if (didDrop) {
      onItemDropped(item);
    }
  };

  return (
    <div className='inventory-selection'>
      {items.map((item) => (
        <InventoryItem key={item.id} item={item} handleDropSuccess={handleDropSuccess} />
      ))}
    </div>
  );  
};

export default InventorySelection;
