import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot';
import ContextMenu from '../components/ContextMenu';

const Inventory = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, index: null });

  const handleContextMenu = (e, item, index) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item, index });
  };

  const handleOptionClick = (option) => {
    console.log(`Option clicked: ${option}`);
    setContextMenu({ ...contextMenu, visible: false });
    // Handle the option logic here
  };

  const handleClickOutside = () => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handleGridContextMenu = (e) => {
    e.preventDefault();
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  return (
    <div className="inventory-page" onClick={handleClickOutside} onContextMenu={handleGridContextMenu}>
      <h1>{player.name}'s Inventory</h1>
      <div className="inventory-layout">
        <div className="inventory-grid">
          {player.inventory.map((item, index) => (
            <InventorySlot
              key={index}
              item={item}
              index={index}
              dispatch={dispatch}
              onContextMenu={handleContextMenu}
              isContextMenuVisible={contextMenu.visible && contextMenu.index === index}
            />
          ))}
        </div>
      </div>
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={['Sell', 'Eat', 'Open']}
          onOptionClick={handleOptionClick}
        />
      )}
    </div>
  );
};

export default Inventory;
