// src/components/AquariumShop.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increaseShopSize } from '../features/aquariumshop/aquariumSlice';
import '../styles/aquariumshop.css';

function AquariumShop() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.aquarium.items);

  const handleIncreaseSize = () => {
    dispatch(increaseShopSize());
  };

  return (
    <div className="aquarium-shop">
      <h2>Aquarium Shop</h2>
      <div className="shop-items">
        {items.map((item) => (
          <div key={item.id} className="shop-item">
            <img src={item.icon} alt={item.name} className="item-icon" />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <button onClick={handleIncreaseSize}>Increase Shop Size</button>
    </div>
  );
}

export default AquariumShop;
