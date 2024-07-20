import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot';
import ContextMenu from '../components/ContextMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import resource from '../data/items/items';

const Inventory = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, index: null });
  const [confirmation, setConfirmation] = useState({ visible: false, item: null, quantity: 0 });

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const getItemFromResources = (resource, itemId) => {
    // Flatten the nested resource objects
    const flattenedResources = Object.values(resource).reduce((acc, curr) => {
      if (typeof curr === 'object') {
        Object.values(curr).forEach(item => {
          acc.push(item);
        });
      }
      return acc;
    }, []);

    // Find the item by its id
    return flattenedResources.find(item => item.id === itemId);
  };

  const generateContents = (resource, items, currency) => {
    const contents = [];

    // Randomly select a currency amount
    if (currency.length > 0 && Math.random() > 0.5) {
      const selectedCurrency = currency[getRandomInt(currency.length)];
      contents.push({ type: 'currency', amount: selectedCurrency });
    } else if (items.length > 0) { // Ensure only one type is selected
      const itemId = items[getRandomInt(items.length)];
      console.log("itemId-----------------", itemId);
      console.log('resource obj', Object.values(resource));
      const item = getItemFromResources(resource, itemId);
      if (item) {
        contents.push({ type: 'item', item });
      } else {
        console.error(`Item with ID ${itemId} not found in resource.`);
      }
    }

    return contents;
  };

  const openTreasureChest = (chest) => {
    if (!chest.contents) {
      console.error(`No contents defined for chest with ID: ${chest.id}`);
      return [];
    }
    const { currency = [], items = [] } = chest.contents;
    return generateContents(resource, items, currency);
  };

  const handleContextMenu = (e, item, index) => {
    e.preventDefault();

    const options = ['Sell'];
    if (item.contents) {
      options.push('Open (1)', 'Open (All)');
    }

    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item, index, options });
  };

  const handleOptionClick = (option) => {
    if (option === 'Sell') {
      setConfirmation({ visible: true, item: contextMenu.item, quantity: contextMenu.item.quantity });
    } else if (option.startsWith('Open')) {
      const openAll = option === 'Open (All)';
      const chestQuantity = openAll ? contextMenu.item.quantity : 1;

      for (let i = 0; i < chestQuantity; i++) {
        const chestContents = openTreasureChest(contextMenu.item);
        chestContents.forEach((content) => {
          if (content.type === 'currency') {
            dispatch({
              type: 'player/addCurrency',
              payload: content.amount,
            });
            console.log(`Opened a chest and received ${content.amount} currency`);
          } else if (content.type === 'item' && content.item) {
            dispatch({
              type: 'player/addItemToInventory',
              payload: { item: content.item },
            });
            console.log(`Opened a chest and received an item: ${content.item.name}`);
          } else {
            console.error('Invalid item content:', content);
          }
        });
      }

      // Adjust the quantity of treasure chests in the inventory
      const newQuantity = contextMenu.item.quantity - chestQuantity;
      if (newQuantity > 0) {
        dispatch({
          type: 'player/updateItemQuantity',
          payload: { itemId: contextMenu.item.id, quantity: newQuantity },
        });
      } else {
        dispatch({
          type: 'player/removeItemFromInventory',
          payload: { itemId: contextMenu.item.id, quantity: chestQuantity },
        });
      }
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
          options={contextMenu.options}
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
