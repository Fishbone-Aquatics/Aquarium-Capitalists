import React from 'react';
import { useSelector } from 'react-redux';

const Statistics = () => {
  const statistics = useSelector((state) => state.expedition.statistics);

  console.log('Statistics:', statistics);

  // Helper function to count the number of each looted item
  const countLootedItems = (items) => {
    const itemCounts = {};
    items.forEach(item => {
      if (itemCounts[item.name]) {
        itemCounts[item.name]++;
      } else {
        itemCounts[item.name] = 1;
      }
    });
    return itemCounts;
  };

  const lootedItemCounts = countLootedItems(statistics?.lootedItems || []);

  return (
    <div className="statistics">
      <h3>Expedition Statistics</h3>
      <p>You've completed {statistics?.expeditionsCompleted?.toLocaleString() || 0} expeditions.</p>
      <p>You've received {statistics?.totalCurrency?.toLocaleString() || 0} currency, or {statistics?.currencyPerHour?.toLocaleString() || 0} per hour.</p>
      <p>You've earned {statistics?.totalXp?.toLocaleString() || 0} XP at a rate of {statistics?.xpPerHour?.toLocaleString() || 0} per hour.</p>
      <p>Expedition duration: {statistics?.totalExpeditionDuration || '0 seconds'}.</p>
      <h4>Looted Items:</h4>
      <ul>
        {Object.keys(lootedItemCounts).length > 0 ? (
          Object.entries(lootedItemCounts).map(([itemName, count], index) => (
            <li key={index}>{itemName}: {count.toLocaleString()}</li>
          ))
        ) : (
          <li>No items looted yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Statistics;
