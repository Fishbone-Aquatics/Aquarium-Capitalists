import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import '../styles/expeditions.css';
import { randomNumberInRange } from '../utils/randomNumberInRange'; // Import the utility function

const Expeditions = () => {
  const dispatch = useDispatch();
  const activeZone = useSelector((state) => state.expedition.activeZone);
  const zones = useSelector((state) => state.expedition.zones);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (activeZone && !intervalId) {
      const id = setInterval(() => {
        setProgress(prevProgress => prevProgress + 1);
      }, 1000);
      setIntervalId(id);
      console.log(`Expedition started in zone: ${activeZone}`);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [activeZone, intervalId]);

  useEffect(() => {
    if (activeZone) {
      const zone = zones.find(zone => zone.name === activeZone);
      if (progress >= zone.duration) {
        // Calculate XP
        const xp = Math.floor(Math.random() * (zone.xpRange[1] - zone.xpRange[0] + 1)) + zone.xpRange[0];
        dispatch(addXp(xp));

        // Calculate loot drops
        const totalChance = zone.lootDrops.reduce((total, drop) => total + drop.chance, 0);
        const randomChance = Math.random() * totalChance;

        let cumulativeChance = 0;
        for (let drop of zone.lootDrops) {
          cumulativeChance += drop.chance;
          if (randomChance <= cumulativeChance) {
            if (drop.type === 'item') {
              dispatch(addItemToInventory({ item: drop.item }));
              console.log(`Added item: ${drop.item.name} to inventory`);
            } else if (drop.type === 'currency') {
              const amount = randomNumberInRange(drop.amountRange[0], drop.amountRange[1]);
              dispatch(addCurrency(amount));
              console.log(`Added currency: ${amount}`);
            }
            break;
          }
        }

        // Reset progress
        setProgress(0);
      }
    }
  }, [progress, activeZone, zones, dispatch]);

  const handleStart = (zoneName) => {
    dispatch(setActiveZone({ zoneName }));
    setProgress(0);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    dispatch(clearActiveZone());
    setProgress(0);
    console.log('Expedition stopped.');
  };

  return (
    <div>
      <h1>Expeditions</h1>
      <div className="zones">
        {zones.map((zone, index) => (
          <div 
            key={index} 
            className={`zone ${activeZone === zone.name ? 'active' : ''}`} 
            style={{ backgroundImage: `url(${zone.image})` }}
          >
            <div className="header-container">
              <h2>{zone.name}</h2>
              {activeZone !== zone.name && <button onClick={() => handleStart(zone.name)}>Start</button>}
            </div>
            <p>{zone.description}</p>
            {activeZone === zone.name && (
              <>
                <button onClick={handleStop}>Stop</button>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(progress / zone.duration) * 100}%` }}></div>
                  <span>{progress}s / {zone.duration}s</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
