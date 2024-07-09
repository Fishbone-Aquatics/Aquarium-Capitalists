import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveZone, clearActiveZone } from '../features/expeditions/expeditionSlice';
import { addXp, addItemToInventory, addCurrency } from '../features/player/playerSlice';
import '../styles/expeditions.css';

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

        // Calculate item drops
        zone.itemDrops.forEach(drop => {
          if (Math.random() < drop.chance) {
            dispatch(addItemToInventory({ item: drop.item }));
          }
        });

        // Calculate currency drops
        zone.currencyDrops.forEach(drop => {
          if (Math.random() < drop.chance) {
            dispatch(addCurrency(drop.amount));
          }
        });

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
  };

  return (
    <div>
      <h1>Expeditions</h1>
      <div className="zones">
        {zones.map((zone, index) => (
          <div key={index} className={`zone ${activeZone === zone.name ? 'active' : ''}`}>
            <h2>{zone.name}</h2>
            <p>{zone.description}</p>
            {activeZone === zone.name ? (
              <>
                <button onClick={handleStop}>Stop</button>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(progress / zone.duration) * 100}%` }}></div>
                  <span>{progress}s / {zone.duration}s</span>
                </div>
              </>
            ) : (
              <button onClick={() => handleStart(zone.name)}>Start</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expeditions;
