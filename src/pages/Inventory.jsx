import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/inventory.css';
import InventorySlot from '../components/InventorySlot';
import ContextMenu from '../components/ContextMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';
import { setNotificationMessage } from '../features/notifications/notificationSlice';
import resource from '../data/items/items';

const Inventory = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, index: null });
  const [confirmation, setConfirmation] = useState({ visible: false, item: null, index: null });

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const getItemFromResources = (resource, itemId) => {
    const flattenedResources = Object.values(resource).reduce((acc, curr) => {
      if (typeof curr === 'object') {
        Object.values(curr).forEach(item => {
          acc.push(item);
        });
      }
      return acc;
    }, []);
    return flattenedResources.find(item => item.id === itemId);
  };

  const generateContents = (resource, items, currency) => {
    const contents = [];

    if (currency.length > 0 && Math.random() > 0.5) {
      const selectedCurrency = currency[getRandomInt(currency.length)];
      contents.push({ type: 'currency', amount: selectedCurrency });
    } else if (items.length > 0) {
      const itemId = items[getRandomInt(items.length)];
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
      const totalValue = contextMenu.item.sellValue * contextMenu.item.quantity;
      const sellMessage = `Sell ${contextMenu.item.quantity} ${contextMenu.item.name}(s) for ${totalValue} currency?`;
      setConfirmation({
        visible: true,
        item: contextMenu.item,
        index: contextMenu.index,
        message: sellMessage,
      });
    } else if (option.startsWith('Open')) {
      const openAll = option === 'Open (All)';
      const chestQuantity = openAll ? contextMenu.item.quantity : 1;

      const allContents = [];

      for (let i = 0; i < chestQuantity; i++) {
        const chestContents = openTreasureChest(contextMenu.item);
        allContents.push(...chestContents);

        chestContents.forEach((content) => {
          if (content.type === 'currency') {
            dispatch({
              type: 'player/addCurrency',
              payload: content.amount,
            });
          } else if (content.type === 'item' && content.item) {
            dispatch({
              type: 'player/addItemToInventory',
              payload: { item: content.item },
            });
          } else {
            console.error('Invalid item content:', content);
          }
        });
      }

      const itemCounts = allContents.reduce((acc, content) => {
        if (content.type === 'item') {
          acc[content.item.name] = (acc[content.item.name] || 0) + 1;
        }
        return acc;
      }, {});

      const receivedCurrency = allContents
        .filter(content => content.type === 'currency')
        .reduce((acc, content) => acc + content.amount, 0);

      const itemMessages = Object.entries(itemCounts).map(([name, count]) => `${name} (x${count})`).join(', ');

      let notificationMessage = '';
      if (itemMessages) {
        notificationMessage += `Received items: ${itemMessages}. `;
      }
      if (receivedCurrency > 0) {
        notificationMessage += `Received currency: ${receivedCurrency}.`;
      }

      dispatch(setNotificationMessage(notificationMessage));

      dispatch({
        type: 'player/updateItemQuantity',
        payload: { itemId: contextMenu.item.id, quantity: contextMenu.item.quantity - chestQuantity },
      });
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
        quantity: confirmation.item.quantity,
        index: confirmation.index,
      },
    });
    setConfirmation({ visible: false, item: null, index: null });
  };

  const handleSellCancel = () => {
    setConfirmation({ visible: false, item: null, index: null });
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
          message={confirmation.message}
          onConfirm={handleSellConfirm}
          onCancel={handleSellCancel}
        />
      )}
      <Notification />
    </div>
  );
};

export default Inventory;
