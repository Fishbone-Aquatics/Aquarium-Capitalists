import React, { useRef, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToGrid, moveItemWithinGrid, setDropIndicator } from '../features/aquariumshop/aquariumSlice';
import '../styles/grid.css';

const ItemTypes = {
  ITEM: 'item',
};

const Grid = ({ gridSize }) => {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const gridItems = useSelector((state) => state.aquarium.gridItems || []);
  const dropIndicator = useSelector((state) => state.aquarium.dropIndicator);

  useEffect(() => {
    if (gridRef.current) {
      console.log('Grid ref is set:', gridRef.current);
    }
  }, [gridRef]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.ITEM,
    drop: (item, monitor) => {
      console.log('Item dropped:', item);
      const clientOffset = monitor.getClientOffset();
      console.log('Client offset:', clientOffset);
      const gridRect = gridRef.current ? gridRef.current.getBoundingClientRect() : null;
      console.log('Grid bounding rect:', gridRect);
      if (clientOffset && gridRect) {
        const { x, y } = clientOffset;
        const gridLeft = gridRect.left;
        const gridTop = gridRect.top;
        const cellSize = 100; // Assuming each cell is 100px x 100px

        const col = Math.floor((x - gridLeft) / cellSize);
        const row = Math.floor((y - gridTop) / cellSize);
        const index = row * gridSize + col;

        console.log('Drop position:', { x, y });
        console.log('Grid position:', { row, col });
        console.log('Calculated index:', index);

        if (index >= 0 && index < gridItems.length) {
          if (item.fromShop) {
            // If the item is from the shop, add it to the grid as a new item
            console.log('Dispatching addNewItemToGrid action');
            dispatch(addNewItemToGrid({ item, index }));
          } else {
            // If the item is from the grid, move it within the grid
            console.log('Dispatching moveItemWithinGrid action');
            dispatch(moveItemWithinGrid({ item, index }));
          }
        } else {
          console.warn('Drop index out of bounds:', index);
        }
      } else {
        console.warn('Invalid client offset or grid rect:', clientOffset, gridRect);
      }
      dispatch(setDropIndicator(null));
    },
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const gridRect = gridRef.current ? gridRef.current.getBoundingClientRect() : null;
      if (clientOffset && gridRect) {
        const { x, y } = clientOffset;
        const gridLeft = gridRect.left;
        const gridTop = gridRect.top;
        const cellSize = 100;

        const col = Math.floor((x - gridLeft) / cellSize);
        const row = Math.floor((y - gridTop) / cellSize);

        // Check if the entire item is within the grid bounds
        const withinBounds = col + item.size.cols <= gridSize && row + item.size.rows <= gridSize;

        if (withinBounds) {
          const top = row * cellSize;
          const left = col * cellSize;
          const width = item.size.cols * cellSize;
          const height = item.size.rows * cellSize;

          dispatch(setDropIndicator({ visible: true, top, left, width, height }));
        } else {
          dispatch(setDropIndicator({ visible: false, top: 0, left: 0, width: 0, height: 0 }));
        }
      }
    },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(setDropIndicator(null));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [dispatch, gridSize, gridItems]);

  const checkNoOverlap = (item, index, gridSize, gridItems) => {
    const { rows, cols } = item.size;
    const startRow = Math.floor(index / gridSize);
    const startCol = index % gridSize;

    // Check for out-of-bounds placement
    if (startCol + cols > gridSize || startRow + rows > gridSize) {
      return false;
    }

    // Check the surrounding cells for a one-cell buffer
    for (let r = -1; r <= rows; r++) {
      for (let c = -1; c <= cols; c++) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;
        const targetIndex = targetRow * gridSize + targetCol;
        if (targetRow >= 0 && targetRow < gridSize && targetCol >= 0 && targetCol < gridSize) {
          if (gridItems[targetIndex] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const cells = Array.from({ length: gridSize * gridSize });

  return (
    <div
      ref={node => {
        drop(node);
        gridRef.current = node;
      }}
      className="grid-container"
      style={{ '--grid-size': gridSize }}
    >
      {dropIndicator && dropIndicator.visible && (
        <div
          className="drop-indicator"
          style={{
            top: `${dropIndicator.top}px`,
            left: `${dropIndicator.left}px`,
            width: `${dropIndicator.width}px`,
            height: `${dropIndicator.height}px`,
          }}
        />
      )}
      {cells.map((_, index) => (
        <div key={index} className="grid-cell">
          {gridItems && gridItems[index] && (
            <DraggableItem item={gridItems[index]} index={index} />
          )}
        </div>
      ))}
    </div>
  );
};

const DraggableItem = ({ item, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: { ...item, index, fromShop: false }, // Marking the item as not from the shop
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item, index]);

  return (
    <div ref={drag} className="draggable-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={item.icon} alt={item.name} />
    </div>
  );
};

export default Grid;
