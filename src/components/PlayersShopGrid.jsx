// src/components/PlayersShopGrid.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToGrid } from '../features/aquariumshop/aquariumSlice';
import '../styles/grid.css';

const ItemTypes = {
  ITEM: 'item',
};

const Grid = ({ gridSize }) => {
  const dispatch = useDispatch();
  const gridItems = useSelector((state) => state.aquarium.gridItems || []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ITEM,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const { x, y } = clientOffset;
        const row = Math.floor(y / 100);
        const col = Math.floor(x / 100);
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
        console.warn('Invalid client offset:', clientOffset);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dispatch, gridSize, gridItems]);

  const cells = Array.from({ length: gridSize * gridSize });

  return (
    <div
      ref={drop}
      className="grid-container"
      style={{ '--grid-size': gridSize }}
    >
      {cells.map((_, index) => (
        <div key={index} className="grid-cell">
          {gridItems && gridItems[index] && <img src={gridItems[index].icon} alt={gridItems[index].name} />}
        </div>
      ))}
    </div>
  );
};

export default Grid;
