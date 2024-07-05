// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addItemToInventory, removeItemFromInventory } from '../features/player/playerSlice';

// const InventoryGrid = () => {
//   const inventory = useSelector(state => state.player.inventory);
//   const dispatch = useDispatch();

//   const handleAddItem = (item) => {
//     dispatch(addItemToInventory(item));
//   };

//   const handleRemoveItem = (id) => {
//     dispatch(removeItemFromInventory(id));
//   };

//   return (
//     <div className="inventory-grid">
//       {inventory.map((item, index) => (
//         <div key={index} onClick={() => handleRemoveItem(item.id)}>
//           {item ? item.name : 'Empty Slot'}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default InventoryGrid;

import React from 'react';
import { useSelector } from 'react-redux';

const Inventory = () => {
  const inventory = useSelector(state => state.player.inventory);

  return (
    <div className="inventory-grid">
      {inventory.map((item, index) => (
        <div key={index} className="item-box">
          <div className="item-icon">
            {item ? <img src={`/path/to/icons/${item.name.toLowerCase().replace(" ", "-")}.png`} alt={item.name} /> : <img src="/path/to/icons/empty-slot.png" alt="empty" />}
          </div>
          <div className="item-details">
            {item ? `${item.name} (${item.type}) - Quantity: ${item.quantity}` : 'Empty Slot'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inventory;
