import React from 'react';
import { useSelector } from 'react-redux';

const Statistics = () => {
  const statistics = useSelector((state) => state.expedition.statistics);

  console.log('Statistics:', statistics);

  return (
    <div className="statistics">
      <h3>Expedition Statistics</h3>
      <p>You've completed {statistics?.expeditionsCompleted?.toLocaleString() || 0} expeditions.</p>
      <p>You've received {statistics?.totalCurrency?.toLocaleString() || 0} currency, or {statistics?.currencyPerHour?.toLocaleString() || 0} per hour.</p>
      <p>You've earned {statistics?.totalXp?.toLocaleString() || 0} XP at a rate of {statistics?.xpPerHour?.toLocaleString() || 0} per hour.</p>
      <p>Expedition duration: {statistics?.expeditionDuration || '0 seconds'}.</p>
      <h4>Looted Items:</h4>
      <ul>
        {statistics?.lootedItems && statistics.lootedItems.length > 0 ? (
          statistics.lootedItems.map((item, index) => (
            <li key={index}>{item.name}: {item.quantity?.toLocaleString() || 0}</li>
          ))
        ) : (
          <li>No items looted yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Statistics;
