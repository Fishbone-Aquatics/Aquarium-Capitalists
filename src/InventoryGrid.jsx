import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import './main.css';

const InventoryGrid = ({ gridItems, setGridItems, gridSize }) => {
  const containerRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [potentialDropIndices, setPotentialDropIndices] = useState([]);
  
  const handleDrop = (item, monitor) => {
    if (!item) return false;

    console.log('Attempting to drop item:', item);
    console.log('Grid before drop:', gridItems);
    const newGridItems = [...gridItems];

    const clientOffset = monitor.getClientOffset();
    if (!clientOffset || !containerRef.current) return false;

    const rect = containerRef.current.getBoundingClientRect();
    const dropX = Math.floor((clientOffset.x - rect.left) / (rect.width / gridSize));
    const dropY = Math.floor((clientOffset.y - rect.top) / (rect.height / gridSize));
    const startIndex = dropY * gridSize + dropX;

    console.log(`Drop coordinates: X=${dropX}, Y=${dropY}, Start Index=${startIndex}`);

    if (startIndex < 0 || startIndex >= newGridItems.length) {
      console.log('Drop position out of grid bounds');
      return false;
    }

    for (let y = 0; y < item.height; y++) {
      for (let x = 0; x < item.width; x++) {
        let index = startIndex + y * gridSize + x;
        if (index >= newGridItems.length || newGridItems[index] !== null) {
          console.log(`Cannot place item at index=${index}, space is already occupied or out of bounds`);
          return false;
        }
      }
    }

    // Place the item in the grid
    for (let y = 0; y < item.height; y++) {
      for (let x = 0; x < item.width; x++) {
        let index = startIndex + y * gridSize + x;
        newGridItems[index] = item;
      }
    }

    console.log('Grid after drop:', newGridItems);
    setGridItems(newGridItems);
    return true;
    };

  
  // handleDrop handleDrop handleDrop handleDrop handleDrop handleDrop handleDrop handleDrop 
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'inventory-item',
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !containerRef.current) {
        return;
      }
  
      const rect = containerRef.current.getBoundingClientRect();
      const cellWidth = rect.width / gridSize;
      const cellHeight = rect.height / gridSize;
  
      const hoverX = Math.floor((clientOffset.x - rect.left) / cellWidth);
      const hoverY = Math.floor((clientOffset.y - rect.top) / cellHeight);
  
      if (hoverX < 0 || hoverX >= gridSize || hoverY < 0 || hoverY >= gridSize) {
        return;
      }
  
      let indices = [];
      for (let i = 0; i < item.height; i++) {
        for (let j = 0; j < item.width; j++) {
          const index = (hoverY + i) * gridSize + (hoverX + j);
          if (index < gridSize * gridSize) {
            indices.push(index);
          }
        }
      }
  
      setPotentialDropIndices(indices);
      setDraggedItem(item);
    },
    drop: (item, monitor) => {
      return handleDrop(item, monitor) ? { success: true } : undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  drop(containerRef);


  const getStyleForItem = (item) => {
    // Only apply the spanning style if the item is not null
    return item ? {
      gridColumnEnd: `span ${item.width}`,
      gridRowEnd: `span ${item.height}`,
    } : {};
  };

  const shouldHighlight = (index) => {
    return potentialDropIndices.includes(index);
  };

  return (
    <div className='inventory-container' ref={containerRef}>
      {gridItems.map((item, index) => {
        // Determine if this is the top-left corner of the item
        // Render the item only if this condition is true
        const isTopLeftCorner = item && (index % gridSize === 0 || gridItems[index - 1] !== item) && (index < gridSize || gridItems[index - gridSize] !== item);

        const isHighlight = draggedItem && shouldHighlight(index);
        // Apply the spanning style only for the top-left corner of the item
        const slotStyle = isTopLeftCorner ? getStyleForItem(item) : {};

        // If the slot is part of an item but not the top-left corner, don't render anything
        if (item && !isTopLeftCorner) {
          return null;
        }

        return (
          <div className={`inventory-slot ${isHighlight ? 'highlight' : ''}`} key={index} style={slotStyle}>
            {isTopLeftCorner && item ? (
              <div className={`inventory-item ${item.shape}`} style={{ width: '100%', height: '100%' }}>
                {item.name}
              </div>
            ) : (
              !item && 'Empty Slot'
            )}
          </div>
        );
      })}
    </div>
  );
  };

  export default InventoryGrid;