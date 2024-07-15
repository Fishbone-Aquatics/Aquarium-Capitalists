// src/components/PlayersShopGrid.jsx
import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToGrid, setDropIndicator } from '../features/aquariumshop/aquariumSlice';
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
          console.log('Dispatching addItemToGrid action');
          dispatch(addItemToGrid({ item, index }));
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

        const top = row * cellSize;
        const left = col * cellSize;
        const width = item.size.cols * cellSize;
        const height = item.size.rows * cellSize;

        dispatch(setDropIndicator({ visible: true, top, left, width, height }));
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
          {gridItems && gridItems[index] && <img src={gridItems[index].icon} alt={gridItems[index].name} />}
        </div>
      ))}
    </div>
  );
};

export default Grid;
