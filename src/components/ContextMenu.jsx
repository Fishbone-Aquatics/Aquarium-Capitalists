// src/components/ContextMenu.jsx
import React from 'react';
import '../styles/contextmenu.css';

const ContextMenu = ({ x, y, options, onOptionClick }) => {
  return (
    <ul className="context-menu" style={{ top: y, left: x }}>
      {options.map((option, index) => (
        <li key={index} onClick={() => onOptionClick(option)}>
          {option}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;
