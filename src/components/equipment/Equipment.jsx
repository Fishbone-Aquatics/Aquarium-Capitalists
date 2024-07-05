import React from 'react';
import { useSelector } from 'react-redux';

const Equipment = () => {
    const equipment = useSelector(state => state.player.equipment);
  
    return (
      <div className="equipment-grid">
        {Object.entries(equipment).map(([slot, item]) => (
          <div key={slot} className="item-box">
            <div className="item-icon">
              {item ? <img src={item.image} alt={item.name} /> : <img src="icons/backpack.svg" alt="empty" />}
            </div>
            <div className="item-details">
              {item ? `${item.name} (${item.type})` : 'Empty Slot'}
            </div>
          </div>
        ))}
      </div>
    );
  };
  

export default Equipment;
