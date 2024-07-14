// src/components/Statistics.js
import React from 'react';
import { useSelector } from 'react-redux';

const Statistics = () => {
  const statistics = useSelector((state) => state.expedition.statistics);

  return (
    <div className="statistics">
      <h2>Expedition Statistics</h2>
      <p>You've completed {statistics.expeditionsCompleted} expeditions.</p>
      <p>You've received {statistics.totalCurrency} currency, or {statistics.currencyPerHour} an hour.</p>
      <p>You've earned {statistics.totalXp} XP at a rate of {statistics.xpPerHour} XP an hour.</p>
      <h3>Looted Items:</h3>
      <ul>
        {statistics.lootedItems.map((item, index) => (
          <li key={index}>{item.quantity}x {item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
