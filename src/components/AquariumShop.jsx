// src/components/AquariumShop.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increaseShopSize, setItems } from '../features/aquariumshop/aquariumSlice';
import { useDrag } from 'react-dnd';
import '../styles/aquariumshop.css';

const ItemTypes = {
  ITEM: 'item',
};

function AquariumShop() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.aquarium.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!items) {
      dispatch(setItems([
        { id: 1, name: '5 Gallon Tank', icon: '/icons/playersStore/5-gallon-tank.png' },
        { id: 2, name: '10 Gallon Tank', icon: '/icons/playersStore/10-gallon-tank.png' },
        { id: 3, name: '20 Gallon Tank', icon: '/icons/playersStore/20-gallon-tank.png' },
      ]));
    } else {
      setLoading(false);
    }
  }, [items, dispatch]);

  const handleIncreaseSize = () => {
    dispatch(increaseShopSize());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="aquarium-shop">
      <h2>Aquarium Shop</h2>
      <div className="shop-items">
        {items.map((item) => (
          <ShopItem key={item.id} item={item} />
        ))}
      </div>
      <button onClick={handleIncreaseSize}>Increase Shop Size</button>
    </div>
  );
}

function ShopItem({ item }) {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item,
  }), [item]);

  return (
    <div ref={drag} className="shop-item">
      <img src={item.icon} alt={item.name} className="item-icon" />
      <p>{item.name}</p>
    </div>
  );
}

export default AquariumShop;
