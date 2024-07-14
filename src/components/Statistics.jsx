// src/components/Statistics.js
import React from 'react';
import { useSelector } from 'react-redux';

const Statistics = () => {
  const statistics = useSelector((state) => state.expedition.statistics);

  return (
    <div className="statistics">
      <h3>Expedition Statistics</h3>
      <p>You've completed {statistics.expeditionsCompleted} expeditions.</p>
      <p>You've received {statistics.totalCurrency} currency, or {statistics.currencyPerHour} per hour.</p>
      <p>You've earned {statistics.totalXp} XP at a rate of {statistics.xpPerHour} per hour.</p>
      <p>Expedition duration: {statistics.expeditionDuration}.</p> {/* Display the duration from the expedition slice */}
      <h4>Looted Items:</h4>
      <ul>
        {statistics.lootedItems.map((item, index) => (
          <li key={index}>{item.name}: {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
