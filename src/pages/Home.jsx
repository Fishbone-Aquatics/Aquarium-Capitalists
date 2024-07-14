// src/pages/Home.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '../components/PlayersShopGrid';
import { increaseShopSize } from '../features/aquariumshop/aquariumSlice';
import '../styles/home.css';

function Home() {
  const dispatch = useDispatch();
  const maxShopSize = useSelector((state) => state.aquarium.maxShopSize);

  const handleIncreaseSize = () => {
    dispatch(increaseShopSize());
  };

  return (
    <div className="home-container">
      <Grid gridSize={maxShopSize} />
    </div>
  );
}

export default Home;
