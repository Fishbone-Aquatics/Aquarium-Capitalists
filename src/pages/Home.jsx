// src/pages/Home.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '../components/PlayersShopGrid';
import '../styles/home.css';

function Home() {
  const maxShopSize = useSelector((state) => state.aquarium.maxShopSize);

  return (
    <div className="home-container">
      <Grid gridSize={maxShopSize} />
    </div>
  );
}

export default Home;
