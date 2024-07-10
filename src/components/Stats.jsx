import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/stats.css';

const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

const Stats = () => {
  const stats = useSelector(state => state.player.stats);
  const skillBoostPercent = useSelector(state => state.player.skillBoostPercent);
  const gatheringSpeed = useSelector(state => state.player.gatheringSpeed);
  const gatheringEfficiency = useSelector(state => state.player.gatheringEfficiency);
  const expeditionSpeed = useSelector(state => state.player.expeditionSpeed);
  const maxInventorySlots = useSelector(state => state.player.maxInventorySlots);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible(!isPopupVisible);

  return (
    <div>
      <h3>
        Stats
        <button className="button" onClick={togglePopup}>Advanced</button>
      </h3>
      <ul>
        {Object.entries(stats).map(([key, value]) => (
          <li key={key}>{formatKey(key)}: {value}</li>
        ))}
      </ul>

      {isPopupVisible && (
        <>
          <div className="overlay" onClick={togglePopup} />
          <div className="popup">
            <h4>Advanced Stats</h4>
            <ul>
              <li>Skill Boost Percent: {skillBoostPercent}</li>
              <li>Gathering Speed: {gatheringSpeed}</li>
              <li>Gathering Efficiency: {gatheringEfficiency}</li>
              <li>Expedition Speed: {expeditionSpeed}</li>
              <li>Max Inventory Slots: {maxInventorySlots}</li>
            </ul>
            <button className="button" onClick={togglePopup}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
