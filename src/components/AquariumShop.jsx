// src/components/AquariumShop.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { increaseShopSize } from '../features/aquariumshop/aquariumSlice';
import '../styles/aquariumshop.css';

function AquariumShop() {
  const dispatch = useDispatch();

  const handleIncreaseSize = () => {
    dispatch(increaseShopSize());
  };

  return (
    <div className="aquarium-shop">
      <h2>Aquarium Shop</h2>
      {/* Placeholder items */}
      <div className="shop-items">
        <div className="shop-item">Item 1</div>
        <div className="shop-item">Item 2</div>
        <div className="shop-item">Item 3</div>
      </div>
      <button onClick={handleIncreaseSize}>Increase Shop Size</button>
    </div>
  );
}

export default AquariumShop;
