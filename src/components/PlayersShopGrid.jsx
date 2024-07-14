// src/components/PlayersShopGrid.jsx
import React from 'react';
import '../styles/grid.css';

const Grid = ({ gridSize }) => {
  // Create an array with the size of gridSize * gridSize
  const cells = Array.from({ length: gridSize * gridSize });

  return (
    <div
      className="grid-container"
      style={{ '--grid-size': gridSize }}
    >
      {cells.map((_, index) => (
        <div key={index} className="grid-cell"></div>
      ))}
    </div>
  );
};

export default Grid;
