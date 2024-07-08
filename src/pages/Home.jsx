// src/pages/Home.jsx
import React from 'react';
import Grid from '../components/Grid';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Grid gridSize={10} />
    </div>
  );
}

export default Home;
