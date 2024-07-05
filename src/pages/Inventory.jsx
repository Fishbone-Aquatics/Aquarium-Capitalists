import React from 'react';
import { useSelector } from 'react-redux';
import '../css/inventory.css'; // Ensure this CSS file contains the necessary styles

function Home() {
  const player = useSelector(state => state.player);

  return (
    <div>
      <h1>{player.name}'s Inventory</h1>
      <h2>Inventory:</h2>
      <div className="inventory-grid">
        {player.inventory.map((item, index) => (
          <div key={index} className="item-box">
            <div className="item-icon">
              {item ? <img src={item.image} alt={item.name} /> : <img src="icons/backpack.svg" alt="empty" />}
            </div>
            <div className="item-details">
              {item ? `${item.name} (${item.type}) - Quantity: ${item.quantity}` : 'Empty Slot'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
