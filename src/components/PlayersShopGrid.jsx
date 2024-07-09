// src/components/Grid.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import '../styles/grid.css';

const Grid = ({ gridSize }) => {
  const [, drop] = useDrop({
    accept: 'shape',
    drop: (item, monitor) => {
      // Handle the drop logic here
    },
  });

  const cells = Array.from({ length: gridSize * gridSize }).map((_, index) => (
    <div key={index} className="grid-cell"></div>
  ));

  return (
    <div className="grid-container" ref={drop}>
      {cells}
    </div>
  );
};

export default Grid;
