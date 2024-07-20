import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot';
import ContextMenu from '../components/ContextMenu';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the confirmation modal component

const Inventory = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, index: null });
  const [confirmation, setConfirmation] = useState({ visible: false, item: null, quantity: 0 });

  const handleContextMenu = (e, item, index) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item, index });
  };

  const handleOptionClick = (option) => {
    console.log(`Option clicked: ${option}`);
    if (option === 'Sell') {
      setConfirmation({ visible: true, item: contextMenu.item, quantity: contextMenu.item.quantity }); // Set quantity to item's quantity
    }
    setContextMenu({ ...contextMenu, visible: false });
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

  const handleSellConfirm = () => {
    dispatch({
      type: 'player/sellItem',
      payload: {
        itemId: confirmation.item.id,
        quantity: confirmation.quantity,
      },
    });
    setConfirmation({ visible: false, item: null, quantity: 0 });
  };

  const handleSellCancel = () => {
    setConfirmation({ visible: false, item: null, quantity: 0 });
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
      {confirmation.visible && (
        <ConfirmationModal
          message={`Are you sure you want to sell ${confirmation.quantity} ${confirmation.item.name}(s) for ${confirmation.item.sellValue * confirmation.quantity || 0} currency?`}
          onConfirm={handleSellConfirm}
          onCancel={handleSellCancel}
        />
      )}
    </div>
  );
};

export default Inventory;
