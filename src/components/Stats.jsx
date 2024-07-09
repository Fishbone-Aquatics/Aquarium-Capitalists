import React from 'react';
import { useSelector } from 'react-redux';

const Stats = () => {
  const stats = useSelector(state => state.player.stats);

  return (
    <div>
      <h3>Stats</h3>
      <ul>
        {Object.entries(stats).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
