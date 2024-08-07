import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDropIndicator, increaseShopSize, setItems } from '../features/aquariumshop/aquariumSlice';
import { useDrag } from 'react-dnd';
import '../styles/aquariumshop.css';

const ItemTypes = {
  ITEM: 'item',
};

function AquariumShop() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.aquarium.items);
  const maxShopSize = useSelector((state) => state.aquarium.maxShopSize);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!items) {
      dispatch(setItems([
        { id: 1, name: '5 Gallon Tank', icon: '/icons/playersStore/5-gallon-tank.png', size: { rows: 1, cols: 1 } },
        { id: 2, name: '10 Gallon Tank', icon: '/icons/playersStore/10-gallon-tank.png', size: { rows: 2, cols: 2 } },
        { id: 3, name: '20 Gallon Tank', icon: '/icons/playersStore/20-gallon-tank.png', size: { rows: 2, cols: 3 } },
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
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: { ...item, fromShop: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log('Drag ended:', { item, didDrop: monitor.didDrop() });
      if (!monitor.didDrop()) {
        dispatch(setDropIndicator({ visible: false, top: 0, left: 0, width: 0, height: 0 })); // Reset drop indicator
      }
    },
  }), [item, dispatch]);

  return (
    <div ref={drag} className="shop-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={item.icon} alt={item.name} className="item-icon" />
    </div>
  );
}

export default AquariumShop;
